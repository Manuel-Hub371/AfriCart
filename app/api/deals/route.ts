import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resolveCampaignPricing, extractCampaigns } from "@/lib/campaign-pricing";
import { isBestSellerProduct } from "@/modules/catalog/best-seller-calculator";
import { normalizeImages } from "@/lib/image-utils";

// GET /api/deals — Global Marketplace Deals Engine
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category") || undefined;
    const vendorId = searchParams.get("vendorId") || searchParams.get("storeId") || undefined;
    const campaignIdParam = searchParams.get("campaignId") || undefined;
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const minDiscount = searchParams.get("minDiscount") ? parseFloat(searchParams.get("minDiscount")!) : undefined;
    const sortBy = searchParams.get("sortBy") || "discount_desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const search = searchParams.get("query") || searchParams.get("q") || undefined;

    const now = new Date();

    // 1. Fetch ALL valid, live marketing campaigns across ALL vendors in the marketplace
    const activeCampaigns = await db.marketingCampaign.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        status: "ACTIVE",
        startDate: { lte: now },
        endDate: { gte: now },
        ...(campaignIdParam ? { id: campaignIdParam } : {}),
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

    if (activeCampaigns.length === 0) {
      return NextResponse.json({
        products: [],
        total: 0,
        page,
        limit,
        totalPages: 1,
        featuredCampaign: null,
        activeCampaigns: [],
      });
    }

    // 2. Build database-level campaign eligibility filter
    const campaignEligibilityOr: any[] = [];

    // Direct PRODUCT scope campaign linkage via CampaignProduct join table
    const productCampaignIds = activeCampaigns
      .filter((c) => c.targetScope === "PRODUCT" || !c.targetScope)
      .map((c) => c.id);

    if (productCampaignIds.length > 0) {
      campaignEligibilityOr.push({
        campaignProducts: {
          some: {
            campaignId: { in: productCampaignIds },
          },
        },
      });
    }

    // STORE scope campaigns
    const storeIds = activeCampaigns
      .filter((c) => c.targetScope === "STORE")
      .map((c) => c.storeId);
    if (storeIds.length > 0) {
      campaignEligibilityOr.push({ storeId: { in: storeIds } });
    }

    // CATEGORY scope campaigns
    const targetCategories = activeCampaigns
      .filter((c) => c.targetScope === "CATEGORY" && Array.isArray(c.targetCategories))
      .flatMap((c) => c.targetCategories as string[]);
    if (targetCategories.length > 0) {
      campaignEligibilityOr.push({ categoryName: { in: targetCategories, mode: "insensitive" } });
    }

    // BRAND scope campaigns
    const targetBrands = activeCampaigns
      .filter((c) => c.targetScope === "BRAND" && Array.isArray(c.targetBrands))
      .flatMap((c) => c.targetBrands as string[]);
    if (targetBrands.length > 0) {
      campaignEligibilityOr.push({ brand: { in: targetBrands, mode: "insensitive" } });
    }

    // MARKETPLACE scope campaigns
    const hasMarketplaceScope = activeCampaigns.some((c) => c.targetScope === "MARKETPLACE");

    // 3. Base product filter criteria
    const whereClause: any = {
      deletedAt: null,
      status: "ACTIVE",
      stock: { gt: 0 },
      store: {
        deletedAt: null,
        status: { in: ["ACTIVE", "VACATION"] },
      },
    };

    if (!hasMarketplaceScope && campaignEligibilityOr.length > 0) {
      whereClause.OR = campaignEligibilityOr;
    }

    if (category) {
      whereClause.categoryName = { equals: category, mode: "insensitive" };
    }

    if (vendorId) {
      whereClause.storeId = vendorId;
    }

    if (search) {
      const searchCondition = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { brand: { contains: search, mode: "insensitive" } },
          { store: { name: { contains: search, mode: "insensitive" } } },
        ],
      };

      if (whereClause.OR) {
        whereClause.AND = [searchCondition];
      } else {
        whereClause.OR = searchCondition.OR;
      }
    }

    // 4. Fetch candidate deal products efficiently with store & campaign associations
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
      take: 500, // Limit database fetch boundary for scalability
    });

    // 5. Resolve single-source pricing using authoritative campaign pricing engine
    let dealProducts = rawProducts
      .map((p) => {
        // Merge direct campaignProducts with all live marketplace campaigns for scope resolution
        const directCampaigns = extractCampaigns((p as any).campaignProducts || []);
        const allCandidateCampaigns = [...directCampaigns, ...activeCampaigns];

        // Deduplicate campaigns by ID
        const campaignMap = new Map<string, any>();
        for (const c of allCandidateCampaigns) {
          if (c && c.id && !campaignMap.has(c.id)) {
            campaignMap.set(c.id, c);
          }
        }
        const campaigns = Array.from(campaignMap.values());

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

          // Performance & store details
          rating: Number(p.rating || 5.0),
          numReviews: p.numReviews || 0,
          soldCount: p.soldCount || 0,
          stock: p.stock,
          isBestSeller,
          bestSellerScore: p.bestSellerScore || 0,
          isFeatured: p.isFeatured,
          images: normalizeImages(p.images),
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

    // 6. Apply price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      dealProducts = dealProducts.filter((p) => {
        if (minPrice !== undefined && p.price < minPrice) return false;
        if (maxPrice !== undefined && p.price > maxPrice) return false;
        return true;
      });
    }

    // 7. Apply minimum discount percentage filter
    if (minDiscount !== undefined && minDiscount > 0) {
      dealProducts = dealProducts.filter((p) => p.discountPercent >= minDiscount);
    }

    // 8. Apply sorting
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

    // 9. Pagination
    const total = dealProducts.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = dealProducts.slice(startIndex, startIndex + limit);

    // Featured campaign spotlight (top active campaign with end date)
    const topCampaign = activeCampaigns.find((c) => c.endDate && new Date(c.endDate) > now) || activeCampaigns[0] || null;

    const formattedActiveCampaigns = activeCampaigns.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      badge: c.badge || c.name,
      color: c.color || "#EF4444",
      discountType: c.discountType,
      discountValue: c.discountValue,
      endDate: c.endDate ? c.endDate.toISOString() : null,
      store: c.store,
      productsCount: c._count.campaignProducts,
    }));

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
      activeCampaigns: formattedActiveCampaigns,
    });
  } catch (err: any) {
    console.error("Failed to fetch global deals:", err);
    return NextResponse.json(
      { error: "Failed to retrieve promotional deals" },
      { status: 500 }
    );
  }
}
