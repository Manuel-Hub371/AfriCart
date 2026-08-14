import { db } from "@/lib/db";
import { GetProductsQueryInput } from "./dto";

export interface FindStoresFilter {
  search?: string;
  category?: string;
  location?: string;
  businessType?: string;
  sortBy?: "rating" | "products" | "newest" | "name";
  userId?: string;
}

export class CatalogRepository {
  /**
   * Find paginated & filtered active products
   */
  async findProducts(query: GetProductsQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 12;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
      status: "ACTIVE",
      store: {
        status: "ACTIVE",
        deletedAt: null,
      },
    };

    // 1. Search Query
    if (query.query) {
      const q = query.query.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
        { categoryName: { contains: q, mode: "insensitive" } },
      ];
    }

    // 2. Category Filtering (Multi-category & slug/name mapping)
    const rawCategories: string[] = [];
    if (Array.isArray(query.categories) && query.categories.length > 0) {
      rawCategories.push(...query.categories);
    } else if (Array.isArray(query.category)) {
      rawCategories.push(...query.category);
    } else if (typeof query.category === "string" && query.category.trim()) {
      rawCategories.push(query.category.trim());
    }

    if (rawCategories.length > 0) {
      const categorySlugToName: Record<string, string> = {
        "electronics-gadget": "Electronics & Gadget",
        "home-living": "Home & Living",
        "fashion-appeal": "Fashion & Appeal",
        "beauty-personal-care": "Beauty & Personal Care",
        "food-gorrices": "Food & Gorrices",
        "pharmacy-health": "Pharmacy & Health",
        "automotive-automobile": "Automotive & Automobile",
        "sorts-fitness": "Sorts & Fitness",
        "books-stationery": "Books & Stationery",
      };

      const categoryConditions: any[] = [];
      rawCategories.forEach((catToken) => {
        const canonicalName = categorySlugToName[catToken.toLowerCase()] || catToken;
        categoryConditions.push(
          { categoryName: { equals: canonicalName, mode: "insensitive" } },
          { categoryName: { equals: catToken, mode: "insensitive" } },
          { category: { slug: { equals: catToken, mode: "insensitive" } } },
          { category: { name: { equals: canonicalName, mode: "insensitive" } } }
        );
      });

      where.AND = where.AND || [];
      where.AND.push({ OR: categoryConditions });
    }

    // 3. Rating Filtering
    if (query.rating !== undefined && query.rating > 0) {
      where.rating = { gte: query.rating };
    }

    // 4. Base Price Boundaries
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) where.price.gte = query.minPrice;
      if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
    }

    if (query.isFeatured !== undefined) {
      where.isFeatured = query.isFeatured === "true";
    }

    if (query.storeId) {
      where.storeId = query.storeId;
    }

    // 5. Sorting
    let orderBy: any = { createdAt: "desc" };
    if (query.sortBy === "price_asc") {
      orderBy = { price: "asc" };
    } else if (query.sortBy === "price_desc") {
      orderBy = { price: "desc" };
    } else if (query.sortBy === "rating") {
      orderBy = [{ rating: "desc" }, { numReviews: "desc" }, { createdAt: "desc" }];
    } else if (query.sortBy === "best_sellers") {
      orderBy = [{ bestSellerScore: "desc" }, { soldCount: "desc" }, { createdAt: "desc" }];
    } else if (query.sortBy === "relevance" && query.query) {
      orderBy = [{ views: "desc" }, { createdAt: "desc" }];
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
          category: true,
          campaignProducts: {
            include: { campaign: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    return { products, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }

  /**
   * Find all active categories with product counts
   */
  async findCategories() {
    const OFFICIAL_CATEGORIES = [
      { name: "Electronics & Gadget", slug: "electronics-gadget", description: "Consumer electronics, smartphones, accessories, computing, and home entertainment." },
      { name: "Home & Living", slug: "home-living", description: "Furniture, home decor, kitchenware, bedding, lighting, and home improvement." },
      { name: "Fashion & Appeal", slug: "fashion-appeal", description: "Clothing, footwear, jewelry, watches, bags, and fashion accessories." },
      { name: "Beauty & Personal Care", slug: "beauty-personal-care", description: "Cosmetics, skincare, haircare, fragrances, and personal grooming products." },
      { name: "Food & Gorrices", slug: "food-gorrices", description: "Fresh produce, packaged foods, beverages, snacks, and daily household essentials." },
      { name: "Pharmacy & Health", slug: "pharmacy-health", description: "Over-the-counter health products, vitamins, supplements, and medical wellness supplies." },
      { name: "Automotive & Automobile", slug: "automotive-automobile", description: "Vehicle parts, auto accessories, car care, tools, and automotive electronics." },
      { name: "Sorts & Fitness", slug: "sorts-fitness", description: "Sports gear, outdoor equipment, athletic wear, fitness instruments, and activewear." },
      { name: "Books & Stationery", slug: "books-stationery", description: "Educational books, literature, office supplies, art materials, and stationery items." },
    ];

    const counts = await Promise.all(
      OFFICIAL_CATEGORIES.map(async (cat) => {
        const count = await db.product.count({
          where: {
            deletedAt: null,
            status: "ACTIVE",
            store: { status: "ACTIVE", deletedAt: null },
            OR: [
              { categoryName: { equals: cat.name, mode: "insensitive" } },
              { categoryName: { equals: cat.slug, mode: "insensitive" } },
              { category: { slug: { equals: cat.slug, mode: "insensitive" } } },
            ],
          },
        });
        return {
          id: cat.slug,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: null,
          _count: { products: count },
        };
      })
    );

    return counts;
  }

  /**
   * Find a single product by ID or Slug with full store details & reviews
   */
  async findProductByIdOrSlug(idOrSlug: string) {
    const product = await db.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        deletedAt: null,
      },
      include: {
        category: true,
        variants: true,
        campaignProducts: {
          include: { campaign: true },
        },
        shippingPolicies: {
          include: {
            shippingPolicy: true,
          },
        },
        refundPolicy: true,
        returnPolicy: true,
        warrantyPolicy: true,
        questions: {
          orderBy: { createdAt: "desc" },
        },
        store: {
          include: {
            vendorProfile: {
              select: {
                city: true,
                region: true,
                country: true,
                identityVerified: true,
                businessVerified: true,
                createdAt: true,
              },
            },
            _count: {
              select: { products: true, orderItems: true, followers: true },
            },
          },
        },
        reviews: {
          include: {
            customerProfile: {
              include: {
                user: { select: { firstName: true, lastName: true, avatar: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (product) {
      db.product.update({
        where: { id: product.id },
        data: { views: { increment: 1 } },
      }).catch(() => {});
    }

    return product;
  }



  /**
   * Find stores catalog list with multi-attribute filtering (Category, Location, Business Type)
   */
  async findStores(filters?: FindStoresFilter | string, userId?: string) {
    const opts: FindStoresFilter = typeof filters === "string" ? { search: filters, userId } : (filters || {});
    const search = opts.search?.trim();
    const category = opts.category?.trim();
    const location = opts.location?.trim();
    const businessType = opts.businessType?.trim();
    const currentUserId = opts.userId || userId;

    const where: any = { deletedAt: null, isPublic: true, status: "ACTIVE" };
    const andConditions: any[] = [];

    if (search) {
      andConditions.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } },
          { businessType: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { region: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (category && category.toLowerCase() !== "all") {
      const catTokens = category.split(",").map((c) => c.trim()).filter(Boolean);
      andConditions.push({
        OR: [
          {
            categories: {
              some: {
                storeCategory: {
                  slug: { in: catTokens },
                },
              },
            },
          },
          {
            categories: {
              some: {
                storeCategory: {
                  name: { in: catTokens, mode: "insensitive" },
                },
              },
            },
          },
          {
            category: { contains: category, mode: "insensitive" },
          },
        ],
      });
    }

    if (location && location.toLowerCase() !== "all") {
      andConditions.push({
        OR: [
          { city: { contains: location, mode: "insensitive" } },
          { region: { contains: location, mode: "insensitive" } },
          { country: { contains: location, mode: "insensitive" } },
          { address: { contains: location, mode: "insensitive" } },
        ],
      });
    }

    if (businessType && businessType.toLowerCase() !== "all") {
      andConditions.push({
        businessType: { contains: businessType, mode: "insensitive" },
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    let orderBy: any = { createdAt: "desc" };
    if (opts.sortBy === "name") {
      orderBy = { name: "asc" };
    } else if (opts.sortBy === "products") {
      orderBy = { products: { _count: "desc" } };
    }

    return db.store.findMany({
      where,
      include: {
        categories: {
          include: {
            storeCategory: true,
          },
        },
        vendorProfile: {
          select: {
            identityVerified: true,
            businessVerified: true,
            city: true,
            region: true,
            country: true,
          },
        },
        products: {
          where: { deletedAt: null, status: "ACTIVE" },
          select: {
            id: true,
            rating: true,
            numReviews: true,
          },
        },
        _count: {
          select: {
            products: {
              where: { deletedAt: null, status: "ACTIVE" },
            },
            followers: true,
          },
        },
        followers: currentUserId ? { where: { userId: currentUserId }, select: { id: true } } : false,
      },
      orderBy,
    });
  }

  /**
   * Find single store by ID or slug
   */
  async findStoreByIdOrSlug(idOrSlug: string, userId?: string) {
    return db.store.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        deletedAt: null,
      },
      include: {
        vendorProfile: {
          include: {
            user: {
              select: { email: true, phone: true },
            },
          },
        },
        products: {
          where: { deletedAt: null, status: "ACTIVE" },
          include: {
            campaignProducts: {
              include: { campaign: true },
            },
            reviews: {
              include: {
                customerProfile: {
                  include: {
                    user: { select: { firstName: true, lastName: true, avatar: true } },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        currentStorePolicy: true,
        currentPrivacyPolicy: true,
        storePolicies: { orderBy: { updatedAt: "desc" } },
        privacyPolicies: { orderBy: { updatedAt: "desc" } },
        shippingPolicies: { orderBy: { updatedAt: "desc" } },
        refundPolicies: { orderBy: { updatedAt: "desc" } },
        returnPolicies: { orderBy: { updatedAt: "desc" } },
        warrantyPolicies: { orderBy: { updatedAt: "desc" } },
        followers: userId ? { where: { userId }, select: { id: true } } : false,
        _count: {
          select: {
            products: {
              where: { deletedAt: null, status: "ACTIVE" },
            },
            followers: true,
          },
        },
      },
    });
  }

  /**
   * Store Follow System
   */
  async followStore(storeId: string, userId: string) {
    return db.storeFollow.upsert({
      where: {
        storeId_userId: { storeId, userId },
      },
      create: { storeId, userId },
      update: {},
    });
  }

  async unfollowStore(storeId: string, userId: string) {
    return db.storeFollow.deleteMany({
      where: { storeId, userId },
    });
  }

  async isFollowingStore(storeId: string, userId: string) {
    const follow = await db.storeFollow.findUnique({
      where: { storeId_userId: { storeId, userId } },
    });
    return Boolean(follow);
  }

  async getStoreFollowerCount(storeId: string) {
    return db.storeFollow.count({ where: { storeId } });
  }

  async getStoreProductCount(storeId: string) {
    return db.product.count({
      where: { storeId, deletedAt: null, status: "ACTIVE" },
    });
  }
}

export const catalogRepository = new CatalogRepository();
