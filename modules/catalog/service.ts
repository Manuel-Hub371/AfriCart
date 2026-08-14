import { catalogRepository, CatalogRepository } from "./repository";
import { isBestSellerProduct } from "./best-seller-calculator";
import {
  GetProductsQueryInput,
  PaginatedProductsResponseDTO,
  ProductDTO,
  CategoryDTO,
  StoreCatalogDTO,
} from "./dto";
import { resolveCampaignPricing, extractCampaigns } from "@/lib/campaign-pricing";

export class CatalogService {
  constructor(private repo: CatalogRepository = catalogRepository) {}

  /**
   * Get paginated & filtered products catalog using effective campaign pricing for filtering & sorting.
   */
  async getProducts(query: GetProductsQueryInput): Promise<PaginatedProductsResponseDTO> {
    const data = await this.repo.findProducts(query);

    // Map products and compute effective campaign pricing for every product
    let formattedProducts: ProductDTO[] = data.products.map((p, index) => {
      const campaigns = extractCampaigns((p as any).campaignProducts || []);
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
        brand: p.brand || null,
        slug: p.slug,
        description: p.description,

        // Pricing — always from backend single source of truth
        originalPrice: pricing.originalPrice,
        price: pricing.effectivePrice,
        campaignPrice: pricing.campaignPrice,

        // Campaign fields — Part 10 & Enterprise specs
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

        // Best Seller fields — Part 7, 8, 10
        isBestSeller,
        bestSellerScore: p.bestSellerScore || 0,
        bestSellerRank: isBestSeller ? index + 1 : null,
        unitsSold: p.soldCount || 0,
        averageRating: p.rating || 0,
        reviewCount: p.numReviews || 0,

        category: p.categoryName,
        images: Array.isArray(p.images) ? (p.images as string[]) : [],
        stock: p.stock,
        rating: p.rating,
        numReviews: p.numReviews,
        soldCount: p.soldCount || 0,
        isFeatured: p.isFeatured,
        status: p.status,
        campaigns,
        store: {
          id: p.store.id,
          name: p.store.name,
          slug: p.store.slug,
          logo: p.store.logo,
        },
        createdAt: p.createdAt.toISOString(),
      };
    });

    // Filter by rating if requested
    if (query.rating !== undefined && query.rating > 0) {
      formattedProducts = formattedProducts.filter((p) => (p.rating || 0) >= query.rating!);
    }

