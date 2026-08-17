import { db } from "../lib/db";
import { GET } from "../app/api/deals/route";

async function checkDealsEmpty() {
  console.log("=== CHECKING DEALS DB & API STATUS ===");
  const now = new Date();
  console.log("Current Server Time:", now.toISOString());

  // 1. Check all campaigns in DB
  const campaigns = await db.marketingCampaign.findMany({
    where: { deletedAt: null },
    include: {
      store: true,
      campaignProducts: { include: { product: true } },
    },
  });

  console.log(`\nTotal Campaigns in DB (not deleted): ${campaigns.length}`);
  for (const c of campaigns) {
    console.log(`Campaign: "${c.name}" (ID: ${c.id})`);
    console.log(`  Store: ${c.store?.name} (ID: ${c.storeId})`);
    console.log(`  isActive: ${c.isActive}, status: ${c.status}`);
    console.log(`  startDate: ${c.startDate.toISOString()}`);
    console.log(`  endDate: ${c.endDate.toISOString()}`);
    console.log(`  targetScope: ${c.targetScope}`);
    console.log(`  campaignProducts count: ${c.campaignProducts.length}`);
    for (const cp of c.campaignProducts) {
      console.log(`    - Product: "${cp.product?.name}" (ID: ${cp.productId}, Price: ${cp.product?.price}, Status: ${cp.product?.status}, Stock: ${cp.product?.stock})`);
    }
  }

  // 2. Execute GET /api/deals endpoint
  console.log("\nExecuting GET /api/deals mock request...");
  const mockReq = new Request("http://localhost:3000/api/deals");
  const res = await GET(mockReq as any);
  const data = await res.json();

  console.log("\n--- API RESPONSE ---");
  console.log(`Total Products: ${data.total}`);
  console.log(`Products Array Length: ${data.products?.length}`);
  console.log(`Active Campaigns Array Length: ${data.activeCampaigns?.length}`);
  console.log("Featured Campaign:", data.featuredCampaign);

  if (data.products && data.products.length > 0) {
    console.log("\nReturned Products:");
    for (const p of data.products) {
      console.log(`  - "${p.name}" (Price: GH₵${p.price}, Saved: GH₵${p.amountSaved}, Badge: ${p.campaignBadge})`);
    }
  }

  await db.$disconnect();
}

checkDealsEmpty();
