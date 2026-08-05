import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { vendorService } from "@/modules/vendor/service";
import { db } from "@/lib/db";

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

  return campaign._count?.campaignProducts || 0;
}

// GET /api/vendor/marketing/overview
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

    const now = new Date();

    // Fetch campaigns for this store from PostgreSQL
    const campaigns = await db.marketingCampaign.findMany({
      where: { storeId: store.id, deletedAt: null },
      include: {
        _count: { select: { campaignProducts: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Query OrderItems with campaign IDs for this store from PostgreSQL
    const campaignOrderItems = await db.orderItem.findMany({
      where: {
        storeId: store.id,
        campaignId: { not: null },
      },
      select: {
        quantity: true,
        price: true,
        originalPrice: true,
        discountAmount: true,
        campaignId: true,
      },
    });

    let totalRevenue = 0;
    let totalOrdersCount = campaignOrderItems.length;
    let totalUnitsSold = 0;
    let totalDiscountGiven = 0;

    const campaignMetricsMap = new Map<string, { orders: number; units: number; revenue: number; discount: number }>();

    for (const item of campaignOrderItems) {
      const qty = item.quantity || 1;
      const price = Number(item.price || 0);
      const discountPerUnit = Number(item.discountAmount || 0);

      totalUnitsSold += qty;
      totalRevenue += price * qty;
      totalDiscountGiven += discountPerUnit * qty;

      if (item.campaignId) {
        const prev = campaignMetricsMap.get(item.campaignId) || { orders: 0, units: 0, revenue: 0, discount: 0 };
        campaignMetricsMap.set(item.campaignId, {
          orders: prev.orders + 1,
          units: prev.units + qty,
          revenue: prev.revenue + price * qty,
          discount: prev.discount + discountPerUnit * qty,
        });
      }
    }

    // Overall Campaign Stats
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(
      (c) => c.isActive && c.startDate <= now && c.endDate >= now && c.status === "ACTIVE"
    ).length;
    const scheduledCampaigns = campaigns.filter(
      (c) => c.isActive && c.startDate > now
    ).length;
    const expiredCampaigns = campaigns.filter(
      (c) => c.endDate < now || c.status === "EXPIRED"
    ).length;
    const draftCampaigns = campaigns.filter((c) => !c.isActive || c.status === "DRAFT").length;

    const totalViews = campaigns.reduce((sum, c) => sum + (c.viewsCount || 0), 0);
    const conversionRate = totalViews > 0 ? parseFloat(((totalOrdersCount / totalViews) * 100).toFixed(1)) : 0;
    const avgDiscount = totalRevenue + totalDiscountGiven > 0
      ? parseFloat(((totalDiscountGiven / (totalRevenue + totalDiscountGiven)) * 100).toFixed(1))
      : 0;

    const campaignRoi = totalDiscountGiven > 0
      ? parseFloat((((totalRevenue - totalDiscountGiven) / totalDiscountGiven) * 100).toFixed(1))
      : (totalRevenue > 0 ? 100 : 0);

    const formattedCampaigns = await Promise.all(
      campaigns.map(async (c) => {
        const metrics = campaignMetricsMap.get(c.id) || { orders: 0, units: 0, revenue: 0, discount: 0 };
        const cViews = c.viewsCount || 0;
        const cConversion = cViews > 0 ? parseFloat(((metrics.orders / cViews) * 100).toFixed(1)) : 0;
        const cRoi = metrics.discount > 0
          ? parseFloat((((metrics.revenue - metrics.discount) / metrics.discount) * 100).toFixed(1))
          : (metrics.revenue > 0 ? 100 : 0);

        const endMs = new Date(c.endDate).getTime();
        const diffMs = endMs - now.getTime();
        let remainingDuration = "Expired";
        if (diffMs > 0) {
          const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          remainingDuration = days > 0 ? `${days}d ${hours}h remaining` : `${hours}h remaining`;
        }

        let campaignStatus = c.status || "ACTIVE";
        if (!c.isActive) campaignStatus = "DRAFT";
        else if (c.startDate > now) campaignStatus = "SCHEDULED";
        else if (c.endDate < now) campaignStatus = "EXPIRED";

        const productsCount = await calculateCampaignProductsCount(c, store.id);

        return {
          id: c.id,
          name: c.name,
          slug: c.slug,
          type: c.type,
          description: c.description,
          badge: c.badge,
          color: c.color,
          startDate: c.startDate.toISOString(),
          endDate: c.endDate.toISOString(),
          isActive: c.isActive,
          status: campaignStatus,
          remainingDuration,
          discountType: c.discountType,
          discountValue: c.discountValue,
          priority: c.priority,
          targetScope: c.targetScope || "PRODUCT",
          productsCount,
          viewsCount: cViews,
          ordersCount: metrics.orders,
          unitsSold: metrics.units,
          revenueGenerated: parseFloat(metrics.revenue.toFixed(2)),
          discountGiven: parseFloat(metrics.discount.toFixed(2)),
          conversionRate: cConversion,
          campaignRoi: cRoi,
        };
      })
    );

    const productsInCampaigns = await db.campaignProduct.count({
      where: {
        campaign: {
          storeId: store.id,
          isActive: true,
          deletedAt: null,
        },
      },
    });

    return NextResponse.json({
      stats: {
        totalCampaigns,
        activeCampaigns,
        scheduledCampaigns,
        expiredCampaigns,
        draftCampaigns,
        productsInCampaigns,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders: totalOrdersCount,
        unitsSold: totalUnitsSold,
        totalDiscountGiven: parseFloat(totalDiscountGiven.toFixed(2)),
        conversionRate,
        avgDiscount,
        campaignRoi,
      },
      campaigns: formattedCampaigns,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch marketing overview" },
      { status: 500 }
    );
  }
}
