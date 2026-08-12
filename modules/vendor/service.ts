import { vendorRepository } from "./repository";
import { isBestSellerProduct } from "@/modules/catalog/best-seller-calculator";
import { domainEvents, EVENT_TOPICS } from "@/lib/events";
import {
  UpdateStoreInput,
  VendorProductInput,
  UpdateStockInput,
  VendorStoreDTO,
  VendorProductDTO,
} from "./dto";

// Low stock threshold
const LOW_STOCK_THRESHOLD = 10;

/**
 * Map raw Prisma product to VendorProductDTO (no raw model leaking)
 */
function toVendorProductDTO(product: any): VendorProductDTO {
  const soldCount = product.soldCount ?? 0;
  const isBestSeller = isBestSellerProduct({
    status: product.status,
    stock: product.stock,
    bestSellerScore: product.bestSellerScore,
    soldCount,
  });

  return {
    id: product.id,
    storeId: product.storeId,
    name: product.name,
    brand: product.brand ?? null,
    slug: product.slug,
    description: product.description ?? null,
    price: Number(product.price),
    categoryName: product.categoryName ?? null,
    images: product.images ?? [],
    stock: product.stock,
    weight: product.weight ? Number(product.weight) : null,
    dimensions: product.dimensions ?? null,
    specifications: product.specifications ?? null,
    variants: Array.isArray(product.variants)
      ? product.variants.map((v: any) => ({
          id: v.id,
          sku: v.sku,
          price: v.price ? Number(v.price) : Number(product.price),
          stock: v.stock !== undefined ? Number(v.stock) : product.stock,
          attributes: v.attributes || v.options || {},
          images: Array.isArray(v.images) ? v.images : [],
        }))
      : [],
    shippingPolicyIds: Array.isArray(product.shippingPolicies) ? product.shippingPolicies.map((sp: any) => sp.shippingPolicyId) : [],
    refundPolicyId: product.refundPolicyId ?? null,
    returnPolicyId: product.returnPolicyId ?? null,
    warrantyPolicyId: product.warrantyPolicyId ?? null,
    campaignIds: Array.isArray(product.campaignProducts) ? product.campaignProducts.map((cp: any) => cp.campaignId) : [],
    seoTitle: product.seoTitle ?? null,
    seoDescription: product.seoDescription ?? null,
    seoKeywords: product.seoKeywords ?? null,
    views: product.views ?? 0,
    rating: Number(product.rating ?? 0),
    numReviews: product.numReviews ?? 0,
    soldCount,
    unitsSold: soldCount,
    isBestSeller,
    bestSellerScore: product.bestSellerScore ?? 0,
    isFeatured: product.isFeatured ?? false,
    status: product.status,
    createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : product.createdAt,
    updatedAt: product.updatedAt instanceof Date ? product.updatedAt.toISOString() : product.updatedAt,
  };
}

/**
 * Helper to resolve allowed category names for a vendor store
 */
function getAuthorizedVendorCategoryNames(store: any): string[] {
  const categoryAssignments = Array.isArray(store.categories) ? store.categories : [];
  const assignedNames = categoryAssignments
    .map((ca: any) => ca.storeCategory?.name)
    .filter((name: any): name is string => typeof name === "string" && Boolean(name.trim()));

  if (assignedNames.length === 0 && store.category) {
    assignedNames.push(store.category);
  }
  return Array.from(new Set(assignedNames));
}

/**
 * Map raw Prisma store to VendorStoreDTO
 */
function toVendorStoreDTO(store: any): VendorStoreDTO {
  const categoryAssignments = Array.isArray(store.categories) ? store.categories : [];
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
    id: store.id,
    vendorProfileId: store.vendorProfileId,
    name: store.name,
    slug: store.slug,
    description: store.description ?? null,
    logo: store.logo ?? null,
    banner: store.banner ?? null,
    category: store.category || (categoriesList[0]?.name ?? "Electronics & Gadget"),
    categories: categoriesList,
    categorySlugs: categorySlugsList,
    businessType: store.businessType ?? "Indivual",
    email: store.email ?? null,
    phone: store.phone ?? null,
    website: store.website ?? null,
    address: store.address ?? null,
    city: store.city ?? null,
    region: store.region ?? null,
    country: store.country ?? "Ghana",
    postalCode: store.postalCode ?? null,
    shippingPolicy: store.shippingPolicy ?? null,
    returnPolicy: store.returnPolicy ?? null,
    refundPolicy: store.refundPolicy ?? null,
    privacyPolicy: store.privacyPolicy ?? null,
    termsConditions: store.termsConditions ?? null,
    supportEmail: store.supportEmail ?? null,
    supportPhone: store.supportPhone ?? null,
    businessHours: store.businessHours ?? null,
    socialLinks: store.socialLinks ?? null,
    seoTitle: store.seoTitle ?? null,
    metaDescription: store.metaDescription ?? null,
    metaKeywords: store.metaKeywords ?? null,
    ogImage: store.ogImage ?? null,
    isPublic: Boolean(store.isPublic ?? true),
    acceptingOrders: Boolean(store.acceptingOrders ?? true),
    vacationMode: Boolean(store.vacationMode ?? false),
    vacationMessage: store.vacationMessage ?? null,
    status: store.status,
    createdAt: store.createdAt instanceof Date ? store.createdAt.toISOString() : store.createdAt,
    updatedAt: store.updatedAt instanceof Date ? store.updatedAt.toISOString() : store.updatedAt,
  };
}