    // Filter by effective campaign price if minPrice/maxPrice requested
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      formattedProducts = formattedProducts.filter((p) => {
        if (query.minPrice !== undefined && p.price < query.minPrice) return false;
        if (query.maxPrice !== undefined && p.price > query.maxPrice) return false;
        return true;
      });
    }

    // Sort by effective campaign price when price_asc or price_desc is specified
    if (query.sortBy === "price_asc") {
      formattedProducts.sort((a, b) => a.price - b.price);
    } else if (query.sortBy === "price_desc") {
      formattedProducts.sort((a, b) => b.price - a.price);
    } else if (query.sortBy === "rating") {
      formattedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (query.sortBy === "best_sellers") {
      formattedProducts.sort((a, b) => (b.unitsSold || b.bestSellerScore || 0) - (a.unitsSold || a.bestSellerScore || 0));
    }

    const effectiveTotal = (query.minPrice !== undefined || query.maxPrice !== undefined || query.rating !== undefined)
      ? formattedProducts.length
      : data.total;

    return {
      products: formattedProducts,
      total: effectiveTotal,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(effectiveTotal / data.limit) || 1,
    };
  }

  /**
   * Get product details by ID or Slug with complete store & review metadata
   */
  async getProductDetails(idOrSlug: string): Promise<any> {
    const product = await this.repo.findProductByIdOrSlug(idOrSlug);
    if (!product) {
      throw new Error("Product not found");
    }

    const st = product.store;
    const vp = st?.vendorProfile;
    const locationParts = [vp?.city, vp?.region, vp?.country].filter(Boolean);
    const locationStr = locationParts.length > 0 ? locationParts.join(", ") : "Accra, Ghana";

    // Auto-generate badges
    const isBestSeller = isBestSellerProduct({
      status: product.status,
      stock: product.stock,
      bestSellerScore: product.bestSellerScore,
      soldCount: product.soldCount,
    });

    let badgesList: string[] = Array.isArray(product.badges) ? (product.badges as string[]) : [];
    if (badgesList.length === 0) {
      if (product.isFeatured) badgesList.push("FEATURED");
      if (product.stock <= 5 && product.stock > 0) badgesList.push("LIMITED_STOCK");
      if (isBestSeller) badgesList.push("BEST_SELLER");
      if (product.views > 50) badgesList.push("TRENDING");
      if (product.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) badgesList.push("NEW_ARRIVAL");
    }

    // Campaign pricing — single source of truth
    const campaigns = extractCampaigns((product as any).campaignProducts || []);
    const productMeta = { id: product.id, categoryName: product.categoryName, brand: product.brand, storeId: product.storeId };
    const pricing = resolveCampaignPricing(product.price, campaigns, productMeta);

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      brand: product.brand || null,

      // Pricing — Part 10
      originalPrice: pricing.originalPrice,
      price: pricing.effectivePrice,
      campaignPrice: pricing.campaignPrice,

      // Campaign metadata — Part 10 & Enterprise specs
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

      campaigns,
      category: product.categoryName || st?.category || "General",
      images: Array.isArray(product.images) ? (product.images as string[]) : [],
      stock: product.stock,
      views: product.views,
      rating: product.rating,
      numReviews: product.numReviews,
      soldCount: product.soldCount || 0,
      unitsSold: product.soldCount || 0,
      averageRating: product.rating || 0,
      reviewCount: product.numReviews || 0,
      isFeatured: product.isFeatured,
      isBestSeller,
      bestSellerScore: product.bestSellerScore || 0,
      bestSellerRank: isBestSeller ? 1 : null,
      status: product.status,
      weight: product.weight || null,
      dimensions: product.dimensions || null,
      badges: badgesList,
      specifications: product.specifications || null,
      shippingPolicies: (product.shippingPolicies || [])
        .map((sp: any) => sp.shippingPolicy)
        .filter((sp: any) => sp && sp.isActive && !sp.deletedAt)
        .map((sp: any) => ({
          id: sp.id,
          name: sp.name,
          shippingMethod: sp.shippingMethod,
          deliveryTime: sp.deliveryTime,
          shippingCost: Number(sp.shippingCost),
          freeShippingThreshold: sp.freeShippingThreshold ? Number(sp.freeShippingThreshold) : null,
          processingTime: sp.processingTime || null,
          deliveryRegions: sp.deliveryRegions || null,
          localPickup: Boolean(sp.localPickup),
          cashOnDelivery: Boolean(sp.cashOnDelivery),
          trackingSupported: Boolean(sp.trackingSupported),
          description: sp.description || null,
        })),
      refundPolicy: (product as any).refundPolicy ? {
        id: (product as any).refundPolicy.id,
        name: (product as any).refundPolicy.name,
        description: (product as any).refundPolicy.description || null,
        eligibilityPeriod: (product as any).refundPolicy.eligibilityPeriod,
        refundType: (product as any).refundPolicy.refundType,
        conditions: (product as any).refundPolicy.conditions || null,
        excludedProducts: (product as any).refundPolicy.excludedProducts || null,
        processingTime: (product as any).refundPolicy.processingTime || null,
      } : null,
      returnPolicy: (product as any).returnPolicy ? {
        id: (product as any).returnPolicy.id,
        name: (product as any).returnPolicy.name,
        description: (product as any).returnPolicy.description || null,
        returnWindow: (product as any).returnPolicy.returnWindow,
        returnConditions: (product as any).returnPolicy.returnConditions || null,
        shippingResponsibility: (product as any).returnPolicy.shippingResponsibility,
        acceptedReasons: (product as any).returnPolicy.acceptedReasons || null,
        inspectionReqs: (product as any).returnPolicy.inspectionReqs || null,
      } : null,
      warrantyPolicy: (product as any).warrantyPolicy ? {
        id: (product as any).warrantyPolicy.id,
        name: (product as any).warrantyPolicy.name,
        warrantyType: (product as any).warrantyPolicy.warrantyType,
        warrantyDuration: (product as any).warrantyPolicy.warrantyDuration,
        coverage: (product as any).warrantyPolicy.coverage || null,
        exclusions: (product as any).warrantyPolicy.exclusions || null,
        claimProcess: (product as any).warrantyPolicy.claimProcess || null,
      } : null,
      variants: (product.variants || []).map((v: any) => ({
        id: v.id,
        sku: v.sku,
        price: v.price,
        stock: v.stock,
        attributes: v.attributes,
        images: v.images,
        weight: v.weight,
      })),
      questions: (product.questions || []).map((q: any) => ({
        id: q.id,
        customerName: q.customerName,
        question: q.question,
        answer: q.answer,
        answeredAt: q.answeredAt ? q.answeredAt.toISOString() : null,
        helpfulVotes: q.helpfulVotes || 0,
        createdAt: q.createdAt.toISOString(),
      })),
      store: {
        id: st.id,
        name: st.name,
        slug: st.slug,
        logo: st.logo,
        banner: st.banner,
        category: st.category,
        location: locationStr,
        verified: Boolean(vp?.identityVerified || vp?.businessVerified),
        productCount: st._count?.products || 0,
        totalSales: st._count?.orderItems || 0,
        followersCount: st._count?.followers || 0,
        responseRate: 100,
        responseTime: "< 2 hours",
        createdAt: st.createdAt.toISOString(),
        joinedDate: (vp?.createdAt || st.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      },
      reviews: product.reviews.map((r: any) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        vendorReply: r.vendorReply || null,
        vendorRepliedAt: r.vendorRepliedAt ? r.vendorRepliedAt.toISOString() : null,
        helpfulVotes: r.helpfulVotes || 0,
        images: Array.isArray(r.images) ? (r.images as string[]) : [],
        isVerifiedPurchase: r.isVerifiedPurchase ?? true,
        customerName: r.customerProfile?.user ? `${r.customerProfile.user.firstName} ${r.customerProfile.user.lastName}` : "Verified Buyer",
        avatar: r.customerProfile?.user?.avatar || null,
        createdAt: r.createdAt.toISOString(),
      })),
      createdAt: product.createdAt.toISOString(),
    };
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<CategoryDTO[]> {
    const categories = await this.repo.findCategories();
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      productCount: c._count.products,
    }));
  }

  /**
   * Get list of active vendor stores
   */
  async getStores(filters?: any, userId?: string): Promise<StoreCatalogDTO[]> {
    const stores = await this.repo.findStores(filters, userId);
    
    let result = stores.map((s: any) => {
      const vp = s.vendorProfile;
      const city = s.city || vp?.city;
      const region = s.region || vp?.region;
      const country = s.country || vp?.country || "Ghana";
      const locationParts = [city, region, country].filter(Boolean);
      const locationStr = locationParts.length > 0 ? locationParts.join(", ") : "Accra, Ghana";

      let totalRatingSum = 0;
      let totalRatingCount = 0;
      if (Array.isArray(s.products)) {
        s.products.forEach((p: any) => {
          if (p.rating) {
            totalRatingSum += Number(p.rating);
            totalRatingCount += 1;
          }
        });
      }
      const averageRating = totalRatingCount > 0 ? Number((totalRatingSum / totalRatingCount).toFixed(1)) : 5.0;

      const categoryAssignments = Array.isArray(s.categories) ? s.categories : [];
      const categoriesList = categoryAssignments
        .map((ca: any) => ca.storeCategory)
        .filter(Boolean)
        .map((sc: any) => ({
          id: sc.id,
          name: sc.name,
          slug: sc.slug,
        }));
      const categorySlugsList = categoriesList.map((c: any) => c.slug);

      return {
        id: s.id,
        name: s.name,
        slug: s.slug,
        description: s.description,
        logo: s.logo,
        banner: s.banner,
        category: s.category || (categoriesList[0]?.name ?? "Electronics & Gadget"),
        categories: categoriesList,
        categorySlugs: categorySlugsList,
        businessType: s.businessType || "Indivual",
        city: city || null,
        region: region || null,
        country: country || "Ghana",
        location: locationStr,
        rating: averageRating,
        numReviews: totalRatingCount,
        productCount: s._count?.products || 0,
        followerCount: s._count?.followers || 0,
        verified: Boolean(vp?.identityVerified || vp?.businessVerified),
        isFollowing: Array.isArray(s.followers) && s.followers.length > 0,
        createdAt: s.createdAt.toISOString(),
      };
    });

    if (filters && typeof filters === "object" && filters.sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating || b.productCount - a.productCount);
    }

    return result;
  }

  /**
   * Get single store details with products & complete vendor information
   */
  async getStoreDetails(idOrSlug: string, userId?: string) {
    const store = await this.repo.findStoreByIdOrSlug(idOrSlug, userId);
    if (!store) {
      throw new Error("Store not found");
    }

    const vp = store.vendorProfile;
    const locationParts = [vp?.city, vp?.region, vp?.country].filter(Boolean);
    const locationStr = locationParts.length > 0 ? locationParts.join(", ") : "Accra, Ghana";

    const allReviews: any[] = [];
    let totalRatingsSum = 0;
    let totalRatingsCount = 0;

    store.products.forEach((p) => {
      if (p.reviews && p.reviews.length > 0) {
        p.reviews.forEach((r) => {
          totalRatingsSum += r.rating;
          totalRatingsCount += 1;
          allReviews.push({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            productName: p.name,
            customerName: `${r.customerProfile.user.firstName} ${r.customerProfile.user.lastName}`,
            avatar: r.customerProfile.user.avatar || null,
            createdAt: r.createdAt.toISOString(),
          });
        });
      }
    });

    const averageRating = totalRatingsCount > 0 ? Number((totalRatingsSum / totalRatingsCount).toFixed(1)) : 5.0;

    const assignedStorePolicy = (store as any).currentStorePolicy || (store as any).storePolicies?.find((p: any) => p.isDefault) || (store as any).storePolicies?.[0] || null;
    const assignedPrivacyPolicy = (store as any).currentPrivacyPolicy || (store as any).privacyPolicies?.find((p: any) => p.isDefault) || (store as any).privacyPolicies?.[0] || null;
    const activeShippingPolicy = (store as any).shippingPolicies?.find((p: any) => p.isDefault) || (store as any).shippingPolicies?.[0] || null;
    const activeRefundPolicy = (store as any).refundPolicies?.find((p: any) => p.isDefault) || (store as any).refundPolicies?.[0] || null;
    const activeReturnPolicy = (store as any).returnPolicies?.find((p: any) => p.isDefault) || (store as any).returnPolicies?.[0] || null;
    const activeWarrantyPolicy = (store as any).warrantyPolicies?.find((p: any) => p.isDefault) || (store as any).warrantyPolicies?.[0] || null;

    return {
      id: store.id,
      name: store.name,
      slug: store.slug,
      description: store.description || "Welcome to our store! We offer quality products and excellent customer service across Africa.",
      logo: store.logo,
      banner: store.banner,
      category: store.category,
      productCount: store._count.products,
      followerCount: store._count.followers,
      isFollowing: Array.isArray((store as any).followers) && (store as any).followers.length > 0,
      createdAt: store.createdAt.toISOString(),
      location: locationStr,
      verified: Boolean(vp?.identityVerified || vp?.businessVerified),
      contactEmail: store.email || store.supportEmail || vp?.user?.email || null,
      contactPhone: store.phone || store.supportPhone || vp?.user?.phone || null,
      supportEmail: store.supportEmail || store.email || vp?.user?.email || null,
      supportPhone: store.supportPhone || store.phone || vp?.user?.phone || null,
      businessAddress: store.address || vp?.businessAddress || null,
      businessName: vp?.businessName || store.name,
      businessType: store.businessType || vp?.businessType || null,
      registrationNumber: (vp as any)?.verification?.registrationNumber || null,
      taxId: (vp as any)?.verification?.taxId || null,
      website: store.website || null,
      businessHours: store.businessHours || null,
      city: store.city || vp?.city || null,
      region: store.region || vp?.region || null,
      country: store.country || vp?.country || null,
      assignedStorePolicy,
      currentStorePolicy: assignedStorePolicy,
      assignedPrivacyPolicy,
      currentPrivacyPolicy: assignedPrivacyPolicy,
      activeShippingPolicy,
      activeRefundPolicy,
      activeReturnPolicy,
      activeWarrantyPolicy,
      shippingPolicy: activeShippingPolicy ? `${activeShippingPolicy.name}: Processing time ${activeShippingPolicy.processingTime || "1-2 days"}. ${activeShippingPolicy.domesticShipping || ""}` : (store.shippingPolicy || null),
      returnPolicy: activeReturnPolicy ? `${activeReturnPolicy.name}: Return window is ${activeReturnPolicy.returnWindowDays || 30} days. ${activeReturnPolicy.policyDetails || ""}` : (store.returnPolicy || null),
      refundPolicy: activeRefundPolicy ? `${activeRefundPolicy.name}: Refund method is ${activeRefundPolicy.refundMethod || "Original Payment Method"}. ${activeRefundPolicy.conditions || ""}` : (store.refundPolicy || null),
      privacyPolicy: assignedPrivacyPolicy ? `${assignedPrivacyPolicy.name}: ${assignedPrivacyPolicy.introduction || ""} ${assignedPrivacyPolicy.infoCollected || ""}` : (store.privacyPolicy || null),
      termsConditions: assignedStorePolicy ? `${assignedStorePolicy.name}: ${assignedStorePolicy.description || ""} ${assignedStorePolicy.termsConditions || ""}` : (store.termsConditions || null),
      rating: averageRating,
      numReviews: totalRatingsCount,
      reviews: allReviews,
      products: store.products.map((p, index) => {
        const campaigns = extractCampaigns((p as any).campaignProducts || []);
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
          description: p.description,
          originalPrice: pricing.originalPrice,
          price: pricing.effectivePrice,
          campaignPrice: pricing.campaignPrice,
          isDiscounted: pricing.isDiscounted,
          amountSaved: pricing.amountSaved,
          discountPercent: pricing.discountPercent,
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
          isBestSeller,
          bestSellerScore: p.bestSellerScore || 0,
          bestSellerRank: isBestSeller ? index + 1 : null,
          images: Array.isArray(p.images) ? (p.images as string[]) : [],
          stock: p.stock,
          rating: p.rating,
          numReviews: p.numReviews,
          isFeatured: p.isFeatured,
          status: p.status,
          createdAt: p.createdAt.toISOString(),
        };
      }),
    };
  }

  async toggleFollowStore(storeId: string, userId: string) {
    const isFollowing = await catalogRepository.isFollowingStore(storeId, userId);
    if (isFollowing) {
      await catalogRepository.unfollowStore(storeId, userId);
      const followerCount = await catalogRepository.getStoreFollowerCount(storeId);
      return { isFollowing: false, followerCount };
    } else {
      await catalogRepository.followStore(storeId, userId);
      const followerCount = await catalogRepository.getStoreFollowerCount(storeId);
      return { isFollowing: true, followerCount };
    }
  }
}

export const catalogService = new CatalogService();
