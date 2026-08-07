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
    };

    if (query.query) {
      where.OR = [
        { name: { contains: query.query, mode: "insensitive" } },
        { description: { contains: query.query, mode: "insensitive" } },
        { categoryName: { contains: query.query, mode: "insensitive" } },
      ];
    }

    if (query.category) {
      where.categoryName = { equals: query.category, mode: "insensitive" };
    }

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

    let orderBy: any = { createdAt: "desc" };
    if (query.sortBy === "price_asc") orderBy = { price: "asc" };
    else if (query.sortBy === "price_desc") orderBy = { price: "desc" };
    else if (query.sortBy === "rating") orderBy = { rating: "desc" };
    else if (query.sortBy === "best_sellers") orderBy = { bestSellerScore: "desc" };

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

    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
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
   * Find all active categories
   */
  async findCategories() {
    return db.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });
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
      andConditions.push({
        category: { contains: category, mode: "insensitive" },
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
