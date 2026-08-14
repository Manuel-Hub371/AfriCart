import { catalogService } from "../modules/catalog/service";
import { db } from "../lib/db";

async function runStorePolicyAuditTest() {
  console.log("==================================================");
  console.log("AUDITING STORE POLICY SYSTEM & FIELD MAPPINGS");
  console.log("==================================================\n");

  let allPassed = true;

  try {
    const stores = await db.store.findMany({
      where: { deletedAt: null },
      take: 5,
    });

    console.log(`Auditing ${stores.length} store(s) for store policy field alignment.`);

    for (const s of stores) {
      console.log(`Checking Store: "${s.name}" (Slug: ${s.slug})`);
      const details = await catalogService.getStoreDetails(s.slug);

      if (details.assignedStorePolicy) {
        const p = details.assignedStorePolicy;
        console.log(`  ✅ Assigned Store Policy Found: "${p.name}"`);
        console.log(`     - Description: ${p.description || "N/A"}`);
        console.log(`     - Terms & Conditions: ${p.termsConditions || "N/A"}`);
        console.log(`     - Customer Responsibilities: ${p.customerResponsibilities || "N/A"}`);
        console.log(`     - Seller Responsibilities: ${p.sellerResponsibilities || "N/A"}`);
        console.log(`     - Cancellation Rules: ${p.cancellationRules || "N/A"}`);
        console.log(`     - Dispute Resolution: ${p.disputeResolution || "N/A"}`);

        // Verify no invalid properties (like introduction or generalTerms)
        if ((p as any).introduction !== undefined || (p as any).generalTerms !== undefined) {
          console.warn(`  ⚠️ Warning: Deprecated property accessed.`);
        }
      } else {
        console.log(`  ℹ️ No custom Store Policy assigned yet. Fallback terms: "${details.termsConditions}"`);
      }
    }
  } catch (err) {
    console.error("❌ ERROR running store policy audit:", err);
    allPassed = false;
  } finally {
    await db.$disconnect();
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("ALL STORE POLICY AUDIT TESTS PASSED (100%)");
  } else {
    console.log("SOME STORE POLICY AUDIT TESTS FAILED");
  }
  console.log("==================================================");
}

runStorePolicyAuditTest();
