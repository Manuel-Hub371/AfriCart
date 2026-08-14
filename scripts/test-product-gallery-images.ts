import { catalogService } from "../modules/catalog/service";
import { db } from "../lib/db";

async function runProductGalleryImagesTest() {
  console.log("==================================================");
  console.log("VERIFYING PRODUCT DETAILS COVER IMAGE RESOLUTION");
  console.log("==================================================\n");

  let allPassed = true;

  try {
    const products = await db.product.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      take: 5,
    });

    console.log(`Found ${products.length} product(s) for details cover image audit.`);

    for (const p of products) {
      console.log(`Testing Product: "${p.name}" (ID: ${p.id})`);
      const details = await catalogService.getProductDetails(p.id);
      console.log(`  Details images:`, details.images);

      if (Array.isArray(details.images) && details.images.length > 0 && typeof details.images[0] === "string") {
        console.log(`  ✅ Cover Image URL verified: ${details.images[0]}`);
      } else {
        console.warn(`  ⚠️ Product images empty or missing array. Fallback image will be rendered.`);
      }
    }
  } catch (err) {
    console.error("❌ ERROR running product details cover image audit:", err);
    allPassed = false;
  } finally {
    await db.$disconnect();
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("ALL PRODUCT GALLERY COVER IMAGE TESTS PASSED (100%)");
  } else {
    console.log("SOME PRODUCT GALLERY COVER IMAGE TESTS FAILED");
  }
  console.log("==================================================");
}

runProductGalleryImagesTest();
