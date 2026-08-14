import fs from "fs";
import path from "path";

function runRemoveMarketingCardsAuditTest() {
  console.log("==================================================");
  console.log("VERIFYING REMOVAL OF MARKETING STATS CARDS");
  console.log("==================================================\n");

  let allPassed = true;

  const marketingPagePath = path.join(process.cwd(), "app/vendor/marketing/page.tsx");
  const content = fs.readFileSync(marketingPagePath, "utf-8");

  const forbiddenCards = [
    "<span>Revenue Generated</span>",
    "From active campaign orders",
    "<span>Campaign Orders</span>",
    "0 total units sold",
    "<span>Conversion Rate</span>",
    "Orders vs Campaign Views",
    "Net Return on Discounts",
    "Assigned Products</span>",
    "Total Discount Cost</span>",
    "Active Deals</span>",
    "Average Discount</span>",
  ];

  for (const phrase of forbiddenCards) {
    if (content.includes(phrase)) {
      console.error(`❌ FAIL: Found forbidden phrase "${phrase}" in vendor marketing page.`);
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log("✅ PASS: All requested cards removed from Vendor Marketing section.");
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("ALL AUDIT TESTS PASSED (100%)");
  } else {
    console.log("SOME AUDIT TESTS FAILED");
  }
  console.log("==================================================");
}

runRemoveMarketingCardsAuditTest();
