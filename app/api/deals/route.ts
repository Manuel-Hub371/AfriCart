import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resolveCampaignPricing, extractCampaigns } from "@/lib/campaign-pricing";
import { isBestSellerProduct } from "@/modules/catalog/best-seller-calculator";

// GET /api/deals
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category") || undefined;
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const minDiscount = searchParams.get("minDiscount") ? parseFloat(searchParams.get("minDiscount")!) : undefined;
    const sortBy = searchParams.get("sortBy") || "discount_desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const search = searchParams.get("query") || searchParams.get("q") || undefined;

    // 1. Fetch active marketing campaigns
    const now = new Date();
    const activeCampaigns = await db.marketingCampaign.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        status: "ACTIVE",
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { priority: "desc" },
    });

    // 2. Base product filter criteria
    const whereClause: any = {
      deletedAt: null,
      status: "ACTIVE",
      stock: { gt: 0 },
    };

    if (category) {
      whereClause.categoryName = { equals: category, mode: "insensitive" };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }

    // 3. Fetch products with store and campaign associations
    const rawProducts = await db.product.findMany({
      where: whereClause,
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        campaignProducts: {
          include: {
            campaign: true,
          },
        },
      },
    });

    // 4. Resolve campaign pricing for every product and filter deals only
    let dealProducts = rawProducts
      .map((p) => {
        const campaigns = extractCampaigns((p as any).campaignProducts || []);
        const productMeta = {
          id: p.id,
          categoryName: p.categoryName,
          brand: p.brand,
          storeId: p.storeId,
        };

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
          description: p.description || null,
          category: p.categoryName || "General",

          // Pricing — backend authoritative single source of truth
          originalPrice: pricing.originalPrice,
          price: pricing.effectivePrice,
          campaignPrice: pricing.campaignPrice,

          // Campaign metadata
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

          // Performance metrics
          rating: Number(p.rating || 5.0),
          numReviews: p.numReviews || 0,
          soldCount: p.soldCount || 0,
          stock: p.stock,
          isBestSeller,
          bestSellerScore: p.bestSellerScore || 0,
          isFeatured: p.isFeatured,
          images: Array.isArray(p.images) ? (p.images as string[]) : [],
          store: {
            id: p.store.id,
            name: p.store.name,
            slug: p.store.slug,
            logo: p.store.logo,
          },
          createdAt: p.createdAt.toISOString(),
        };
      })
      .filter((p) => p.isDiscounted && p.amountSaved > 0);

    // 5. Apply price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      dealProducts = dealProducts.filter((p) => {
        if (minPrice !== undefined && p.price < minPrice) return false;
        if (maxPrice !== undefined && p.price > maxPrice) return false;
        return true;
      });
    }

    // 6. Apply minimum discount percentage filter
    if (minDiscount !== undefined && minDiscount > 0) {
      dealProducts = dealProducts.filter((p) => p.discountPercent >= minDiscount);
    }

    // 7. Apply sorting
    if (sortBy === "discount_desc") {
      dealProducts.sort((a, b) => b.discountPercent - a.discountPercent || b.amountSaved - a.amountSaved);
    } else if (sortBy === "price_asc") {
      dealProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      dealProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      dealProducts.sort((a, b) => b.rating - a.rating || b.numReviews - a.numReviews);
    } else if (sortBy === "ending_soon") {
      dealProducts.sort((a, b) => {
        if (!a.campaignEndDate) return 1;
        if (!b.campaignEndDate) return -1;
        return new Date(a.campaignEndDate).getTime() - new Date(b.campaignEndDate).getTime();
      });
    } else if (sortBy === "newest") {
      dealProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // 8. Pagination
    const total = dealProducts.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = dealProducts.slice(startIndex, startIndex + limit);

    // Featured campaign spotlight (top active campaign with end date)
    const topCampaign = activeCampaigns.find((c) => c.endDate && new Date(c.endDate) > now) || activeCampaigns[0] || null;

    return NextResponse.json({
      products: paginatedProducts,
      total,
      page,
      limit,
      totalPages,
      featuredCampaign: topCampaign
        ? {
            id: topCampaign.id,
            name: topCampaign.name,
            badge: topCampaign.badge || topCampaign.name,
            color: topCampaign.color || "#EF4444",
            discountType: topCampaign.discountType,
            discountValue: topCampaign.discountValue,
            endDate: topCampaign.endDate ? topCampaign.endDate.toISOString() : null,
          }
        : null,
    });
  } catch (err: any) {
    console.error("Failed to fetch deals:", err);
    return NextResponse.json(
      { error: "Failed to retrieve promotional deals" },
      { status: 500 }
    );
  }
}
