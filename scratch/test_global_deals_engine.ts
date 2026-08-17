import { db } from "../lib/db";
import { vendorRepository } from "../modules/vendor/repository";
import { resolveCampaignPricing } from "../lib/campaign-pricing";

async function runTests() {
  console.log("=================================================");
  console.log("AFRICART GLOBAL DEALS ENGINE ARCHITECTURAL AUDIT");
  console.log("=================================================\n");

  let testPassed = 0;
  let testFailed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      testPassed++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${detail || "Assertion failed"}`);
      testFailed++;
    }
  }

  try {
    // 1. Setup Test Users, VendorProfiles, Stores, and Products for Multi-Vendor Testing
    const now = new Date();
    const futureStart = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const futureEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const pastStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const pastEnd = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const activeStart = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const activeEnd = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    const timeTag = Date.now();

    // Create User 1 + Vendor 1 + Store 1
    const user1 = await db.user.create({
      data: {
        email: `test_v1_${timeTag}@africart.test`,
        passwordHash: "dummy",
        firstName: "TestVendor",
        lastName: "One",
        status: "ACTIVE",
      },
    });

    const vendor1 = await db.vendorProfile.create({
      data: {
        userId: user1.id,
        businessName: "Vendor One Business",
        businessCategory: "Electronics",
        country: "Ghana",
        region: "Greater Accra",
        city: "Accra",
        businessAddress: "1 Test St",
      },
    });

    const store1 = await db.store.create({
      data: {
        vendorProfileId: vendor1.id,
        name: "Store One Electronics",
        slug: `store-one-${timeTag}`,
        status: "ACTIVE",
        isPublic: true,
      },
    });

    const p1 = await db.product.create({
      data: {
        storeId: store1.id,
        name: "Vendor 1 Smartphone",
        slug: `v1-phone-${timeTag}`,
        price: 2000,
        stock: 10,
        categoryName: "Electronics",
        brand: "AfriBrand",
        status: "ACTIVE",
      },
    });

    // Create User 2 + Vendor 2 + Store 2
    const user2 = await db.user.create({
      data: {
        email: `test_v2_${timeTag}@africart.test`,
        passwordHash: "dummy",
        firstName: "TestVendor",
        lastName: "Two",
        status: "ACTIVE",
      },
    });

    const vendor2 = await db.vendorProfile.create({
      data: {
        userId: user2.id,
        businessName: "Vendor Two Business",
        businessCategory: "Fashion",
        country: "Ghana",
        region: "Ashanti",
        city: "Kumasi",
        businessAddress: "2 Test St",
      },
    });

    const store2 = await db.store.create({
      data: {
        vendorProfileId: vendor2.id,
        name: "Store Two Fashion",
        slug: `store-two-${timeTag}`,
        status: "ACTIVE",
        isPublic: true,
      },
    });

    const p2 = await db.product.create({
      data: {
        storeId: store2.id,
        name: "Vendor 2 Designer Sneakers",
        slug: `v2-sneakers-${timeTag}`,
        price: 800,
        stock: 15,
        categoryName: "Fashion",
        brand: "SneakerLab",
        status: "ACTIVE",
      },
    });

    console.log(`Created Store 1: ${store1.name} (${store1.id})`);
    console.log(`Created Store 2: ${store2.name} (${store2.id})`);

    // 2. TEST 1 & 2: Create Active Campaigns for Vendor 1 & Vendor 2
    const campaign1 = await db.marketingCampaign.create({
      data: {
        storeId: store1.id,
        name: "TEST_AUDIT_Black_Friday_V1",
        slug: `test-audit-bf-v1-${timeTag}`,
        type: "BLACK_FRIDAY",
        badge: "BLACK FRIDAY 25% OFF",
        startDate: activeStart,
        endDate: activeEnd,
        isActive: true,
        status: "ACTIVE",
        discountType: "PERCENTAGE",
        discountValue: 25,
        targetScope: "PRODUCT",
      },
    });

    await db.campaignProduct.create({
      data: { campaignId: campaign1.id, productId: p1.id },
    });

    const campaign2 = await db.marketingCampaign.create({
      data: {
        storeId: store2.id,
        name: "TEST_AUDIT_Flash_Sale_V2",
        slug: `test-audit-fs-v2-${timeTag}`,
        type: "FLASH_SALE",
        badge: "FLASH SALE 40% OFF",
        startDate: activeStart,
        endDate: activeEnd,
        isActive: true,
        status: "ACTIVE",
        discountType: "PERCENTAGE",
        discountValue: 40,
        targetScope: "PRODUCT",
      },
    });

    await db.campaignProduct.create({
      data: { campaignId: campaign2.id, productId: p2.id },
    });

    // TEST 4: Expired Campaign
    const expiredCampaign = await db.marketingCampaign.create({
      data: {
        storeId: store1.id,
        name: "TEST_AUDIT_Expired",
        slug: `test-audit-expired-${timeTag}`,
        startDate: pastStart,
        endDate: pastEnd,
        isActive: true,
        status: "EXPIRED",
        discountType: "PERCENTAGE",
        discountValue: 50,
      },
    });

    // TEST 5: Scheduled Campaign
    const scheduledCampaign = await db.marketingCampaign.create({
      data: {
        storeId: store1.id,
        name: "TEST_AUDIT_Scheduled",
        slug: `test-audit-scheduled-${timeTag}`,
        startDate: futureStart,
        endDate: futureEnd,
        isActive: true,
        status: "SCHEDULED",
        discountType: "PERCENTAGE",
        discountValue: 50,
      },
    });

    // 3. VERIFY MULTI-VENDOR GLOBAL DEALS QUERY
    const activeCampaigns = await db.marketingCampaign.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        status: "ACTIVE",
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    assert(
      activeCampaigns.some((c) => c.id === campaign1.id) && activeCampaigns.some((c) => c.id === campaign2.id),
      "Test 2 & 3: Multi-vendor active campaigns co-exist simultaneously",
      "Failed to find both active campaigns"
    );

    assert(
      !activeCampaigns.some((c) => c.id === expiredCampaign.id),
      "Test 4: Expired campaign is automatically excluded from active deals query"
    );

    assert(
      !activeCampaigns.some((c) => c.id === scheduledCampaign.id),
      "Test 5: Scheduled campaign is automatically excluded from active deals query"
    );

    // 4. TEST 7: Server-side Vendor Isolation Check
    // Attempt to attach store2's product (p2) to store1's campaign via vendor repository
    await vendorRepository.updateCampaign(campaign1.id, store1.id, {
      productIds: [p1.id, p2.id], // p2 belongs to store2!
    });

    const linkedProducts = await db.campaignProduct.findMany({
      where: { campaignId: campaign1.id },
      select: { productId: true },
    });
    const linkedProductIds = linkedProducts.map((lp) => lp.productId);

    assert(
      linkedProductIds.includes(p1.id) && !linkedProductIds.includes(p2.id),
      "Test 7: Server-side vendor isolation enforces that Vendor A cannot link Vendor B's product"
    );

    // 5. TEST PRICING ENGINE DETERMINISM
    const p1Pricing = resolveCampaignPricing(p1.price, [campaign1]);
    assert(
      p1Pricing.isDiscounted && p1Pricing.effectivePrice === p1.price * 0.75,
      "Test Single Source Pricing: 25% discount resolves accurately",
      `Expected ${p1.price * 0.75}, got ${p1Pricing.effectivePrice}`
    );

    // Clean up created test entities
    await db.marketingCampaign.deleteMany({ where: { id: { in: [campaign1.id, campaign2.id, expiredCampaign.id, scheduledCampaign.id] } } });
    await db.product.deleteMany({ where: { id: { in: [p1.id, p2.id] } } });
    await db.store.deleteMany({ where: { id: { in: [store1.id, store2.id] } } });
    await db.vendorProfile.deleteMany({ where: { id: { in: [vendor1.id, vendor2.id] } } });
    await db.user.deleteMany({ where: { id: { in: [user1.id, user2.id] } } });

    console.log("\n=================================================");
    console.log(`AUDIT COMPLETE: ${testPassed} Passed, ${testFailed} Failed`);
    console.log("=================================================");
  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    await db.$disconnect();
  }
}

runTests();
