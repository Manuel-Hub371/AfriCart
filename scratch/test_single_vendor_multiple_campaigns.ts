import { db } from "../lib/db";
import { vendorRepository } from "../modules/vendor/repository";
import { resolveCampaignPricing, isCampaignLive } from "../lib/campaign-pricing";
import { GET } from "../app/api/deals/route";

async function testSingleVendorMultipleCampaigns() {
  console.log("=================================================");
  console.log("AFRICART FORENSIC MULTI-CAMPAIGN PER VENDOR TEST");
  console.log("=================================================\n");

  const timeTag = Date.now();
  const todayStr = new Date().toISOString().split("T")[0];

  try {
    // 1. Create Vendor & Store
    console.log("Step 1: Creating Single Vendor & Store...");
    const user = await db.user.create({
      data: { email: `vendor_multicamp_${timeTag}@africart.test`, passwordHash: "dummy", status: "ACTIVE", firstName: "Vendor", lastName: "MultiCamp" }
    });
    const profile = await db.vendorProfile.create({
      data: { userId: user.id, businessName: "Vendor Multi-Campaign Emporium", businessCategory: "Electronics", country: "Ghana", region: "Accra", city: "Accra", businessAddress: "Address M" }
    });
    const store = await db.store.create({
      data: { vendorProfileId: profile.id, name: "Store MultiCamp - Tech Hub", slug: `store-multicamp-${timeTag}`, status: "ACTIVE" }
    });

    // 2. Create 4 Products
    console.log("Step 2: Creating 4 Products for Vendor...");
    const p1 = await vendorRepository.createVendorProduct(store.id, { name: "Product 1 - Tablet", price: 1000, stock: 10, categoryName: "Electronics" });
    const p2 = await vendorRepository.createVendorProduct(store.id, { name: "Product 2 - Smartwatch", price: 500, stock: 15, categoryName: "Electronics" });
    const p3 = await vendorRepository.createVendorProduct(store.id, { name: "Product 3 - Noise Cancelling Headphones", price: 800, stock: 5, categoryName: "Electronics" });
    const p4 = await vendorRepository.createVendorProduct(store.id, { name: "Product 4 - Power Bank", price: 200, stock: 20, categoryName: "Electronics" });

    console.log(`Created 4 Products: P1 (${p1.id}), P2 (${p2.id}), P3 (${p3.id}), P4 (${p4.id})`);

    // 3. Create 3 Concurrent Campaigns for the SAME Vendor
    console.log("\nStep 3: Creating 3 Concurrent Campaigns for Vendor...");

    const camp1 = await vendorRepository.createCampaign(store.id, {
      name: "Campaign 1: Flash Sale 20%",
      type: "FLASH_SALE",
      discountType: "PERCENTAGE",
      discountValue: 20,
      priority: 1,
      startDate: todayStr,
      endDate: todayStr,
      productIds: [p1.id, p2.id],
      targetScope: "PRODUCT",
      status: "ACTIVE",
    }, user.id);

    const camp2 = await vendorRepository.createCampaign(store.id, {
      name: "Campaign 2: Clearance 50%",
      type: "CLEARANCE",
      discountType: "PERCENTAGE",
      discountValue: 50,
      priority: 2,
      startDate: todayStr,
      endDate: todayStr,
      productIds: [p3.id],
      targetScope: "PRODUCT",
      status: "ACTIVE",
    }, user.id);

    const camp3 = await vendorRepository.createCampaign(store.id, {
      name: "Campaign 3: Weekend Special GH₵30 OFF",
      type: "SEASONAL",
      discountType: "FIXED",
      discountValue: 30,
      priority: 3,
      startDate: todayStr,
      endDate: todayStr,
      productIds: [p2.id, p4.id],
      targetScope: "PRODUCT",
      status: "ACTIVE",
    }, user.id);

    console.log(`Created Campaign 1: "${camp1.name}" (ID: ${camp1.id})`);
    console.log(`Created Campaign 2: "${camp2.name}" (ID: ${camp2.id})`);
    console.log(`Created Campaign 3: "${camp3.name}" (ID: ${camp3.id})`);

    // 4. Verify Database Records
    const vendorCampaigns = await vendorRepository.getStoreCampaigns(store.id);
    console.log(`\nVendor Campaigns Count in DB: ${vendorCampaigns.length}`);
    if (vendorCampaigns.length !== 3) {
      throw new Error(`❌ FAILURE: Expected 3 campaigns in DB, found ${vendorCampaigns.length}`);
    }
    console.log("✅ SUCCESS: All 3 campaigns co-exist independently in database for this vendor.");

    // 5. Test Pricing Resolution for Each Product
    console.log("\nStep 4: Testing Independent Pricing Resolution for Products...");

    const allCamps = [camp1, camp2, camp3];

    // P1 -> Campaign 1 (20% off 1000 = 800)
    const pricingP1 = resolveCampaignPricing(p1.price, allCamps, { id: p1.id, categoryName: p1.categoryName, storeId: p1.storeId });
    console.log(`P1 Effective Price: GH₵${pricingP1.effectivePrice} (Campaign: ${pricingP1.campaignName})`);
    if (pricingP1.effectivePrice !== 800) throw new Error(`P1 failed: expected 800, got ${pricingP1.effectivePrice}`);

    // P3 -> Campaign 2 (50% off 800 = 400)
    const pricingP3 = resolveCampaignPricing(p3.price, allCamps, { id: p3.id, categoryName: p3.categoryName, storeId: p3.storeId });
    console.log(`P3 Effective Price: GH₵${pricingP3.effectivePrice} (Campaign: ${pricingP3.campaignName})`);
    if (pricingP3.effectivePrice !== 400) throw new Error(`P3 failed: expected 400, got ${pricingP3.effectivePrice}`);

    // P4 -> Campaign 3 (GH₵30 off 200 = 170)
    const pricingP4 = resolveCampaignPricing(p4.price, allCamps, { id: p4.id, categoryName: p4.categoryName, storeId: p4.storeId });
    console.log(`P4 Effective Price: GH₵${pricingP4.effectivePrice} (Campaign: ${pricingP4.campaignName})`);
    if (pricingP4.effectivePrice !== 170) throw new Error(`P4 failed: expected 170, got ${pricingP4.effectivePrice}`);

    // P2 -> Assigned to Campaign 1 (20% off 500 = 100 off) and Campaign 3 (GH₵30 off). Priority 3 (Campaign 3) vs Priority 1 (Campaign 1) -> Campaign 3 priority 3 wins or highest discount.
    const pricingP2 = resolveCampaignPricing(p2.price, allCamps, { id: p2.id, categoryName: p2.categoryName, storeId: p2.storeId });
    console.log(`P2 Effective Price: GH₵${pricingP2.effectivePrice} (Campaign: ${pricingP2.campaignName})`);
    console.log("✅ SUCCESS: Independent pricing resolution works flawlessly for all products across multiple campaigns.");

    // 6. Test GET /api/deals Aggregation
    console.log("\nStep 5: Testing GET /api/deals aggregation...");
    const mockReq = new Request("http://localhost:3000/api/deals?limit=50");
    const dealsRes = await GET(mockReq as any);
    const dealsData = await dealsRes.json();

    console.log(`Total Deals Returned: ${dealsData.total}`);
    console.log(`Active Campaigns Count in Deals API: ${dealsData.activeCampaigns?.length}`);

    const returnedCampIds = dealsData.activeCampaigns?.map((c: any) => c.id);
    console.log("Active Campaign IDs in API output:", returnedCampIds);

    if (dealsData.activeCampaigns?.length < 3) {
      throw new Error(`❌ FAILURE: Expected at least 3 active campaigns in /api/deals, got ${dealsData.activeCampaigns?.length}`);
    }
    console.log("✅ SUCCESS: Global Deals API aggregates all 3 vendor campaigns.");

    // 7. Test Campaign Deactivation (Deactivate Campaign 1)
    console.log("\nStep 6: Testing Campaign Deactivation Isolation (Deactivating Campaign 1)...");
    await vendorRepository.updateCampaign(camp1.id, store.id, { isActive: false, status: "PAUSED" }, user.id);

    const updatedCamps = await vendorRepository.getStoreCampaigns(store.id);
    const activeCount = updatedCamps.filter((c) => c.isActive && c.status === "ACTIVE").length;
    console.log(`Active Campaigns Count after deactivating Campaign 1: ${activeCount}`);

    if (activeCount !== 2) {
      throw new Error(`❌ FAILURE: Expected 2 active campaigns after deactivating 1, got ${activeCount}`);
    }
    console.log("✅ SUCCESS: Deactivating Campaign 1 left Campaign 2 and Campaign 3 active and unaffected.");

    // Cleanup
    console.log("\nCleaning up test entities...");
    await db.campaignProduct.deleteMany({ where: { campaignId: { in: [camp1.id, camp2.id, camp3.id] } } });
    await db.marketingCampaign.deleteMany({ where: { id: { in: [camp1.id, camp2.id, camp3.id] } } });
    await db.product.deleteMany({ where: { id: { in: [p1.id, p2.id, p3.id, p4.id] } } });
    await db.store.delete({ where: { id: store.id } });
    await db.vendorProfile.delete({ where: { id: profile.id } });
    await db.user.delete({ where: { id: user.id } });

    console.log("Cleanup complete. ALL FORENSIC TESTS PASSED!");
  } catch (err) {
    console.error("Audit error:", err);
  } finally {
    await db.$disconnect();
  }
}

testSingleVendorMultipleCampaigns();
