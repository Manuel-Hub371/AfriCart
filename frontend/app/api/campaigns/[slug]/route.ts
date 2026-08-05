import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/campaigns/[slug]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    const campaign: any = await db.marketingCampaign.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
      include: {
        store: {
          select: { id: true, name: true, logo: true, slug: true },
        },
        campaignProducts: {
          include: {
            product: {
              include: {
                store: { select: { id: true, name: true, slug: true } },
              },
            },
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Increment view count asynchronously
    db.marketingCampaign.update({
      where: { id: campaign.id },
      data: { viewsCount: { increment: 1 } },
    }).catch(() => {});

    // Compute dynamic prices for products
    const products = (campaign.campaignProducts || []).map((cp: any) => {
      const p = cp.product;
      let effectivePrice = p.price;
      let originalPrice = p.compareAtPrice || p.price;
      let discountPercent = 0;

      if (campaign.discountType === "PERCENTAGE" && campaign.discountValue) {
        discountPercent = Math.min(100, Math.max(0, campaign.discountValue));
        effectivePrice = p.price * (1 - discountPercent / 100);
        originalPrice = p.price;
      } else if (campaign.discountType === "FIXED" && campaign.discountValue) {
        effectivePrice = Math.max(0, p.price - campaign.discountValue);
        originalPrice = p.price;
        discountPercent = p.price > 0 ? Math.round(((p.price - effectivePrice) / p.price) * 100) : 0;
      }

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        price: effectivePrice,
        originalPrice: originalPrice > effectivePrice ? originalPrice : undefined,
        discountPercent: discountPercent > 0 ? discountPercent : undefined,
        images: Array.isArray(p.images) ? p.images : [],
        stock: p.stock,
        rating: p.rating,
        numReviews: p.numReviews,
        storeName: p.store.name,
        verified: true,
        campaignBadge: campaign.badge || campaign.name,
      };
    });

    return NextResponse.json({
      campaign: {
        id: campaign.id,
        name: campaign.name,
        slug: campaign.slug,
        type: campaign.type,
        description: campaign.description,
        banner: campaign.banner,
        badge: campaign.badge,
        color: campaign.color,
        startDate: campaign.startDate.toISOString(),
        endDate: campaign.endDate.toISOString(),
        discountType: campaign.discountType,
        discountValue: campaign.discountValue,
        store: campaign.store,
      },
      products,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch campaign details" }, { status: 500 });
  }
}
