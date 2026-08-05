import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/campaigns
export async function GET() {
  try {
    const now = new Date();
    const campaigns = await db.marketingCampaign.findMany({
      where: {
        isActive: true,
        visibility: "PUBLIC",
        deletedAt: null,
        endDate: { gte: now },
      },
      include: {
        store: {
          select: { id: true, name: true, logo: true, slug: true },
        },
        _count: {
          select: { campaignProducts: true },
        },
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      campaigns: campaigns.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        type: c.type,
        description: c.description,
        banner: c.banner,
        badge: c.badge,
        color: c.color,
        startDate: c.startDate.toISOString(),
        endDate: c.endDate.toISOString(),
        discountType: c.discountType,
        discountValue: c.discountValue,
        store: c.store,
        productsCount: c._count.campaignProducts,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch active campaigns" }, { status: 500 });
  }
}
