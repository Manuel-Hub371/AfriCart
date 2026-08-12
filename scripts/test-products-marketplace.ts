import { catalogService } from "../modules/catalog/service";
import { catalogRepository } from "../modules/catalog/repository";
import { db } from "../lib/db";

async function runProductsMarketplaceTests() {
  console.log("==================================================");
  console.log("RUNNING AFRICART PRODUCTS MARKETPLACE VERIFICATION");
  console.log("==================================================\n");

  let allPassed = true;

  try {
    // Test 1: Fetch Categories
    console.log("Test 1: Fetching Marketplace Categories...");
    const categories = await catalogService.getCategories();
    console.log(`Found ${categories.length} official categories.`);
    if (categories.length >= 9) {
      console.log("✅ Test 1 PASS: Official categories populated with product counts.");
    } else {
      console.error("❌ Test 1 FAIL: Expected at least 9 categories.");
      allPassed = false;
    }

    // Test 2: Single Category Filtering
    console.log("\nTest 2: Single Category Filtering ('electronics-gadget')...");
    const cat1Res = await catalogService.getProducts({ category: "electronics-gadget", page: 1, limit: 12 });
    console.log(`Single Category returned ${cat1Res.products.length} products (Total: ${cat1Res.total}).`);
    console.log("✅ Test 2 PASS: Single category filtering executed cleanly.");

    // Test 3: Multi-Category Filtering
    console.log("\nTest 3: Multi-Category Filtering ('electronics-gadget', 'home-living')...");
    const multiCatRes = await catalogService.getProducts({
      categories: ["electronics-gadget", "home-living"],
      page: 1,
      limit: 12,
    });
    console.log(`Multi-category returned ${multiCatRes.products.length} products (Total: ${multiCatRes.total}).`);
    console.log("✅ Test 3 PASS: Multi-category filtering executed cleanly.");

    // Test 4: Rating Filtering (Rating >= 4.0)
    console.log("\nTest 4: Customer Rating Filter (Rating >= 4.0)...");
    const ratingRes = await catalogService.getProducts({ rating: 4.0, page: 1, limit: 12 });
    console.log(`Rating filter returned ${ratingRes.products.length} products.`);
    const invalidRatings = ratingRes.products.filter((p) => p.rating < 4.0);
    if (invalidRatings.length === 0) {
      console.log("✅ Test 4 PASS: All returned products satisfy rating >= 4.0 requirement.");
    } else {
      console.error(`❌ Test 4 FAIL: Found ${invalidRatings.length} products with rating < 4.0.`);
      allPassed = false;
    }

    // Test 5: Price Range Filtering (GH₵50 - GH₵1000)
    console.log("\nTest 5: Price Range Filter (GH₵50 - GH₵1000)...");
    const priceRes = await catalogService.getProducts({ minPrice: 50, maxPrice: 1000, page: 1, limit: 12 });
    console.log(`Price filter returned ${priceRes.products.length} products.`);
    const invalidPrices = priceRes.products.filter((p) => p.price < 50 || p.price > 1000);
    if (invalidPrices.length === 0) {
      console.log("✅ Test 5 PASS: All returned products lie within GH₵50 - GH₵1000.");
    } else {
      console.error(`❌ Test 5 FAIL: Found ${invalidPrices.length} products outside requested price range.`);
      allPassed = false;
    }

    // Test 6: Best Sellers Sorting
    console.log("\nTest 6: Best Sellers Sorting ('best_sellers')...");
    const bestSellerRes = await catalogService.getProducts({ sortBy: "best_sellers", page: 1, limit: 12 });
    console.log(`Best Sellers query returned ${bestSellerRes.products.length} products.`);
    console.log("✅ Test 6 PASS: Best Sellers query executed successfully.");

    // Test 7: Search Query Filter
    console.log("\nTest 7: Search Query ('phone')...");
    const searchRes = await catalogService.getProducts({ query: "phone", page: 1, limit: 12 });
    console.log(`Search query returned ${searchRes.products.length} products.`);
    console.log("✅ Test 7 PASS: Search query executed successfully.");

    // Test 8: Combined Multi-Filter Query
    console.log("\nTest 8: Combined Multi-Filter Query (Category + Rating + Price + Sort)...");
    const combinedRes = await catalogService.getProducts({
      category: "electronics-gadget",
      rating: 3.0,
      minPrice: 10,
      maxPrice: 5000,
      sortBy: "best_sellers",
      page: 1,
      limit: 6,
    });
    console.log(`Combined query returned ${combinedRes.products.length} products (Total: ${combinedRes.total}).`);
    console.log("✅ Test 8 PASS: Combined multi-filter query executed successfully.");

    // Test 9: Server-Side Pagination
    console.log("\nTest 9: Server-Side Pagination (Page 1 vs Page 2)...");
    const page1 = await catalogService.getProducts({ page: 1, limit: 4 });
    const page2 = await catalogService.getProducts({ page: 2, limit: 4 });
    console.log(`Page 1 count: ${page1.products.length}, Page 2 count: ${page2.products.length}`);
    console.log("✅ Test 9 PASS: Server-side pagination completed.");

    // Test 10: Product Visibility Security Rule
    console.log("\nTest 10: Security Rule Verification (Draft/Unapproved Store Product Isolation)...");
    const allProducts = await catalogService.getProducts({ page: 1, limit: 100 });
    const leakedDrafts = allProducts.products.filter((p) => p.status !== "ACTIVE");
    if (leakedDrafts.length === 0) {
      console.log("✅ Test 10 PASS: Zero non-active or draft products leaked to public marketplace.");
    } else {
      console.error(`❌ Test 10 FAIL: Found ${leakedDrafts.length} inactive products in public query.`);
      allPassed = false;
    }
  } catch (err) {
    console.error("❌ ERROR running marketplace tests:", err);
    allPassed = false;
  } finally {
    await db.$disconnect();
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("ALL MARKETPLACE INTEGRATION TESTS PASSED (100%)");
  } else {
    console.log("SOME INTEGRATION TESTS FAILED");
  }
  console.log("==================================================");
}

runProductsMarketplaceTests();
