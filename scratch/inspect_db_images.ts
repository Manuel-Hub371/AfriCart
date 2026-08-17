import { db } from "../lib/db";

async function inspectImages() {
  console.log("=== INSPECTING DB PRODUCT IMAGES ===");
  const products = await db.product.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, images: true, store: { select: { name: true } } },
  });

  for (const p of products) {
    console.log(`\nProduct: "${p.name}" (ID: ${p.id}) [Store: ${p.store?.name}]`);
    console.log(`  Raw images type: ${typeof p.images}`);
    console.log(`  Is Array: ${Array.isArray(p.images)}`);
    console.log(`  Raw value:`, JSON.stringify(p.images));
  }
}

inspectImages().finally(() => db.$disconnect());
