import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { ensureDemoMarketplace, ensureDemoMarketplaceIfEmpty } from "../lib/db/marketplace-bootstrap";

const prisma = new PrismaClient();

// Load DB credentials from a local env file when DATABASE_URL is not already set
// (bare `tsx prisma/seed.ts` does not auto-load .env; Prisma CLI / Render builds do).
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

for (const file of [
  path.join(process.cwd(), ".env.local"),
  path.join(process.cwd(), ".env"),
  path.resolve(process.cwd(), "..", ".env"),
]) {
  setFromEnvFile(file);
}

const OFFICIAL_STORE_CATEGORIES = [
  { name: "Electronics & Gadget", slug: "electronics-gadget", description: "Consumer electronics, smartphones, accessories, computing, and home entertainment." },
  { name: "Home & Living", slug: "home-living", description: "Furniture, home decor, kitchenware, bedding, lighting, and home improvement." },
  { name: "Fashion & Appeal", slug: "fashion-appeal", description: "Clothing, footwear, jewelry, watches, bags, and fashion accessories." },
  { name: "Beauty & Personal Care", slug: "beauty-personal-care", description: "Cosmetics, skincare, haircare, fragrances, and personal grooming products." },
  { name: "Food & Gorrices", slug: "food-gorrices", description: "Fresh produce, packaged foods, beverages, snacks, and daily household essentials." },
  { name: "Pharmacy & Health", slug: "pharmacy-health", description: "Over-the-counter health products, vitamins, supplements, and medical wellness supplies." },
  { name: "Automotive & Automobile", slug: "automotive-automobile", description: "Vehicle parts, auto accessories, car care, tools, and automotive electronics." },
  { name: "Sorts & Fitness", slug: "sorts-fitness", description: "Sports gear, outdoor equipment, athletic wear, fitness instruments, and activewear." },
  { name: "Books & Stationery", slug: "books-stationery", description: "Educational books, literature, office supplies, art materials, and stationery items." },
];

async function seedRoles() {
  await prisma.role.upsert({
    where: { name: "CUSTOMER" },
    update: {},
    create: { name: "CUSTOMER", description: "Standard shopper" },
  });

  await prisma.role.upsert({
    where: { name: "VENDOR" },
    update: {},
    create: { name: "VENDOR", description: "Merchant store seller" },
  });

  return prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN", description: "Platform administrator" },
  });
}

async function seedStoreCategories() {
  for (const cat of OFFICIAL_STORE_CATEGORIES) {
    await prisma.storeCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: { name: cat.name, slug: cat.slug, description: cat.description },
    });
  }
}

/**
 * Idempotent admin bootstrap.
 * - Uses ADMIN_EMAIL / ADMIN_FIRST_NAME / ADMIN_LAST_NAME if provided.
 * - If the admin already exists its passwordHash is NEVER overwritten (so a redeploy
 *   after a password change does not silently reset it back to the default).
 * - Only fixes status/verification flags on the existing account.
 */
async function seedAdmin(adminRole: { id: string }) {
  const email = (process.env.ADMIN_EMAIL || "admin@africart.com").trim().toLowerCase();
  const firstName = process.env.ADMIN_FIRST_NAME || "AfriCart";
  const lastName = process.env.ADMIN_LAST_NAME || "Administrator";

  const existing = await prisma.user.findUnique({ where: { email } });

  let adminUser: NonNullable<typeof existing>;
  if (existing) {
    const needsUpdate =
      existing.status !== "ACTIVE" ||
      !existing.emailVerified ||
      existing.emailVerificationStatus !== "VERIFIED";
    adminUser = needsUpdate
      ? await prisma.user.update({
          where: { id: existing.id },
          data: {
            status: "ACTIVE",
            emailVerified: true,
            emailVerificationStatus: "VERIFIED",
          },
        })
      : existing;
  } else {
    const password = process.env.ADMIN_PASSWORD || "password123";
    const passwordHash = await bcrypt.hash(password, 10);
    adminUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash,
        status: "ACTIVE",
        emailVerified: true,
        emailVerificationStatus: "VERIFIED",
      },
    });
  }

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });

  console.log(`Admin account ready: ${email}`);
}

/**
 * Optional demo catalog (opt-in via SEED_DEMO_DATA=true).
 * Creates a real vendor account + a public ACTIVE store with a few products so the
 * discovery pages render actual data. Never runs unless explicitly enabled.
 */
async function seedDemoData() {
  const explicit = (process.env.SEED_DEMO_DATA || "").trim().toLowerCase();

  if (explicit === "false") {
    console.log("Demo data disabled (SEED_DEMO_DATA=false).");
    return;
  }

  if (explicit === "true") {
    await ensureDemoMarketplace(prisma);
    console.log("Demo marketplace seeded (SEED_DEMO_DATA=true).");
    return;
  }

  // Auto-bootstrap: only seed when the marketplace has no publicly visible store
  // yet (fresh deployments). Additive and idempotent.
  const result = await ensureDemoMarketplaceIfEmpty(prisma);
  console.log(
    result.seeded
      ? "Auto-seeded demo marketplace (marketplace was empty)."
      : `Demo data skipped (${result.reason || "marketplace already has stores"}).`
  );
}

async function main() {
  console.log("Seeding base database parameters...");

  const adminRole = await seedRoles();
  await seedStoreCategories();
  await seedAdmin(adminRole);

  // Category count summary for logs
  const storeCategoryCount = await prisma.storeCategory.count();
  console.log(`Store categories ready: ${storeCategoryCount}`);

  await seedDemoData();

  console.log("Database base seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });