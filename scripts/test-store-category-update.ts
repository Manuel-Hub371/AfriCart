import { PrismaClient } from "@prisma/client";
import { vendorService } from "../modules/vendor/service";

const prisma = new PrismaClient();

async function testStoreCategoryUpdate() {
  console.log("--- TESTING VENDOR STORE CATEGORY UPDATE ---");

  // 1. Find or create a test vendor and store
  let user = await prisma.user.findFirst({
    where: { email: "admin@africart.com" },
    include: { vendorProfile: { include: { stores: true } } },
  });

  if (!user) {
    console.error("Admin user not found.");
    return;
  }

  // Ensure vendor profile and store exist
  let vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: user.id },
  });

  if (!vendorProfile) {
    vendorProfile = await prisma.vendorProfile.create({
      data: {
        userId: user.id,
        businessName: "Test Admin Store",
        businessCategory: "Electronics & Gadget",
        country: "Ghana",
        region: "Greater Accra",
        city: "Accra",
        businessAddress: "123 Test St",
      },
    });
  }

  let store = await prisma.store.findFirst({
    where: { vendorProfileId: vendorProfile.id, deletedAt: null },
  });

  if (!store) {
    store = await prisma.store.create({
      data: {
        vendorProfileId: vendorProfile.id,
        name: "Test Admin Store",
        slug: "test-admin-store-" + Date.now(),
        category: "Electronics & Gadget",
      },
    });
  }

  console.log("Found Store ID:", store.id);

  // 2. Perform Category Update via VendorService
  const testCategorySlugs = ["electronics-gadget", "fashion-appeal", "home-living"];
  console.log("Updating store categories to:", testCategorySlugs);

  const updatedStore = await vendorService.updateVendorStore(user.id, {
    categorySlugs: testCategorySlugs,
    categories: testCategorySlugs,
  });

  console.log("✓ Update Result Category Slugs:", updatedStore.categorySlugs);
  console.log("✓ Update Result Primary Category:", updatedStore.category);

  // Verify in Database
  const assignments = await prisma.storeCategoryAssignment.findMany({
    where: { storeId: store.id },
    include: { storeCategory: true },
  });

  console.log(
    "✓ DB StoreCategoryAssignment Records:",
    assignments.map((a) => a.storeCategory.slug)
  );

  const match = testCategorySlugs.every((slug) =>
    assignments.some((a) => a.storeCategory.slug === slug)
  );

  if (match) {
    console.log("✓ VERIFICATION PASS: All selected categories correctly persisted!");
  } else {
    console.error("❌ VERIFICATION FAIL: Category assignment mismatch.");
  }
}

testStoreCategoryUpdate()
  .catch((e) => console.error("Test error:", e))
  .finally(() => prisma.$disconnect());
