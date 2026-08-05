import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { vendorService } from "@/modules/vendor/service";
import { vendorRepository } from "@/modules/vendor/repository";

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
    const activeCampaigns = campaigns.filter((c) => c.isActive).length;
    const totalViews = campaigns.reduce((sum, c) => sum + (c.viewsCount || 0), 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + (c.revenueGenerated || 0), 0);

    return NextResponse.json({
      campaigns: campaigns.map((c) => ({
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
        visibility: c.visibility,
        discountType: c.discountType,
        discountValue: c.discountValue,
        priority: c.priority,
        maxUses: c.maxUses,
        usedCount: c.usedCount,
        viewsCount: c.viewsCount,
        salesCount: c.salesCount,
        revenueGenerated: c.revenueGenerated,
        productsCount: c._count?.campaignProducts || 0,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
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

    const campaign = await vendorRepository.createCampaign(store.id, body);

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (err: any) {
    const status = err?.status ?? 500;
    return NextResponse.json({ error: err?.message || "Failed to create marketing campaign" }, { status });
  }
}
