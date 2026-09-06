// Clear dummy catalog data (seeded with the OLD monolith seed) from a database.
//
// Deletes ALL products and stores (and their order items/orders referencing those
// products) in FK-safe order, keeping base reference data intact:
//   - Roles, permissions, official StoreCategories, product Categories
//   - User accounts, customer/vendor profiles, addresses, payment methods, messages
//
// Usage:
//   npm run db:clear-dummy            -> DRY RUN: prints what would be deleted
//   npm run db:clear-dummy -- --apply -> actually deletes
//   --env <file> can load a KEY=VALUE env file (e.g. --env ../.env)
//   Requires DATABASE_URL in the environment.

import { readFileSync, existsSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

function setFromEnvFile(filePath: string): void {
  if (!existsSync(filePath)) return;
  for (const rawLine of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

async function main() {
  const apply = process.argv.includes("--apply");
  const envArg = process.argv.find((a) => a.startsWith("--env="));
  const candidates = [
    envArg && envArg.slice("--env=".length),
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), ".env"),
    path.resolve(process.cwd(), "..", ".env"),
  ].filter((f): f is string => Boolean(f));
  for (const file of candidates) setFromEnvFile(file);

  if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL is required (use --env=<file> or the environment).");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const started = Date.now();
  let result: Record<string, number>;

  if (!apply) {
    const [products, stores, orderItems, orders] = await Promise.all([
      prisma.product.count(),
      prisma.store.count(),
      prisma.orderItem.count(),
      prisma.order.count(),
    ]);
    result = { products, stores, orderItems, orders };
    console.log(JSON.stringify({ level: "info", msg: "DRY RUN — no changes made. Re-run with --apply to delete.", ts: new Date().toISOString(), wouldDelete: result }));
  } else {
    result = await prisma.$transaction(async (tx) => {
      const productIds = (await tx.product.findMany({ select: { id: true } })).map((p) => p.id);

      // Orders that reference the dummy products must be cleared too (OrderItem.product
      // is a Restrict relation), otherwise product deletion would fail.
      const orderIds = [
        ...new Set(
          (await tx.orderItem.findMany({ where: { productId: { in: productIds } }, select: { orderId: true } })).map((i) => i.orderId)
        ),
      ];

      const deletedOrderItems = await tx.orderItem.deleteMany({ where: { productId: { in: productIds } } });
      const deletedOrders = await tx.order.deleteMany({ where: { id: { in: orderIds } } });
      const deletedProducts = await tx.product.deleteMany({ where: { id: { in: productIds } } });
      const deletedStores = await tx.store.deleteMany({});

      return {
        products: deletedProducts.count,
        stores: deletedStores.count,
        orderItems: deletedOrderItems.count,
        orders: deletedOrders.count,
      };
    });
    console.log(JSON.stringify({ level: "info", msg: "dummy catalog cleared", ts: new Date().toISOString(), durationMs: Date.now() - started, deleted: result }));
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("clear-dummy-catalog aborted:", err);
  process.exit(1);
});