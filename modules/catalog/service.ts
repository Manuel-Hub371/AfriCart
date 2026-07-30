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
   * Get paginated & filtered products catalog
   */
  async getProducts(query: GetProductsQueryInput): Promise<PaginatedProductsResponseDTO> {
    const data = await this.repo.findProducts(query);

    const formattedProducts: ProductDTO[] = data.products.map((p) => {
      const campaigns = extractCampaigns((p as any).campaignProducts || []);
      const pricing = resolveCampaignPricing(p.price, campaigns);

      return {
        id: p.id,
        name: p.name,
        brand: p.brand || null,
        slug: p.slug,
        description: p.description,

        // Pricing — always from backend, never computed on frontend
        originalPrice: pricing.originalPrice,
        price: pricing.effectivePrice,
        compareAtPrice: pricing.isDiscounted ? pricing.originalPrice : null,

        isDiscounted: pricing.isDiscounted,
        amountSaved: pricing.amountSaved,
        discountPercent: pricing.discountPercent,
        campaignId: pricing.campaignId,
        campaignName: pricing.campaignName,
        campaignType: pricing.campaignType,
        discountType: pricing.discountType,
        discountValue: pricing.discountValue,
        campaignBadge: pricing.campaignBadge,
        campaignColor: pricing.campaignColor,
        campaignEndDate: pricing.campaignEndDate,

        category: p.categoryName,
        images: Array.isArray(p.images) ? (p.images as string[]) : [],
        stock: p.stock,
        rating: p.rating,
        numReviews: p.numReviews,
        isFeatured: p.isFeatured,
        isBestSeller: isBestSellerProduct(p),
        bestSellerScore: p.bestSellerScore || 0,
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

    return {
      products: formattedProducts,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages,
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

    // Auto-generate badges if not explicitly set
    let badgesList: string[] = Array.isArray(product.badges) ? (product.badges as string[]) : [];
    if (badgesList.length === 0) {
      if (product.isFeatured) badgesList.push("FEATURED");
      if (product.stock <= 5 && product.stock > 0) badgesList.push("LIMITED_STOCK");
      if (isBestSellerProduct(product)) badgesList.push("BEST_SELLER");
      if (product.views > 50) badgesList.push("TRENDING");
      if (product.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) badgesList.push("NEW_ARRIVAL");
    }

    // Campaign pricing — single source of truth
    const campaigns = extractCampaigns((product as any).campaignProducts || []);
    const pricing = resolveCampaignPricing(product.price, campaigns);

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      brand: product.brand || null,

      // Pricing
      originalPrice: pricing.originalPrice,
      price: pricing.effectivePrice,
      compareAtPrice: pricing.isDiscounted ? pricing.originalPrice : (product.compareAtPrice || null),

      isDiscounted: pricing.isDiscounted,
      amountSaved: pricing.amountSaved,
      discountPercent: pricing.discountPercent,
      campaignId: pricing.campaignId,
      campaignName: pricing.campaignName,
      campaignType: pricing.campaignType,
      discountType: pricing.discountType,
      discountValue: pricing.discountValue,
      campaignBadge: pricing.campaignBadge,
      campaignColor: pricing.campaignColor,
      campaignEndDate: pricing.campaignEndDate,

      campaigns,
      category: product.categoryName || st?.category || "General",
      subcategoryName: product.subcategoryName || null,
      images: Array.isArray(product.images) ? (product.images as string[]) : [],
      stock: product.stock,
      views: product.views,
      rating: product.rating,
      numReviews: product.numReviews,
      soldCount: product.soldCount || 0,
      isFeatured: product.isFeatured,
      isBestSeller: isBestSellerProduct(product),
      bestSellerScore: product.bestSellerScore || 0,
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
        compareAtPrice: v.compareAtPrice,
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
  async getStores(query?: string, userId?: string): Promise<StoreCatalogDTO[]> {
    const stores = await this.repo.findStores(query, userId);
    return stores.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      description: s.description,
      logo: s.logo,
      banner: s.banner,
      category: s.category,
      productCount: s._count.products,
      followerCount: s._count.followers,
      isFollowing: Array.isArray((s as any).followers) && (s as any).followers.length > 0,
      createdAt: s.createdAt.toISOString(),
    }));
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

    // Collect all reviews across products
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
      businessAddress: store.address || vp?.businessAddress || null,
      businessName: vp?.businessName || store.name,
      shippingPolicy: store.shippingPolicy || null,
      returnPolicy: store.returnPolicy || null,
      refundPolicy: store.refundPolicy || null,
      privacyPolicy: store.privacyPolicy || null,
      termsConditions: store.termsConditions || null,
      assignedStorePolicy: (store as any).currentStorePolicy ? {
        id: (store as any).currentStorePolicy.id,
        name: (store as any).currentStorePolicy.name,
        description: (store as any).currentStorePolicy.description || null,
        termsConditions: (store as any).currentStorePolicy.termsConditions || null,
        customerResponsibilities: (store as any).currentStorePolicy.customerResponsibilities || null,
        sellerResponsibilities: (store as any).currentStorePolicy.sellerResponsibilities || null,
        orderAcceptanceRules: (store as any).currentStorePolicy.orderAcceptanceRules || null,
        productRestrictions: (store as any).currentStorePolicy.productRestrictions || null,
        cancellationRules: (store as any).currentStorePolicy.cancellationRules || null,
        disputeResolution: (store as any).currentStorePolicy.disputeResolution || null,
        effectiveDate: (store as any).currentStorePolicy.effectiveDate || null,
      } : null,
      assignedPrivacyPolicy: (store as any).currentPrivacyPolicy ? {
        id: (store as any).currentPrivacyPolicy.id,
        name: (store as any).currentPrivacyPolicy.name,
        introduction: (store as any).currentPrivacyPolicy.introduction || null,
        infoCollected: (store as any).currentPrivacyPolicy.infoCollected || null,
        howInfoUsed: (store as any).currentPrivacyPolicy.howInfoUsed || null,
        cookiesPolicy: (store as any).currentPrivacyPolicy.cookiesPolicy || null,
        thirdPartyServices: (store as any).currentPrivacyPolicy.thirdPartyServices || null,
        dataSharing: (store as any).currentPrivacyPolicy.dataSharing || null,
        dataRetention: (store as any).currentPrivacyPolicy.dataRetention || null,
        securityMeasures: (store as any).currentPrivacyPolicy.securityMeasures || null,
        customerRights: (store as any).currentPrivacyPolicy.customerRights || null,
        contactInfo: (store as any).currentPrivacyPolicy.contactInfo || null,
        effectiveDate: (store as any).currentPrivacyPolicy.effectiveDate || null,
      } : null,
      supportEmail: store.supportEmail || null,
      supportPhone: store.supportPhone || null,
      businessHours: store.businessHours || null,
      socialLinks: store.socialLinks || null,
      seoTitle: store.seoTitle || null,
      metaDescription: store.metaDescription || null,
      metaKeywords: store.metaKeywords || null,
      ogImage: store.ogImage || null,
      isPublic: Boolean(store.isPublic ?? true),
      acceptingOrders: Boolean(store.acceptingOrders ?? true),
      vacationMode: Boolean(store.vacationMode ?? false),
      vacationMessage: store.vacationMessage || null,
      status: store.status || "ACTIVE",
      rating: averageRating,
      numReviews: totalRatingsCount,
      reviews: allReviews,
      // Products with campaign-adjusted pricing
      products: store.products.map((p) => {
        const campaigns = extractCampaigns((p as any).campaignProducts || []);
        const pricing = resolveCampaignPricing(p.price, campaigns);
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          originalPrice: pricing.originalPrice,
          price: pricing.effectivePrice,
          compareAtPrice: pricing.isDiscounted ? pricing.originalPrice : p.compareAtPrice,
          isDiscounted: pricing.isDiscounted,
          amountSaved: pricing.amountSaved,
          discountPercent: pricing.discountPercent,
          campaignBadge: pricing.campaignBadge,
          campaignColor: pricing.campaignColor,
          campaignName: pricing.campaignName,
          category: p.categoryName || store.category,
          images: Array.isArray(p.images) ? (p.images as string[]) : [],
          stock: p.stock,
          rating: p.rating,
          numReviews: p.numReviews,
          isFeatured: p.isFeatured,
          isBestSeller: isBestSellerProduct(p),
          bestSellerScore: p.bestSellerScore || 0,
          status: p.status,
          campaigns,
          store: {
            id: store.id,
            name: store.name,
            slug: store.slug,
            logo: store.logo,
          },
          createdAt: p.createdAt.toISOString(),
        };
      }),
    };
  }

  /**
   * Follow / Unfollow Store
   */
  async toggleFollowStore(storeId: string, userId: string) {
    const isFollowing = await this.repo.isFollowingStore(storeId, userId);
    if (isFollowing) {
      await this.repo.unfollowStore(storeId, userId);
    } else {
      await this.repo.followStore(storeId, userId);
    }

    const followerCount = await this.repo.getStoreFollowerCount(storeId);
    return {
      isFollowing: !isFollowing,
      followerCount,
    };
  }
}

export const catalogService = new CatalogService();
