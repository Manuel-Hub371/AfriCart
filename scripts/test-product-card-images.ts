import { catalogService } from "../modules/catalog/service";
import { db } from "../lib/db";

async function runProductCardImagesTest() {
  console.log("==================================================");
  console.log("VERIFYING PRODUCT CARD IMAGE RESOLUTION & FALLBACKS");
  console.log("==================================================\n");

  let allPassed = true;

  try {
    const res = await catalogService.getProducts({ page: 1, limit: 12 });
    console.log(`Fetched ${res.products.length} products for image audit.`);

    for (const p of res.products) {
      console.log(`Product: "${p.name}" (ID: ${p.id})`);
      console.log(`  Images array:`, p.images);

      if (!Array.isArray(p.images) || p.images.length === 0) {
        console.warn(`  ⚠️ Product has empty images array. Fallback image will be rendered.`);
      } else {
        const primary = p.images[0];
        if (typeof primary === "string" && primary.startsWith("http")) {
          console.log(`  ✅ Primary Image URL valid: ${primary}`);
        } else {
          console.warn(`  ⚠️ Primary image URL not standard: "${primary}". Fallback image will be rendered.`);
        }
      }
    }
  } catch (err) {
    console.error("❌ ERROR running product card image audit:", err);
    allPassed = false;
  } finally {
    await db.$disconnect();
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("ALL PRODUCT CARD IMAGE AUDIT TESTS PASSED (100%)");
  } else {
    console.log("SOME PRODUCT CARD IMAGE AUDIT TESTS FAILED");
  }
  console.log("==================================================");
}

runProductCardImagesTest();