export class VendorService {
  /**
   * Resolve vendor profile + store or throw a structured error
   */
  private async resolveVendorStore(userId: string) {
    const vendorProfile = await vendorRepository.findVendorProfileByUserId(userId);
    if (!vendorProfile) {
      throw { code: "VENDOR_NOT_FOUND", message: "Vendor profile not found", status: 404 };
    }

    const store = await vendorRepository.findStoreByVendorProfileId(vendorProfile.id);
    if (!store) {
      throw { code: "STORE_NOT_FOUND", message: "Vendor store not found", status: 404 };
    }

    return { vendorProfile, store };
  }

  /**
   * GET: vendor's own store details
   */
  async getVendorStore(userId: string): Promise<VendorStoreDTO> {
    const { store } = await this.resolveVendorStore(userId);
    return toVendorStoreDTO(store);
  }

  /**
   * PUT/PATCH: update vendor store profile
   */
  async updateVendorStore(userId: string, input: UpdateStoreInput): Promise<VendorStoreDTO> {
    const { vendorProfile, store } = await this.resolveVendorStore(userId);

    await vendorRepository.updateStore(store.id, vendorProfile.id, input);

    // Sync categories if categorySlugs or categories is provided
    const targetSlugs = input.categorySlugs || input.categories;
    if (Array.isArray(targetSlugs) && targetSlugs.length > 0) {
      await vendorRepository.updateStoreCategories(store.id, targetSlugs);
    }

    // Refetch to return fresh data
    const updatedStore = await vendorRepository.findStoreByVendorProfileId(vendorProfile.id);
    if (!updatedStore) {
      throw { code: "STORE_NOT_FOUND", message: "Store not found after update", status: 404 };
    }

    return toVendorStoreDTO(updatedStore);
  }

  /**
   * GET: all products owned by vendor's store
   */
  async getVendorProducts(userId: string): Promise<{ products: VendorProductDTO[]; storeCategories: { id: string; name: string; slug: string }[] }> {
    const { store } = await this.resolveVendorStore(userId);
    const products = await vendorRepository.findVendorProducts(store.id);
    
    const categoryAssignments = Array.isArray(store.categories) ? store.categories : [];
    const storeCategories = categoryAssignments
      .map((ca: any) => ca.storeCategory)
      .filter(Boolean)
      .map((sc: any) => ({
        id: sc.id,
        name: sc.name,
        slug: sc.slug,
      }));

    if (storeCategories.length === 0 && store.category) {
      storeCategories.push({
        id: store.category,
        name: store.category,
        slug: store.category.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
      });
    }

    return {
      products: products.map(toVendorProductDTO),
      storeCategories,
    };
  }

  /**
   * GET: single product by ID, with ownership check
   */
  async getVendorProductDetails(userId: string, productId: string): Promise<VendorProductDTO> {
    const { store } = await this.resolveVendorStore(userId);
    const product = await vendorRepository.findVendorProductById(productId, store.id);
    if (!product) {
      throw { code: "PRODUCT_NOT_FOUND", message: "Product not found", status: 404 };
    }
    return toVendorProductDTO(product);
  }

