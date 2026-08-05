import { db } from "@/lib/db";
import { GetProductsQueryInput } from "./dto";

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
   * Find stores catalog list
   */
  async findStores(search?: string, userId?: string) {
    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }
    return db.store.findMany({
      where,
      include: {
        _count: {
          select: {
            products: {
              where: { deletedAt: null, status: "ACTIVE" },
            },
            followers: true,
          },
        },
        followers: userId ? { where: { userId }, select: { id: true } } : false,
      },
      orderBy: { createdAt: "desc" },
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
