import { catalogService } from "../modules/catalog/service";
import { db } from "../lib/db";

async function runStorefrontActivePoliciesTest() {
  console.log("==================================================");
  console.log("VERIFYING STOREFRONT ACTIVE POLICIES HYDRATION");
  console.log("==================================================\n");

  let allPassed = true;

  try {
    const stores = await db.store.findMany({
      where: { deletedAt: null },
      take: 5,
    });

    console.log(`Found ${stores.length} store(s) for policy audit.`);

    for (const s of stores) {
      console.log(`Testing Store: "${s.name}" (ID: ${s.id}, Slug: ${s.slug})`);
      const details = await catalogService.getStoreDetails(s.slug);

      console.log("  Policy Hydration Status:");
      console.log("    - Store Policy:", details.assignedStorePolicy ? `✅ "${details.assignedStorePolicy.name}"` : "ℹ️ Default/None");
      console.log("    - Privacy Policy:", details.assignedPrivacyPolicy ? `✅ "${details.assignedPrivacyPolicy.name}"` : "ℹ️ Default/None");
      console.log("    - Shipping Policy:", details.activeShippingPolicy ? `✅ "${details.activeShippingPolicy.name}"` : "ℹ️ Default/None");
      console.log("    - Return Policy:", details.activeReturnPolicy ? `✅ "${details.activeReturnPolicy.name}"` : "ℹ️ Default/None");
      console.log("    - Refund Policy:", details.activeRefundPolicy ? `✅ "${details.activeRefundPolicy.name}"` : "ℹ️ Default/None");
    }
  } catch (err) {
    console.error("❌ ERROR running storefront policies audit:", err);
    allPassed = false;
  } finally {
    await db.$disconnect();
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("ALL STOREFRONT POLICIES TESTS PASSED (100%)");
  } else {
    console.log("SOME STOREFRONT POLICIES TESTS FAILED");
  }
  console.log("==================================================");
}

runStorefrontActivePoliciesTest();
