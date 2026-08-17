import { db } from "../lib/db";
import { vendorRepository } from "../modules/vendor/repository";
import { resolveCampaignPricing, isCampaignLive } from "../lib/campaign-pricing";
import { GET } from "../app/api/deals/route";

async function testExistingProductCampaignAssignment() {
  console.log("=================================================");
  console.log("TESTING VENDOR CREATED CAMPAIGN ASSIGNED TO EXISTING PRODUCT");
  console.log("=================================================\n");

  const timeTag = Date.now();

  // Format today's YYYY-MM-DD string as a vendor UI would pass
  const todayStr = new Date().toISOString().split("T")[0];

  try {
    // 1. Create Vendor, Store, and ALREADY ADDED existing product
    console.log("Step 1: Creating Vendor and ALREADY ADDED Product...");
    const user = await db.user.create({
      data: { email: `existing_prod_vendor_${timeTag}@africart.test`, passwordHash: "dummy", status: "ACTIVE", firstName: "Vendor", lastName: "Existing" }
    });
    const profile = await db.vendorProfile.create({
      data: { userId: user.id, businessName: "Vendor Existing Electronics", businessCategory: "Electronics", country: "Ghana", region: "Accra", city: "Accra", businessAddress: "Address E" }
    });
    const store = await db.store.create({
      data: { vendorProfileId: profile.id, name: "Store Existing - Gadgets", slug: `store-existing-${timeTag}`, status: "ACTIVE" }
    });

    const existingProduct = await vendorRepository.createVendorProduct(store.id, {
      name: "Existing Samsung Galaxy Ultra", price: 8000, stock: 10, categoryName: "Electronics", brand: "Samsung"
    });
    console.log(`Created Existing Product: "${existingProduct.name}" (ID: ${existingProduct.id}, Price: GH₵${existingProduct.price})`);

    // 2. Vendor creates a campaign TODAY and assigns to existing product
    console.log("\nStep 2: Creating Campaign TODAY (Start Date: " + todayStr + ", End Date: " + todayStr + ") and assigning to existing product...");
    const campaign = await vendorRepository.createCampaign(store.id, {
      name: "Flash Sale Today Only",
      type: "FLASH_SALE",
      discountType: "PERCENTAGE",
      discountValue: 25, // 25% OFF
      startDate: todayStr,
      endDate: todayStr,
      productIds: [existingProduct.id],
      targetScope: "PRODUCT",
      status: "ACTIVE",
    }, user.id);

    console.log(`Created Campaign: "${campaign.name}" (ID: ${campaign.id})`);
    console.log(`Saved Campaign Status in DB: "${campaign.status}"`);
    console.log(`Saved Start Date: ${campaign.startDate.toISOString()}`);
    console.log(`Saved End Date: ${campaign.endDate.toISOString()}`);

    // 3. Check isCampaignLive()
    const live = isCampaignLive(campaign);
    console.log(`Is Campaign Live according to engine? ${live ? "YES ✅" : "NO ❌"}`);

    if (!live) {
      throw new Error("❌ FAILURE: Campaign is falsely marked inactive/expired!");
    }

    // 4. Test Single Source of Truth Pricing Resolution for existing product
    console.log("\nStep 3: Resolving Pricing for Existing Product...");
    const campaignsForProduct = await db.marketingCampaign.findMany({
      where: { campaignProducts: { some: { productId: existingProduct.id } } }
    });

    const pricing = resolveCampaignPricing(
      existingProduct.price,
      campaignsForProduct,
      { id: existingProduct.id, categoryName: existingProduct.categoryName, storeId: existingProduct.storeId }
    );

    console.log(`Original Price: GH₵${pricing.originalPrice}`);
    console.log(`Effective Price: GH₵${pricing.effectivePrice}`);
    console.log(`Is Discounted? ${pricing.isDiscounted}`);
    console.log(`Discount Percent: ${pricing.discountPercent}%`);
    console.log(`Amount Saved: GH₵${pricing.amountSaved}`);
    console.log(`Campaign Badge: ${pricing.campaignBadge}`);

    if (!pricing.isDiscounted || pricing.effectivePrice !== 6000) {
      throw new Error(`❌ FAILURE: Discount expected 6000 GH₵ but got ${pricing.effectivePrice}`);
    }

    // 5. Test Global Deals API GET /api/deals
    console.log("\nStep 4: Fetching Global Deals API (GET /api/deals)...");
    const mockRequest = new Request("http://localhost:3000/api/deals?limit=50");
    const res = await GET(mockRequest as any);
    const apiData = await res.json();

    const returnedDeal = apiData.products?.find((p: any) => p.id === existingProduct.id);

    if (returnedDeal) {
      console.log(`\n✅ SUCCESS: Existing product "${returnedDeal.name}" IS returned on /api/deals with discounted price GH₵${returnedDeal.price}!`);
    } else {
      console.error("\n❌ FAILURE: Existing product was NOT returned on /api/deals!");
      console.log("Returned API product IDs:", apiData.products?.map((p: any) => p.id));
      throw new Error("Existing product missing from Deals API output");
    }

    // Cleanup
    console.log("\nCleaning up test entities...");
    await db.campaignProduct.deleteMany({ where: { campaignId: campaign.id } });
    await db.marketingCampaign.delete({ where: { id: campaign.id } });
    await db.product.delete({ where: { id: existingProduct.id } });
    await db.store.delete({ where: { id: store.id } });
    await db.vendorProfile.delete({ where: { id: profile.id } });
    await db.user.delete({ where: { id: user.id } });

    console.log("Cleanup complete. ALL TESTS PASSED!");
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await db.$disconnect();
  }
}

testExistingProductCampaignAssignment();
