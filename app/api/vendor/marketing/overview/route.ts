import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { vendorService } from "@/modules/vendor/service";
import { db } from "@/lib/db";

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

    // Fetch campaigns
    const campaigns = await db.marketingCampaign.findMany({
      where: { storeId: store.id, deletedAt: null },
      include: {
        _count: { select: { campaignProducts: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate Campaign Stats
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(
      (c) => c.isActive && c.startDate <= now && c.endDate >= now
    ).length;
    const scheduledCampaigns = campaigns.filter(
      (c) => c.isActive && c.startDate > now
    ).length;
    const expiredCampaigns = campaigns.filter(
      (c) => c.endDate < now
    ).length;
    const draftCampaigns = campaigns.filter((c) => !c.isActive).length;

    // Count distinct products linked to active campaigns
    const campaignProductsCount = await db.campaignProduct.count({
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
        productsInCampaigns: campaignProductsCount,
      },
      campaigns: campaigns.slice(0, 6).map((c) => ({
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
        discountType: c.discountType,
        discountValue: c.discountValue,
        productsCount: c._count.campaignProducts,
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch marketing overview" },
      { status: 500 }
    );
  }
}
