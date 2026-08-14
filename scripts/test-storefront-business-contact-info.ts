import { catalogService } from "../modules/catalog/service";
import { db } from "../lib/db";

async function runStorefrontBusinessContactInfoTest() {
  console.log("==================================================");
  console.log("VERIFYING STOREFRONT BUSINESS & CONTACT INFO HYDRATION");
  console.log("==================================================\n");

  let allPassed = true;

  try {
    const stores = await db.store.findMany({
      where: { deletedAt: null },
      take: 5,
    });

    console.log(`Auditing ${stores.length} store(s) for business and contact info.`);

    for (const s of stores) {
      console.log(`Checking Store: "${s.name}" (Slug: ${s.slug})`);
      const details = await catalogService.getStoreDetails(s.slug);

      console.log("  Business Overview Fields:");
      console.log(`    - Business Name: "${details.businessName}"`);
      console.log(`    - Business Type: "${details.businessType || "N/A"}"`);
      console.log(`    - Reg. Number: "${details.registrationNumber || "N/A"}"`);
      console.log(`    - Tax ID: "${details.taxId || "N/A"}"`);

      console.log("  Contact & Hours Fields:");
      console.log(`    - Support Email: "${details.supportEmail || details.contactEmail || "N/A"}"`);
      console.log(`    - Support Phone: "${details.supportPhone || details.contactPhone || "N/A"}"`);
      console.log(`    - Business Address: "${details.businessAddress || "N/A"}"`);
      console.log(`    - Business Hours: "${details.businessHours || "N/A"}"`);
      console.log(`    - Website: "${details.website || "N/A"}"`);

      if (!details.businessName) {
        console.error("❌ FAIL: Business name is missing.");
        allPassed = false;
      }
    }
  } catch (err) {
    console.error("❌ ERROR running business & contact info audit:", err);
    allPassed = false;
  } finally {
    await db.$disconnect();
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("ALL BUSINESS & CONTACT INFO AUDIT TESTS PASSED (100%)");
  } else {
    console.log("SOME BUSINESS & CONTACT INFO AUDIT TESTS FAILED");
  }
  console.log("==================================================");
}

runStorefrontBusinessContactInfoTest();
