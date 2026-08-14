import fs from "fs";
import path from "path";

function runVendorNavigationAuditTests() {
  console.log("==================================================");
  console.log("VERIFYING VENDOR DASHBOARD NAVIGATION & PRODUCT CATALOG");
  console.log("==================================================\n");

  let allPassed = true;

  // Test 1: Verify Inventory section is removed from Vendor Sidebar
  console.log("Test 1: Auditing Vendor Sidebar Navigation Menu...");
  const sidebarPath = path.join(process.cwd(), "components/vendor/vendor-sidebar.tsx");
  const sidebarContent = fs.readFileSync(sidebarPath, "utf-8");

  if (sidebarContent.includes('label: "Inventory"') || sidebarContent.includes('href: "/vendor/inventory"')) {
    console.error("❌ Test 1 FAIL: Inventory link still found in vendor sidebar.");
    allPassed = false;
  } else {
    console.log("✅ Test 1 PASS: 'Inventory' section successfully removed from Vendor Sidebar menu.");
  }

  // Test 2: Verify Product Catalog Table columns
  console.log("\nTest 2: Auditing Product Catalog Table Columns...");
  const tablePath = path.join(process.cwd(), "components/vendor/product-table.tsx");
  const tableContent = fs.readFileSync(tablePath, "utf-8");

  const removedColumns = ["SKU", "Brand", "Stock", "Best Seller", "Sales", "Performance"];
  let foundRemoved = false;

  for (const col of removedColumns) {
    if (tableContent.includes(`<TableHead>${col}</TableHead>`) || tableContent.includes(`handleSort("${col.toLowerCase()}")`)) {
      console.error(`❌ Test 2 FAIL: Removed column "${col}" still found in Product Table header.`);
      foundRemoved = true;
      allPassed = false;
    }
  }

  if (!foundRemoved) {
    console.log("✅ Test 2 PASS: SKU, Brand, Stock, Best Seller, Sales, and Performance removed from Product Table headers.");
  }

  // Test 3: Verify kept columns exist
  console.log("\nTest 3: Verifying required columns in Product Catalog Table...");
  const requiredColumns = ["Image", "Product Name", "Category", "Price", "Status", "Featured", "Rating", "Last Updated"];
  let missingKept = false;

  for (const col of requiredColumns) {
    if (!tableContent.includes(col)) {
      console.error(`❌ Test 3 FAIL: Required column "${col}" missing from Product Table.`);
      missingKept = true;
      allPassed = false;
    }
  }

  if (!missingKept) {
    console.log("✅ Test 3 PASS: Product Catalog Table strictly contains price, status, last updated, product name, image, category, and ratings.");
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("ALL VENDOR NAVIGATION AUDIT TESTS PASSED (100%)");
  } else {
    console.log("SOME VENDOR NAVIGATION AUDIT TESTS FAILED");
  }
  console.log("==================================================");
}

runVendorNavigationAuditTests();
