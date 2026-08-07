// Query validation schema for catalog products
export interface GetProductsQueryInput {
  query?: string;
  category?: string;
  storeId?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  isFeatured?: "true" | "false";
  sortBy?: "newest" | "price_asc" | "price_desc" | "rating" | "best_sellers";
  page?: number;
  limit?: number;
}

export const GetProductsQuerySchema = {
  safeParse: (data: Record<string, any>) => {
    try {
      const page = data.page ? parseInt(data.page, 10) : 1;
      const limit = data.limit ? parseInt(data.limit, 10) : 12;
      const minPrice = data.minPrice ? parseFloat(data.minPrice) : undefined;
      const maxPrice = data.maxPrice ? parseFloat(data.maxPrice) : undefined;
      const rating = data.rating ? parseFloat(data.rating) : undefined;

      const parsed: GetProductsQueryInput = {
        query: data.query || undefined,
        category: data.category || undefined,
        storeId: data.storeId || undefined,
        minPrice: isNaN(minPrice!) ? undefined : minPrice,
        maxPrice: isNaN(maxPrice!) ? undefined : maxPrice,
        rating: isNaN(rating!) ? undefined : rating,
        isFeatured: data.isFeatured === "true" || data.isFeatured === "false" ? data.isFeatured : undefined,
        sortBy: ["newest", "price_asc", "price_desc", "rating", "best_sellers"].includes(data.sortBy) ? data.sortBy : "newest",
        page: isNaN(page) || page < 1 ? 1 : page,
        limit: isNaN(limit) || limit < 1 ? 12 : Math.min(limit, 100),
      };

      return { success: true as const, data: parsed };
    } catch (err: any) {
      return { 
        success: false as const, 
        error: { flatten: () => ({ fieldErrors: { _errors: [err.message || "Invalid input"] } }) } 
      };
    }
  }
};

// Response DTO Contracts — Part 10 Full API Compliance
export interface ProductDTO {
  id: string;
  name: string;
  brand?: string | null;
  slug: string;
  description: string | null;

  /** Base price stored in the database */
  originalPrice: number;
  /** Effective selling price after campaign discount */
  price: number;
  /** Discounted effective campaign price or null */
  campaignPrice: number | null;
  /** Legacy compareAtPrice field */
  compareAtPrice: number | null;

  // Campaign pricing fields — Part 10
  campaign: any | null;
  campaignId: string | null;
  campaignName: string | null;
  campaignType: string | null;
  campaignStatus: string;
  discountType: string | null;
  discountValue: number | null;
  campaignBadge: string | null;
  campaignColor: string | null;
  campaignEndDate: string | null;
  isDiscounted: boolean;
  amountSaved: number;
  discountPercent: number;

  // Best Seller & System fields — Part 7, 8, 10
  isBestSeller: boolean;
  bestSellerScore: number;
  bestSellerRank: number | null;
  unitsSold: number;
  salesVelocity?: number;
  averageRating: number;
  reviewCount: number;

  category: string | null;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  soldCount: number;
  isFeatured: boolean;
  status: string;

  /** Full active campaigns list for legacy callers */
  campaigns?: any[];

  store: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
  };
  createdAt: string;
}

export interface PaginatedProductsResponseDTO {
  products: ProductDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  productCount?: number;
}

export interface StoreCatalogDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  category: string;
  businessType: string;
  city: string | null;
  region: string | null;
  country: string | null;
  location: string;
  rating: number;
  numReviews: number;
  productCount: number;
  followerCount: number;
  verified: boolean;
  isFollowing?: boolean;
  createdAt: string;
}
