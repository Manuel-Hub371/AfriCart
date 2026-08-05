import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resolveCampaignPricing, extractCampaigns } from "@/lib/campaign-pricing";
import { isBestSellerProduct } from "@/modules/catalog/best-seller-calculator";

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
                campaignProducts: { include: { campaign: true } },
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

    // Compute dynamic prices using single source of truth resolveCampaignPricing
    const products = (campaign.campaignProducts || []).map((cp: any, index: number) => {
      const p = cp.product;
      const campaigns = extractCampaigns((p as any).campaignProducts || [campaign]);
      const productMeta = { id: p.id, categoryName: p.categoryName, brand: p.brand, storeId: p.storeId };
      const pricing = resolveCampaignPricing(p.price, campaigns, productMeta);

      const isBestSeller = isBestSellerProduct({
        status: p.status,
        stock: p.stock,
        bestSellerScore: p.bestSellerScore,
        soldCount: p.soldCount,
      });

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        brand: p.brand || null,
        description: p.description,

        // Part 10 API Specs
        originalPrice: pricing.originalPrice,
        price: pricing.effectivePrice,
        campaignPrice: pricing.campaignPrice,
        compareAtPrice: pricing.isDiscounted ? pricing.originalPrice : null,

        campaign: pricing.campaign,
        campaignId: pricing.campaignId,
        campaignName: pricing.campaignName,
        campaignType: pricing.campaignType,
        campaignStatus: pricing.campaignStatus,
        discountType: pricing.discountType,
        discountValue: pricing.discountValue,
        campaignBadge: pricing.campaignBadge,
        campaignColor: pricing.campaignColor,
        campaignEndDate: pricing.campaignEndDate,
        isDiscounted: pricing.isDiscounted,
        amountSaved: pricing.amountSaved,
        discountPercent: pricing.discountPercent,

        isBestSeller,
        bestSellerScore: p.bestSellerScore || 0,
        bestSellerRank: isBestSeller ? index + 1 : null,

        category: p.categoryName,
        images: Array.isArray(p.images) ? p.images : [],
        stock: p.stock,
        rating: p.rating,
        numReviews: p.numReviews,
        storeName: p.store.name,
        verified: true,
        store: p.store,
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
        status: campaign.status || "ACTIVE",
        discountType: campaign.discountType,
        discountValue: campaign.discountValue,
        priority: campaign.priority,
        targetScope: campaign.targetScope || "PRODUCT",
        store: campaign.store,
      },
      products,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch campaign details" }, { status: 500 });
  }
}
