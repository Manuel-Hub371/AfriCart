import { extractCoverImage, getCategoryFallbackImage } from "../lib/image-utils";
import { db } from "../lib/db";

async function runProductCoverImageAuditTest() {
  console.log("==================================================");
  console.log("AUDITING PRODUCT COVER CARD IMAGES");
  console.log("==================================================\n");

  let allPassed = true;

  // Unit tests for extractCoverImage
  console.log("Testing extractCoverImage utility...");

  const test1 = extractCoverImage(["https://my-cdn.com/cover-image.jpg", "https://my-cdn.com/thumb2.jpg"]);
  if (test1 === "https://my-cdn.com/cover-image.jpg") {
    console.log("  ✅ PASS: Array format returns index 0 cover image.");
  } else {
    console.error(`  ❌ FAIL: Array format failed. Expected 'https://my-cdn.com/cover-image.jpg', got '${test1}'`);
    allPassed = false;
  }

  const test2 = extractCoverImage("uploads/products/item1.png");
  if (test2 === "/uploads/products/item1.png") {
    console.log("  ✅ PASS: Relative path without leading slash normalized to '/uploads/products/item1.png'.");
  } else {
    console.error(`  ❌ FAIL: Relative path normalization failed. Got '${test2}'`);
    allPassed = false;
  }

  const test3 = extractCoverImage(JSON.stringify(["https://example-shop.com/cover.webp", "https://example-shop.com/side.webp"]));
  if (test3 === "https://example-shop.com/cover.webp") {
    console.log("  ✅ PASS: JSON stringified array correctly parsed to index 0 cover image.");
  } else {
    console.error(`  ❌ FAIL: JSON string parsing failed. Got '${test3}'`);
    allPassed = false;
  }

  const test4 = extractCoverImage("https://cdn.com/img1.jpg, https://cdn.com/img2.jpg");
  if (test4 === "https://cdn.com/img1.jpg") {
    console.log("  ✅ PASS: Comma separated image string correctly parsed to first image.");
  } else {
    console.error(`  ❌ FAIL: Comma separated parsing failed. Got '${test4}'`);
    allPassed = false;
  }

  // Database products test
  console.log("\nAuditing actual database products for cover image parsing...");
  try {
    const products = await db.product.findMany({
      where: { deletedAt: null },
      take: 10,
    });

    console.log(`Auditing ${products.length} product(s) from database.`);
    for (const p of products) {
      const cover = extractCoverImage(p.images as any, p.name, p.categoryName || undefined);
      console.log(`Product "${p.name}": Cover Image = "${cover || "Fallback Image Used"}"`);
    }
  } catch (err) {
    console.error("❌ Error querying database products:", err);
  } finally {
    await db.$disconnect();
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("ALL PRODUCT COVER CARD IMAGE AUDIT TESTS PASSED (100%)");
  } else {
    console.log("SOME AUDIT TESTS FAILED");
  }
  console.log("==================================================");
}

runProductCoverImageAuditTest();
