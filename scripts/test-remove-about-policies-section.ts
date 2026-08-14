import fs from "fs";
import path from "path";

function runRemoveAboutPoliciesTest() {
  console.log("==================================================");
  console.log("VERIFYING REMOVAL OF POLICIES BLOCK FROM ABOUT TAB");
  console.log("==================================================\n");

  let allPassed = true;

  const pagePath = path.join(process.cwd(), "app/stores/[id]/page.tsx");
  const content = fs.readFileSync(pagePath, "utf-8");

  const forbiddenAboutPhrases = [
    "Store Terms & Policies",
    "assignedStorePolicy",
    "assignedPrivacyPolicy",
    "activeShippingPolicy",
    "activeReturnPolicy",
  ];

  for (const phrase of forbiddenAboutPhrases) {
    if (content.includes(phrase)) {
      console.error(`❌ FAIL: Found forbidden phrase "${phrase}" in storefront page.`);
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log("✅ PASS: Store Terms & Policies section successfully removed from About section.");
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("ALL AUDIT TESTS PASSED (100%)");
  } else {
    console.log("SOME AUDIT TESTS FAILED");
  }
  console.log("==================================================");
}

runRemoveAboutPoliciesTest();
