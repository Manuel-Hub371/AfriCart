import { db } from "../lib/db";

async function inspectProductImages() {
  console.log("==================================================");
  console.log("INSPECTING PRODUCT COVER IMAGES IN DATABASE");
  console.log("==================================================\n");

  const products = await db.product.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      name: true,
      brand: true,
      images: true,
      categoryName: true,
    },
    take: 20,
  });

  console.log(`Found ${products.length} products.\n`);

  for (const p of products) {
    console.log(`Product: "${p.name}" (ID: ${p.id})`);
    console.log(`  Raw images field:`, JSON.stringify(p.images));
    console.log(`  Type of images:`, typeof p.images, Array.isArray(p.images) ? `Array length ${p.images.length}` : "Not Array");
    if (Array.isArray(p.images) && p.images.length > 0) {
      console.log(`  First Image element [0]:`, JSON.stringify(p.images[0]));
    }
    console.log("--------------------------------------------------");
  }

  await db.$disconnect();
}

inspectProductImages();
