import { db } from "../lib/db";
import { vendorRepository } from "../modules/vendor/repository";
import { resolveCampaignPricing } from "../lib/campaign-pricing";
import { GET } from "../app/api/deals/route";

async function testVendorDiscountIsolation() {
  console.log("=================================================");
  console.log("TESTING VENDOR DISCOUNT ISOLATION & ACCURACY");
  console.log("=================================================\n");

  const timeTag = Date.now();
  const todayStr = new Date().toISOString().split("T")[0];

  try {
    // 1. Create Vendor A with Product A (Price: GH₵100)
    console.log("Creating Vendor A (Store A)...");
    const userA = await db.user.create({
      data: { email: `vendorA_iso_${timeTag}@africart.test`, passwordHash: "dummy", status: "ACTIVE", firstName: "Vendor", lastName: "A" }
    });
    const profileA = await db.vendorProfile.create({
      data: { userId: userA.id, businessName: "Vendor A Isolation", businessCategory: "Electronics", country: "Ghana", region: "Accra", city: "Accra", businessAddress: "Address A" }
    });
    const storeA = await db.store.create({
      data: { vendorProfileId: profileA.id, name: "Store A - Fixed 15 GH", slug: `store-a-iso-${timeTag}`, status: "ACTIVE" }
    });
    const prodA = await vendorRepository.createVendorProduct(storeA.id, {
      name: "Vendor A Smart Speaker", price: 100, stock: 10, categoryName: "Electronics", brand: "BrandA"
    });

    // 2. Create Vendor B with Product B (Price: GH₵200)
    console.log("Creating Vendor B (Store B)...");
    const userB = await db.user.create({
      data: { email: `vendorB_iso_${timeTag}@africart.test`, passwordHash: "dummy", status: "ACTIVE", firstName: "Vendor", lastName: "B" }
    });
    const profileB = await db.vendorProfile.create({
      data: { userId: userB.id, businessName: "Vendor B Isolation", businessCategory: "Electronics", country: "Ghana", region: "Accra", city: "Accra", businessAddress: "Address B" }
    });
    const storeB = await db.store.create({
      data: { vendorProfileId: profileB.id, name: "Store B - 50 Percent OFF", slug: `store-b-iso-${timeTag}`, status: "ACTIVE" }
    });
    const prodB = await vendorRepository.createVendorProduct(storeB.id, {
      name: "Vendor B Wireless Earbuds", price: 200, stock: 10, categoryName: "Electronics", brand: "BrandB"
    });

    // 3. Vendor A creates a FIXED GH₵15 discount campaign
    console.log("Vendor A creates Campaign A: Fixed GH₵15 OFF...");
    const campA = await vendorRepository.createCampaign(storeA.id, {
      name: "Vendor A GH₵15 Deal",
      type: "FLASH_SALE",
      discountType: "FIXED",
      discountValue: 15, // GH₵15 OFF
      startDate: todayStr,
      endDate: todayStr,
      productIds: [prodA.id],
      targetScope: "PRODUCT",
      status: "ACTIVE",
    }, userA.id);

    // 4. Vendor B creates a 50% discount campaign
    console.log("Vendor B creates Campaign B: 50% OFF...");
    const campB = await vendorRepository.createCampaign(storeB.id, {
      name: "Vendor B Mega 50% Deal",
      type: "BLACK_FRIDAY",
      discountType: "PERCENTAGE",
      discountValue: 50, // 50% OFF
      startDate: todayStr,
      endDate: todayStr,
      productIds: [prodB.id],
      targetScope: "PRODUCT",
      status: "ACTIVE",
    }, userB.id);

    // 5. Test Pricing Resolution for Prod A
    console.log("\nResolving Pricing for Prod A (Vendor A, Original: GH₵100, Discount: GH₵15)...");
    const activeCamps = await db.marketingCampaign.findMany({
      where: { id: { in: [campA.id, campB.id] } },
      include: { campaignProducts: true }
    });

    const pricingA = resolveCampaignPricing(
      prodA.price,
      activeCamps,
      { id: prodA.id, categoryName: prodA.categoryName, brand: prodA.brand, storeId: prodA.storeId }
    );

    console.log(`Prod A Original Price: GH₵${pricingA.originalPrice}`);
    console.log(`Prod A Effective Price: GH₵${pricingA.effectivePrice}`);
    console.log(`Prod A Amount Saved: GH₵${pricingA.amountSaved}`);
    console.log(`Prod A Campaign Applied: "${pricingA.campaignName}"`);

    // Prod A MUST have effectivePrice = 85 (100 - 15) and NOT 50 (50% off)!
    if (pricingA.effectivePrice !== 85 || pricingA.amountSaved !== 15) {
      console.error(`❌ FAILURE: Prod A price was modified! Expected 85 GH₵, got ${pricingA.effectivePrice} GH₵`);
      throw new Error("Vendor A discount cross-contaminated by Vendor B!");
    } else {
      console.log("✅ SUCCESS: Prod A correctly received EXACTLY GH₵15 discount!");
    }

    // 6. Test Pricing Resolution for Prod B
    console.log("\nResolving Pricing for Prod B (Vendor B, Original: GH₵200, Discount: 50%)...");
    const pricingB = resolveCampaignPricing(
      prodB.price,
      activeCamps,
      { id: prodB.id, categoryName: prodB.categoryName, brand: prodB.brand, storeId: prodB.storeId }
    );

    console.log(`Prod B Original Price: GH₵${pricingB.originalPrice}`);
    console.log(`Prod B Effective Price: GH₵${pricingB.effectivePrice}`);
    console.log(`Prod B Amount Saved: GH₵${pricingB.amountSaved}`);
    console.log(`Prod B Campaign Applied: "${pricingB.campaignName}"`);

    if (pricingB.effectivePrice !== 100 || pricingB.discountPercent !== 50) {
      console.error(`❌ FAILURE: Prod B price mismatch! Expected 100 GH₵, got ${pricingB.effectivePrice} GH₵`);
      throw new Error("Vendor B discount incorrect!");
    } else {
      console.log("✅ SUCCESS: Prod B correctly received EXACTLY 50% discount!");
    }

    // Cleanup
    console.log("\nCleaning up test entities...");
    await db.campaignProduct.deleteMany({ where: { campaignId: { in: [campA.id, campB.id] } } });
    await db.marketingCampaign.deleteMany({ where: { id: { in: [campA.id, campB.id] } } });
    await db.product.deleteMany({ where: { id: { in: [prodA.id, prodB.id] } } });
    await db.store.deleteMany({ where: { id: { in: [storeA.id, storeB.id] } } });
    await db.vendorProfile.deleteMany({ where: { id: { in: [profileA.id, profileB.id] } } });
    await db.user.deleteMany({ where: { id: { in: [userA.id, userB.id] } } });

    console.log("Cleanup complete. ISOLATION TEST PASSED!");
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await db.$disconnect();
  }
}

testVendorDiscountIsolation();
