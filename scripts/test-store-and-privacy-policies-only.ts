import fs from "fs";
import path from "path";

function runStoreAndPrivacyOnlyTest() {
  console.log("==================================================");
  console.log("VERIFYING STORE POLICY & PRIVACY POLICY DISPLAY");
  console.log("==================================================\n");

  let allPassed = true;

  const pagePath = path.join(process.cwd(), "app/stores/[id]/page.tsx");
  const content = fs.readFileSync(pagePath, "utf-8");

  if (content.includes("Store Policy") && content.includes("Privacy Policy")) {
    console.log("✅ PASS: Store Policy and Privacy Policy are present.");
  } else {
    console.error("❌ FAIL: Store Policy or Privacy Policy missing from page.");
    allPassed = false;
  }

  const forbiddenPolicies = [
    "activeShippingPolicy",
    "activeReturnPolicy",
    "activeRefundPolicy",
    "activeWarrantyPolicy",
  ];

  for (const p of forbiddenPolicies) {
    if (content.includes(p)) {
      console.error(`❌ FAIL: Found hidden policy reference "${p}" in storefront page.`);
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log("✅ PASS: Shipping, Return, Refund, and Warranty policies are hidden as requested.");
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("ALL AUDIT TESTS PASSED (100%)");
  } else {
    console.log("SOME AUDIT TESTS FAILED");
  }
  console.log("==================================================");
}

runStoreAndPrivacyOnlyTest();