  /**
   * POST: create a new product under vendor's store
   */
  async createVendorProduct(userId: string, input: VendorProductInput): Promise<VendorProductDTO> {
    const { store } = await this.resolveVendorStore(userId);

    // Backend Business Rule: Vendor cannot operate or create products if store is not approved ACTIVE
    if (store.status !== "ACTIVE") {
      throw {
        code: "STORE_NOT_ACTIVE",
        message: `Your store is currently ${store.status || "PENDING_APPROVAL"}. Products can only be created once your store application is approved by an administrator.`,
        status: 403,
      };
    }

    const authorizedCategories = getAuthorizedVendorCategoryNames(store);

    if (authorizedCategories.length === 1) {
      input.categoryName = authorizedCategories[0];
    } else if (authorizedCategories.length > 1) {
      if (!input.categoryName || !authorizedCategories.includes(input.categoryName)) {
        throw {
          code: "UNAUTHORIZED_CATEGORY",
          message: `Category "${input.categoryName || "none"}" is not authorized for your store. Allowed categories: ${authorizedCategories.join(", ")}`,
          status: 403,
        };
      }
    } else if (input.categoryName && authorizedCategories.length > 0 && !authorizedCategories.includes(input.categoryName)) {
      throw {
        code: "UNAUTHORIZED_CATEGORY",
        message: `Category "${input.categoryName}" is not authorized for your store.`,
        status: 403,
      };
    }

    const product = await vendorRepository.createVendorProduct(store.id, input);

    if (input.shippingPolicyIds && input.shippingPolicyIds.length > 0) {
      await vendorRepository.setProductShippingPolicies(product.id, input.shippingPolicyIds);
    }

    domainEvents.emit(EVENT_TOPICS.PRODUCT_CREATED, { productId: product.id, storeId: store.id });

    if (product.stock <= LOW_STOCK_THRESHOLD) {
      domainEvents.emit(EVENT_TOPICS.STOCK_LOW, { productId: product.id, stock: product.stock });
    }

    return toVendorProductDTO(product);
  }

  /**
   * PUT/PATCH: update an existing vendor product
   */
  async updateVendorProduct(
    userId: string,
    productId: string,
    input: Partial<VendorProductInput>
  ): Promise<VendorProductDTO> {
    const { store } = await this.resolveVendorStore(userId);

    // Backend Business Rule: Vendor cannot operate or update products if store is not ACTIVE
    if (store.status !== "ACTIVE") {
      throw {
        code: "STORE_NOT_ACTIVE",
        message: `Your store is currently ${store.status || "PENDING_APPROVAL"}. Products can only be updated once your store application is approved by an administrator.`,
        status: 403,
      };
    }

    const existing = await vendorRepository.findVendorProductById(productId, store.id);
    if (!existing) {
      throw { code: "PRODUCT_NOT_FOUND", message: "Product not found", status: 404 };
    }

    if (input.categoryName !== undefined) {
      const authorizedCategories = getAuthorizedVendorCategoryNames(store);
      if (authorizedCategories.length === 1) {
        input.categoryName = authorizedCategories[0];
      } else if (authorizedCategories.length > 1 && !authorizedCategories.includes(input.categoryName)) {
        throw {
          code: "UNAUTHORIZED_CATEGORY",
          message: `Category "${input.categoryName}" is not authorized for your store. Allowed categories: ${authorizedCategories.join(", ")}`,
          status: 403,
        };
      }
    }

    await vendorRepository.updateVendorProduct(productId, store.id, input);

    if (input.shippingPolicyIds !== undefined) {
      await vendorRepository.setProductShippingPolicies(productId, input.shippingPolicyIds);
    }

    domainEvents.emit(EVENT_TOPICS.PRODUCT_UPDATED, { productId, storeId: store.id });

    if (input.stock !== undefined && input.stock <= LOW_STOCK_THRESHOLD) {
      domainEvents.emit(EVENT_TOPICS.STOCK_LOW, { productId, stock: input.stock });
    }

    const updated = await vendorRepository.findVendorProductById(productId, store.id);
    return toVendorProductDTO(updated!);
  }

  /**
   * DELETE: soft delete vendor product with ownership check
   */
  async deleteVendorProduct(userId: string, productId: string): Promise<void> {
    const { store } = await this.resolveVendorStore(userId);

    const existing = await vendorRepository.findVendorProductById(productId, store.id);
    if (!existing) {
      throw { code: "PRODUCT_NOT_FOUND", message: "Product not found", status: 404 };
    }

    await vendorRepository.softDeleteVendorProduct(productId, store.id);
  }

  /**
   * GET: inventory view (products + stock info)
   */
  async getVendorInventory(userId: string): Promise<VendorProductDTO[]> {
    const res = await this.getVendorProducts(userId);
    return res.products;
  }

  /**
   * PATCH: update stock for a specific product
   */
  async updateStock(userId: string, input: UpdateStockInput): Promise<VendorProductDTO> {
    const { store } = await this.resolveVendorStore(userId);

    const existing = await vendorRepository.findVendorProductById(input.productId, store.id);
    if (!existing) {
      throw { code: "PRODUCT_NOT_FOUND", message: "Product not found", status: 404 };
    }

    await vendorRepository.updateStock(input.productId, store.id, input.stock);

    domainEvents.emit(EVENT_TOPICS.PRODUCT_UPDATED, {
      productId: input.productId,
      storeId: store.id,
    });

    if (input.stock <= LOW_STOCK_THRESHOLD) {
      domainEvents.emit(EVENT_TOPICS.STOCK_LOW, { productId: input.productId, stock: input.stock });
    }

    const updated = await vendorRepository.findVendorProductById(input.productId, store.id);
    return toVendorProductDTO(updated!);
  }
}

export const vendorService = new VendorService();
