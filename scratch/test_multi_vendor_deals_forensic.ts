import { db } from "../lib/db";
import { vendorRepository } from "../modules/vendor/repository";

async function runForensicDealsAudit() {
  console.log("=================================================");
  console.log("AFRICART FORENSIC MULTI-VENDOR DEALS AUDIT");
  console.log("=================================================\n");

  const now = new Date();
  const tomorrow = new Date(Date.now() + 86400000 * 7);

  const timeTag = Date.now();

  try {
    // Step 1: Create 3 Vendors & 3 Stores
    console.log("Creating 3 distinct Vendors & Stores...");
    const userA = await db.user.create({
      data: { email: `vendorA_${timeTag}@africart.test`, passwordHash: "dummy", status: "ACTIVE", firstName: "Vendor", lastName: "A" }
    });
    const profileA = await db.vendorProfile.create({
      data: { userId: userA.id, businessName: "Vendor A Electronics", businessCategory: "Electronics", country: "Ghana", region: "Accra", city: "Accra", businessAddress: "Address A" }
    });
    const storeA = await db.store.create({
      data: { vendorProfileId: profileA.id, name: "Store A - Tech Gadgets", slug: `store-a-${timeTag}`, status: "ACTIVE" }
    });

    const userB = await db.user.create({
      data: { email: `vendorB_${timeTag}@africart.test`, passwordHash: "dummy", status: "ACTIVE", firstName: "Vendor", lastName: "B" }
    });
    const profileB = await db.vendorProfile.create({
      data: { userId: userB.id, businessName: "Vendor B Fashion", businessCategory: "Fashion", country: "Ghana", region: "Accra", city: "Accra", businessAddress: "Address B" }
    });
    const storeB = await db.store.create({
      data: { vendorProfileId: profileB.id, name: "Store B - Fashion Hub", slug: `store-b-${timeTag}`, status: "ACTIVE" }
    });

    const userC = await db.user.create({
      data: { email: `vendorC_${timeTag}@africart.test`, passwordHash: "dummy", status: "ACTIVE", firstName: "Vendor", lastName: "C" }
    });
    const profileC = await db.vendorProfile.create({
      data: { userId: userC.id, businessName: "Vendor C Home", businessCategory: "Home & Living", country: "Ghana", region: "Accra", city: "Accra", businessAddress: "Address C" }
    });
    const storeC = await db.store.create({
      data: { vendorProfileId: profileC.id, name: "Store C - Living Essentials", slug: `store-c-${timeTag}`, status: "ACTIVE" }
    });

    // Step 2: Create Products for each vendor
    console.log("Creating Products for each Vendor...");
    const prodA1 = await vendorRepository.createVendorProduct(storeA.id, {
      name: "iPhone 15 Pro Max", price: 12000, stock: 10, categoryName: "Electronics", brand: "Apple"
    });
    const prodA2 = await vendorRepository.createVendorProduct(storeA.id, {
      name: "AirPods Pro 2", price: 2500, stock: 15, categoryName: "Electronics", brand: "Apple"
    });

    const prodB1 = await vendorRepository.createVendorProduct(storeB.id, {
      name: "Designer Baggy Jeans", price: 450, stock: 20, categoryName: "Fashion", brand: "Denim"
    });
    const prodB2 = await vendorRepository.createVendorProduct(storeB.id, {
      name: "Luxury Leather Handbag", price: 1200, stock: 5, categoryName: "Fashion", brand: "Gucci"
    });

    const prodC1 = await vendorRepository.createVendorProduct(storeC.id, {
      name: "Smart Blender Pro 1000W", price: 850, stock: 8, categoryName: "Home & Living", brand: "Philips"
    });
    const prodC2 = await vendorRepository.createVendorProduct(storeC.id, {
      name: "Ergonomic Memory Foam Pillow", price: 300, stock: 25, categoryName: "Home & Living", brand: "SleepWell"
    });

    // Step 3: Create 3 Active Campaigns (1 per vendor)
    console.log("Creating 3 Active Campaigns...");
    const campA = await vendorRepository.createCampaign(storeA.id, {
      name: "Black Friday Mega Tech",
      type: "BLACK_FRIDAY",
      discountType: "PERCENTAGE",
      discountValue: 20,
      startDate: now,
      endDate: tomorrow,
      productIds: [prodA1.id, prodA2.id],
      status: "ACTIVE",
    }, userA.id);

    const campB = await vendorRepository.createCampaign(storeB.id, {
      name: "Flash Sale Fashion Blowout",
      type: "FLASH_SALE",
      discountType: "PERCENTAGE",
      discountValue: 30,
      startDate: now,
      endDate: tomorrow,
      productIds: [prodB1.id, prodB2.id],
      status: "ACTIVE",
    }, userB.id);

    const campC = await vendorRepository.createCampaign(storeC.id, {
      name: "Weekend Living Specials",
      type: "SEASONAL",
      discountType: "FIXED",
      discountValue: 150,
      startDate: now,
      endDate: tomorrow,
      productIds: [prodC1.id, prodC2.id],
      status: "ACTIVE",
    }, userC.id);

    console.log(`Campaign A created: "${campA.name}" (ID: ${campA.id})`);
    console.log(`Campaign B created: "${campB.name}" (ID: ${campB.id})`);
    console.log(`Campaign C created: "${campC.name}" (ID: ${campC.id})`);

    // Step 4: Query Database for Active Campaigns & Products
    console.log("\nExecuting Global Deals Database Query...");
    const activeCampaigns = await db.marketingCampaign.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        status: "ACTIVE",
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        store: { select: { id: true, name: true } },
        campaignProducts: { include: { product: true } },
      },
    });

    console.log(`\nFound ${activeCampaigns.length} Active Campaigns in DB.`);

    const uniqueStores = new Set(activeCampaigns.map(c => c.store.name));
    console.log("Distinct Stores represented:", Array.from(uniqueStores));

    for (const c of activeCampaigns) {
      console.log(`  - [${c.store.name}] Campaign "${c.name}" -> ${c.campaignProducts.length} Products`);
      for (const cp of c.campaignProducts) {
        console.log(`      * Product: "${cp.product.name}" (Price: GH₵${cp.product.price})`);
      }
    }

    // Step 5: Test Server API Simulation
    const { GET } = await import("../app/api/deals/route");
    const mockRequest = new Request("http://localhost:3000/api/deals?limit=50");
    const response = await GET(mockRequest as any);
    const apiData = await response.json();

    console.log("\n=================================================");
    console.log("API RESPONSE DATA FROM GET /api/deals:");
    console.log(`Total Products Returned: ${apiData.total}`);
    console.log(`Active Campaigns Count: ${apiData.activeCampaigns?.length}`);

    const returnedStoreNames = Array.from(new Set(apiData.products.map((p: any) => p.store.name)));
    console.log("Stores present in API deals output:", returnedStoreNames);

    if (returnedStoreNames.length >= 3) {
      console.log("\n✅ SUCCESS: All 3 vendors and all 3 campaigns are fully aggregated and present in /api/deals!");
    } else {
      console.error("\n❌ FAILURE: Not all vendors returned in API response.");
    }

    // Cleanup
    console.log("\nCleaning up test entities...");
    await db.campaignProduct.deleteMany({ where: { campaignId: { in: [campA.id, campB.id, campC.id] } } });
    await db.marketingCampaign.deleteMany({ where: { id: { in: [campA.id, campB.id, campC.id] } } });
    await db.product.deleteMany({ where: { id: { in: [prodA1.id, prodA2.id, prodB1.id, prodB2.id, prodC1.id, prodC2.id] } } });
    await db.store.deleteMany({ where: { id: { in: [storeA.id, storeB.id, storeC.id] } } });
    await db.vendorProfile.deleteMany({ where: { id: { in: [profileA.id, profileB.id, profileC.id] } } });
    await db.user.deleteMany({ where: { id: { in: [userA.id, userB.id, userC.id] } } });

    console.log("Cleanup complete.");
  } catch (err) {
    console.error("Audit error:", err);
  } finally {
    await db.$disconnect();
  }
}

runForensicDealsAudit();
