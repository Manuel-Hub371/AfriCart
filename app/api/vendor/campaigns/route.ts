import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { vendorService } from "@/modules/vendor/service";
import { vendorRepository } from "@/modules/vendor/repository";
import { db } from "@/lib/db";

// Helper function to calculate real-time dynamic product count according to targetScope
async function calculateCampaignProductsCount(campaign: any, storeId: string) {
  const scope = campaign.targetScope || "PRODUCT";

  if (scope === "STORE") {
    return db.product.count({
      where: { storeId, deletedAt: null, status: "ACTIVE" },
    });
  }

  if (scope === "CATEGORY" && Array.isArray(campaign.targetCategories) && campaign.targetCategories.length > 0) {
    const cats = (campaign.targetCategories as string[]).map((c) => c.toLowerCase());
    const products = await db.product.findMany({
      where: { storeId, deletedAt: null, status: "ACTIVE" },
      select: { categoryName: true },
    });
    return products.filter((p) => p.categoryName && cats.includes(p.categoryName.toLowerCase())).length;
  }

  if (scope === "BRAND" && Array.isArray(campaign.targetBrands) && campaign.targetBrands.length > 0) {
    const brands = (campaign.targetBrands as string[]).map((b) => b.toLowerCase());
    const products = await db.product.findMany({
      where: { storeId, deletedAt: null, status: "ACTIVE" },
      select: { brand: true },
    });
    return products.filter((p) => p.brand && brands.includes(p.brand.toLowerCase())).length;
  }

  if (scope === "MARKETPLACE") {
    return db.product.count({
      where: { deletedAt: null, status: "ACTIVE" },
    });
  }

  // Default: PRODUCT scope — return exact count of linked products in CampaignProduct join table
  return campaign._count?.campaignProducts || 0;
}

// GET /api/vendor/campaigns
export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const store = await vendorService.getVendorStore(userId);
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const campaigns = await vendorRepository.getStoreCampaigns(store.id);

    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter((c) => c.isActive && c.status === "ACTIVE").length;
    const totalViews = campaigns.reduce((sum, c) => sum + (c.viewsCount || 0), 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + (c.revenueGenerated || 0), 0);

    const formattedCampaigns = await Promise.all(
      campaigns.map(async (c) => {
        const productsCount = await calculateCampaignProductsCount(c, store.id);

        return {
          id: c.id,
          storeId: c.storeId,
          name: c.name,
          slug: c.slug,
          type: c.type,
          description: c.description,
          banner: c.banner,
          badge: c.badge,
          color: c.color,
          startDate: c.startDate.toISOString(),
          endDate: c.endDate.toISOString(),
          isActive: c.isActive,
          status: c.status || "ACTIVE",
          visibility: c.visibility,
          discountType: c.discountType,
          discountValue: c.discountValue,
          priority: c.priority,
          targetScope: c.targetScope || "PRODUCT",
          targetCategories: c.targetCategories,
          targetBrands: c.targetBrands,
          perCustomerLimit: c.perCustomerLimit,
          minimumOrderValue: c.minimumOrderValue,
          maximumDiscount: c.maximumDiscount,
          eligibleCustomerGroups: c.eligibleCustomerGroups,
          maxUses: c.maxUses,
          usedCount: c.usedCount,
          viewsCount: c.viewsCount,
          salesCount: c.salesCount,
          revenueGenerated: c.revenueGenerated,
          productsCount,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
        };
      })
    );

    return NextResponse.json({
      campaigns: formattedCampaigns,
      stats: {
        totalCampaigns,
        activeCampaigns,
        totalViews,
        totalRevenue,
      },
    });
  } catch (err: any) {
    const status = err?.status ?? 500;
    return NextResponse.json({ error: err?.message || "Failed to fetch marketing campaigns" }, { status });
  }
}

// POST /api/vendor/campaigns
export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const store = await vendorService.getVendorStore(userId);
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const body = await req.json();
    if (!body.name || !body.endDate) {
      return NextResponse.json({ error: "Campaign name and end date are required" }, { status: 400 });
    }

    const campaign = await vendorRepository.createCampaign(store.id, body, userId);

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (err: any) {
    const status = err?.status ?? 500;
    return NextResponse.json({ error: err?.message || "Failed to create marketing campaign" }, { status });
  }
}
