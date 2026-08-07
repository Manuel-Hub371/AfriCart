// DTOs and Validation Parsers for Vendor Management Module (Store & Vendor Products)

// Store DTOs
export interface UpdateStoreInput {
  name?: string;
  slug?: string;
  description?: string;
  category?: string;
  businessType?: string;
  logo?: string;
  banner?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  shippingPolicy?: string;
  returnPolicy?: string;
  refundPolicy?: string;
  privacyPolicy?: string;
  termsConditions?: string;
  supportEmail?: string;
  supportPhone?: string;
  businessHours?: string;
  socialLinks?: Record<string, string>;
  seoTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;
  isPublic?: boolean;
  acceptingOrders?: boolean;
  vacationMode?: boolean;
  vacationMessage?: string;
  status?: string;
}

export interface VendorStoreDTO {
  id: string;
  vendorProfileId: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  category: string;
  businessType: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  postalCode: string | null;
  shippingPolicy: string | null;
  returnPolicy: string | null;
  refundPolicy: string | null;
  privacyPolicy: string | null;
  termsConditions: string | null;
  supportEmail: string | null;
  supportPhone: string | null;
  businessHours: string | null;
  socialLinks: Record<string, string> | null;
  seoTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  ogImage: string | null;
  isPublic: boolean;
  acceptingOrders: boolean;
  vacationMode: boolean;
  vacationMessage: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Vendor Product DTOs
export interface VendorProductInput {
  name: string;
  brand?: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  categoryName?: string;
  images?: string[];
  stock: number;
  weight?: number;
  dimensions?: any;
  specifications?: Record<string, any>;
  variants?: any[];
  shippingPolicyIds?: string[];
  refundPolicyId?: string | null;
  returnPolicyId?: string | null;
  warrantyPolicyId?: string | null;
  campaignIds?: string[];
  isFeatured?: boolean;
  status?: "ACTIVE" | "DRAFT" | "OUT_OF_STOCK";
}

export interface UpdateStockInput {
  productId: string;
  stock: number;
}

export interface VendorProductDTO {
  id: string;
  storeId: string;
  name: string;
  brand: string | null;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  categoryName: string | null;
  images: string[];
  stock: number;
  weight: number | null;
  specifications?: Record<string, any> | null;
  variants?: any[];
  shippingPolicyIds?: string[];
  refundPolicyId?: string | null;
  returnPolicyId?: string | null;
  warrantyPolicyId?: string | null;
  campaignIds?: string[];
  views: number;
  rating: number;
  numReviews: number;
  soldCount: number;
  unitsSold: number;
  isBestSeller: boolean;
  bestSellerScore: number;
  isFeatured: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Parsers
export const UpdateStoreSchema = {
  safeParse: (data: any) => {
    if (!data || typeof data !== "object") {
      return { success: false as const, error: "Invalid payload" };
    }
    return {
      success: true as const,
      data: {
        ...(data.name !== undefined && { name: String(data.name).trim() }),
        ...(data.slug !== undefined && { slug: String(data.slug).trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-") }),
        ...(data.description !== undefined && { description: String(data.description).trim() }),
        ...(data.category !== undefined && { category: String(data.category).trim() }),
        ...(data.logo !== undefined && { logo: String(data.logo).trim() }),
        ...(data.banner !== undefined && { banner: String(data.banner).trim() }),
        ...(data.email !== undefined && { email: String(data.email).trim() }),
        ...(data.phone !== undefined && { phone: String(data.phone).trim() }),
        ...(data.website !== undefined && { website: String(data.website).trim() }),
        ...(data.address !== undefined && { address: String(data.address).trim() }),
        ...(data.city !== undefined && { city: String(data.city).trim() }),
        ...(data.region !== undefined && { region: String(data.region).trim() }),
        ...(data.country !== undefined && { country: String(data.country).trim() }),
        ...(data.postalCode !== undefined && { postalCode: String(data.postalCode).trim() }),
        ...(data.shippingPolicy !== undefined && { shippingPolicy: String(data.shippingPolicy).trim() }),
        ...(data.returnPolicy !== undefined && { returnPolicy: String(data.returnPolicy).trim() }),
        ...(data.refundPolicy !== undefined && { refundPolicy: String(data.refundPolicy).trim() }),
        ...(data.privacyPolicy !== undefined && { privacyPolicy: String(data.privacyPolicy).trim() }),
        ...(data.termsConditions !== undefined && { termsConditions: String(data.termsConditions).trim() }),
        ...(data.supportEmail !== undefined && { supportEmail: String(data.supportEmail).trim() }),
        ...(data.supportPhone !== undefined && { supportPhone: String(data.supportPhone).trim() }),
        ...(data.businessHours !== undefined && { businessHours: String(data.businessHours).trim() }),
        ...(data.socialLinks !== undefined && { socialLinks: data.socialLinks }),
        ...(data.seoTitle !== undefined && { seoTitle: String(data.seoTitle).trim() }),
        ...(data.metaDescription !== undefined && { metaDescription: String(data.metaDescription).trim() }),
        ...(data.metaKeywords !== undefined && { metaKeywords: String(data.metaKeywords).trim() }),
        ...(data.ogImage !== undefined && { ogImage: String(data.ogImage).trim() }),
        ...(data.isPublic !== undefined && { isPublic: Boolean(data.isPublic) }),
        ...(data.acceptingOrders !== undefined && { acceptingOrders: Boolean(data.acceptingOrders) }),
        ...(data.vacationMode !== undefined && { vacationMode: Boolean(data.vacationMode) }),
        ...(data.vacationMessage !== undefined && { vacationMessage: String(data.vacationMessage).trim() }),
        ...(data.status !== undefined && { status: String(data.status).trim() }),
      } as UpdateStoreInput,
    };
  },
};

export const VendorProductSchema = {
  safeParse: (data: any) => {
    if (!data || !data.name || typeof data.name !== "string" || !data.name.trim()) {
      return { success: false as const, error: "Product name is required" };
    }
    const price = parseFloat(data.price);
    if (isNaN(price) || price < 0) {
      return { success: false as const, error: "Valid non-negative price is required" };
    }
    const stock = data.stock !== undefined ? parseInt(data.stock, 10) : 0;
    const compareAtPrice = data.compareAtPrice ? parseFloat(data.compareAtPrice) : undefined;
    const weight = data.weight !== undefined ? parseFloat(data.weight) : undefined;

    return {
      success: true as const,
      data: {
        name: data.name.trim(),
        brand: data.brand ? String(data.brand).trim() : undefined,
        description: data.description ? String(data.description).trim() : undefined,
        price,
        compareAtPrice: isNaN(compareAtPrice!) ? undefined : compareAtPrice,
        categoryName: data.categoryName ? String(data.categoryName).trim() : undefined,
        images: Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []),
        stock: isNaN(stock) || stock < 0 ? 0 : stock,
        weight: isNaN(weight!) ? undefined : weight,
        dimensions: data.dimensions ?? undefined,
        specifications: typeof data.specifications === "object" ? data.specifications : undefined,
        variants: Array.isArray(data.variants) ? data.variants : undefined,
        shippingPolicyIds: Array.isArray(data.shippingPolicyIds) ? data.shippingPolicyIds : [],
        refundPolicyId: data.refundPolicyId ? String(data.refundPolicyId) : null,
        returnPolicyId: data.returnPolicyId ? String(data.returnPolicyId) : null,
        warrantyPolicyId: data.warrantyPolicyId ? String(data.warrantyPolicyId) : null,
        campaignIds: Array.isArray(data.campaignIds) ? data.campaignIds : [],
        isFeatured: Boolean(data.isFeatured),
        status: ["ACTIVE", "DRAFT", "OUT_OF_STOCK"].includes(data.status) ? data.status : "ACTIVE",
      } as VendorProductInput,
    };
  },
};

export const UpdateStockSchema = {
  safeParse: (data: any) => {
    if (!data || !data.productId) {
      return { success: false as const, error: "productId is required" };
    }
    const stock = parseInt(data.stock, 10);
    if (isNaN(stock) || stock < 0) {
      return { success: false as const, error: "Valid stock quantity is required" };
    }
    return {
      success: true as const,
      data: {
        productId: String(data.productId),
        stock,
      } as UpdateStockInput,
    };
  },
};
