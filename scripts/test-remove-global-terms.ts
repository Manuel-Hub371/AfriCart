import fs from "fs";
import path from "path";

function runRemoveGlobalTermsAuditTest() {
  console.log("==================================================");
  console.log("VERIFYING REMOVAL OF GLOBAL STORE TERMS & PRIVACY");
  console.log("==================================================\n");

  let allPassed = true;

  const formPath = path.join(process.cwd(), "components/vendor/store-policies-form.tsx");
  const formContent = fs.readFileSync(formPath, "utf-8");

  const forbiddenPhrases = [
    "Global Store Terms & Privacy",
    "Set default privacy policies and legal terms displayed on your public storefront.",
    "Store Privacy Policy",
  ];

  for (const phrase of forbiddenPhrases) {
    if (formContent.includes(phrase)) {
      console.error(`❌ FAIL: Found forbidden phrase "${phrase}" in store-policies-form.tsx.`);
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log("✅ PASS: 'Global Store Terms & Privacy' section and description successfully removed.");
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("ALL AUDIT TESTS PASSED (100%)");
  } else {
    console.log("SOME AUDIT TESTS FAILED");
  }
  console.log("==================================================");
}

runRemoveGlobalTermsAuditTest();
