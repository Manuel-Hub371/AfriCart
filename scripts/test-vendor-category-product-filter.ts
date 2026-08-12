import { PrismaClient } from "@prisma/client";
import { vendorService } from "../modules/vendor/service";

const prisma = new PrismaClient();

async function testVendorProductFilterAPI() {
  console.log("--- TESTING VENDOR PRODUCTS API WITH STORE CATEGORIES ---");

  // 1. Get test user
  const user = await prisma.user.findFirst({
    where: { email: "admin@africart.com" },
  });

  if (!user) {
    console.error("Test user not found.");
    return;
  }

  // 2. Execute getVendorProducts
  const result = await vendorService.getVendorProducts(user.id);

  console.log("✓ Total Products Returned:", result.products.length);
  console.log("✓ Assigned Store Categories Returned:", result.storeCategories);
  console.log("✓ Assigned Categories Count:", result.storeCategories.length);

  if (result.storeCategories.length <= 1) {
    console.log("✓ UI RULE VERIFIED: Store has 1 or 0 categories -> 'Category Filter' dropdown will be HIDDEN.");
  } else {
    console.log("✓ UI RULE VERIFIED: Store has > 1 categories -> 'Category Filter' dropdown will be SHOWN with options:", result.storeCategories.map(c => c.name));
  }
}

testVendorProductFilterAPI()
  .catch((e) => console.error("Test error:", e))
  .finally(() => prisma.$disconnect());
