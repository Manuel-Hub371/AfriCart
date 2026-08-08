import { db } from "@/lib/db";
import { queueProductBestSellerRecalculation } from "@/modules/catalog/best-seller-calculator";
import { UpdateStoreInput, VendorProductInput } from "./dto";

export class VendorRepository {
  /**
   * Find vendor profile by user ID and verify VENDOR role ownership
   */
  async findVendorProfileByUserId(userId: string) {
    return db.vendorProfile.findUnique({
      where: { userId },
      include: {
        stores: {
          where: { deletedAt: null },
          take: 1,
        },
      },
    });
  }

  /**
   * Find store owned by vendor
   */
  async findStoreByVendorProfileId(vendorProfileId: string) {
    return db.store.findFirst({
      where: { vendorProfileId, deletedAt: null },
      include: {
        categories: {
          include: {
            storeCategory: true,
          },
        },
      },
    });
  }

  /**
   * Sync multi-category assignments for a store
   */
  async updateStoreCategories(storeId: string, categorySlugs: string[]) {
    // 1. Fetch matching StoreCategory IDs
    const categories = await db.storeCategory.findMany({
      where: {
        slug: { in: categorySlugs },
      },
      select: { id: true, name: true, slug: true },
    });

    if (categories.length === 0) return;

    // 2. Delete current assignments for store
    await db.storeCategoryAssignment.deleteMany({
      where: { storeId },
    });

    // 3. Create new assignments
    await db.storeCategoryAssignment.createMany({
      data: categories.map((c) => ({
        storeId,
        storeCategoryId: c.id,
      })),
      skipDuplicates: true,
    });

    // 4. Update legacy store.category field with primary category name for backward compatibility
    await db.store.update({
      where: { id: storeId },
      data: {
        category: categories[0].name,
      },
    });
  }

  /**
   * Update vendor store details
   */
  async updateStore(storeId: string, vendorProfileId: string, input: UpdateStoreInput) {
    return db.store.updateMany({
      where: { id: storeId, vendorProfileId, deletedAt: null },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.category !== undefined && { category: input.category }),
        ...(input.businessType !== undefined && { businessType: input.businessType }),
        ...(input.logo !== undefined && { logo: input.logo }),
        ...(input.banner !== undefined && { banner: input.banner }),
        ...(input.email !== undefined && { email: input.email }),
        ...(input.phone !== undefined && { phone: input.phone }),
        ...(input.website !== undefined && { website: input.website }),
        ...(input.address !== undefined && { address: input.address }),
        ...(input.city !== undefined && { city: input.city }),
        ...(input.region !== undefined && { region: input.region }),
        ...(input.country !== undefined && { country: input.country }),
        ...(input.postalCode !== undefined && { postalCode: input.postalCode }),
        ...(input.shippingPolicy !== undefined && { shippingPolicy: input.shippingPolicy }),
        ...(input.returnPolicy !== undefined && { returnPolicy: input.returnPolicy }),
        ...(input.refundPolicy !== undefined && { refundPolicy: input.refundPolicy }),
        ...(input.privacyPolicy !== undefined && { privacyPolicy: input.privacyPolicy }),
        ...(input.termsConditions !== undefined && { termsConditions: input.termsConditions }),
        ...(input.supportEmail !== undefined && { supportEmail: input.supportEmail }),
        ...(input.supportPhone !== undefined && { supportPhone: input.supportPhone }),
        ...(input.businessHours !== undefined && { businessHours: input.businessHours }),
        ...(input.socialLinks !== undefined && { socialLinks: input.socialLinks }),
        ...(input.seoTitle !== undefined && { seoTitle: input.seoTitle }),
        ...(input.metaDescription !== undefined && { metaDescription: input.metaDescription }),
        ...(input.metaKeywords !== undefined && { metaKeywords: input.metaKeywords }),
        ...(input.ogImage !== undefined && { ogImage: input.ogImage }),
        ...(input.isPublic !== undefined && { isPublic: input.isPublic }),
        ...(input.acceptingOrders !== undefined && { acceptingOrders: input.acceptingOrders }),
        ...(input.vacationMode !== undefined && { vacationMode: input.vacationMode }),
        ...(input.vacationMessage !== undefined && { vacationMessage: input.vacationMessage }),
        ...(input.status !== undefined && { status: input.status }),
      },
    });
  }

  /**
   * Find all products belonging to a vendor's store
   */
  async findVendorProducts(storeId: string) {
    return db.product.findMany({
      where: { storeId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Find single product owned by store
   */
  async findVendorProductById(productId: string, storeId: string) {
    return db.product.findFirst({
      where: { id: productId, storeId, deletedAt: null },
      include: {
        shippingPolicies: true,
        campaignProducts: true,
        variants: true,
      },
    });
  }

  /**
   * Create a new product under vendor's store
   */
  async createVendorProduct(storeId: string, input: VendorProductInput) {
    const slug = `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;

    return db.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          storeId,
          name: input.name,
          brand: input.brand || null,
          slug,
          description: input.description || null,
          price: input.price,
          compareAtPrice: input.compareAtPrice || null,
          categoryName: input.categoryName || null,
          images: input.images || [],
          stock: input.stock ?? 0,
          weight: input.weight || null,
          refundPolicyId: input.refundPolicyId || null,
          returnPolicyId: input.returnPolicyId || null,
          warrantyPolicyId: input.warrantyPolicyId || null,
          seoTitle: input.seoTitle || null,
          seoDescription: input.seoDescription || null,
          seoKeywords: input.seoKeywords || null,
          ...(input.specifications && { specifications: input.specifications }),
          isFeatured: Boolean(input.isFeatured),
          status: input.status || "ACTIVE",
        },
      });

      if (Array.isArray(input.variants) && input.variants.length > 0) {
        await tx.productVariant.createMany({
          data: input.variants.map((v: any, index: number) => ({
            productId: product.id,
            sku: v.sku || `${product.slug}-VAR-${index + 1}`,
            price: v.price ? Number(v.price) : input.price,
            compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
            stock: v.stock !== undefined ? Number(v.stock) : input.stock,
            weight: v.weight ? Number(v.weight) : null,
            attributes: v.attributes || v.options || {},
            images: Array.isArray(v.images) ? v.images : (v.image ? [v.image] : []),
          })),
        });
      }

      if (input.shippingPolicyIds && input.shippingPolicyIds.length > 0) {
        await tx.productShipping.deleteMany({ where: { productId: product.id } });
        await tx.productShipping.createMany({
          data: input.shippingPolicyIds.map((spId) => ({
            productId: product.id,
            shippingPolicyId: spId,
          })),
          skipDuplicates: true,
        });
      }

      if (input.campaignIds && input.campaignIds.length > 0) {
        await tx.campaignProduct.deleteMany({ where: { productId: product.id } });
        await tx.campaignProduct.createMany({
          data: input.campaignIds.map((cId) => ({
            productId: product.id,
            campaignId: cId,
          })),
          skipDuplicates: true,
        });
      }

      queueProductBestSellerRecalculation(product.id);

      return product;
    });
  }

  /**
   * Update existing vendor product with ownership check
   */
  async updateVendorProduct(productId: string, storeId: string, input: Partial<VendorProductInput>) {
    return db.$transaction(async (tx) => {
      const updated = await tx.product.updateMany({
        where: { id: productId, storeId, deletedAt: null },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.brand !== undefined && { brand: input.brand }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.price !== undefined && { price: input.price }),
          ...(input.compareAtPrice !== undefined && { compareAtPrice: input.compareAtPrice }),
          ...(input.categoryName !== undefined && { categoryName: input.categoryName }),
          ...(input.images !== undefined && { images: input.images }),
          ...(input.stock !== undefined && { stock: input.stock }),
          ...(input.weight !== undefined && { weight: input.weight }),
          ...(input.refundPolicyId !== undefined && { refundPolicyId: input.refundPolicyId }),
          ...(input.returnPolicyId !== undefined && { returnPolicyId: input.returnPolicyId }),
          ...(input.warrantyPolicyId !== undefined && { warrantyPolicyId: input.warrantyPolicyId }),
          ...(input.specifications !== undefined && { specifications: input.specifications }),
          ...(input.seoTitle !== undefined && { seoTitle: input.seoTitle }),
          ...(input.seoDescription !== undefined && { seoDescription: input.seoDescription }),
          ...(input.seoKeywords !== undefined && { seoKeywords: input.seoKeywords }),
          ...(input.isFeatured !== undefined && { isFeatured: input.isFeatured }),
          ...(input.status && { status: input.status }),
        },
      });

      // Non-destructive variant reconciliation
      if (Array.isArray(input.variants)) {
        const existingVariants = await tx.productVariant.findMany({ where: { productId } });
        const existingById = new Map(existingVariants.map((v) => [v.id, v]));
        const existingBySku = new Map(existingVariants.map((v) => [v.sku, v]));
        const keepIds = new Set<string>();

        for (let i = 0; i < input.variants.length; i++) {
          const v = input.variants[i];
          const sku = v.sku || `VAR-${i + 1}`;
          const existing = (v.id && existingById.get(v.id)) || (sku && existingBySku.get(sku));

          if (existing) {
            keepIds.add(existing.id);
            await tx.productVariant.update({
              where: { id: existing.id },
              data: {
                sku,
                price: v.price ? Number(v.price) : (input.price || 0),
                compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
                stock: v.stock !== undefined ? Number(v.stock) : (input.stock || 0),
                weight: v.weight ? Number(v.weight) : null,
                attributes: v.attributes || v.options || {},
                images: Array.isArray(v.images) ? v.images : (v.image ? [v.image] : []),
              },
            });
          } else {
            const created = await tx.productVariant.create({
              data: {
                productId,
                sku,
                price: v.price ? Number(v.price) : (input.price || 0),
                compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
                stock: v.stock !== undefined ? Number(v.stock) : (input.stock || 0),
                weight: v.weight ? Number(v.weight) : null,
                attributes: v.attributes || v.options || {},
                images: Array.isArray(v.images) ? v.images : (v.image ? [v.image] : []),
              },
            });
            keepIds.add(created.id);
          }
        }

        // Delete unreferenced removed variants safely
        const toRemove = existingVariants.filter((ev) => !keepIds.has(ev.id));
        for (const rv of toRemove) {
          const orderItemCount = await tx.orderItem.count({ where: { variantId: rv.id } });
          if (orderItemCount === 0) {
            await tx.productVariant.delete({ where: { id: rv.id } });
          }
        }
      }

      if (input.shippingPolicyIds !== undefined) {
        await tx.productShipping.deleteMany({ where: { productId } });
        if (input.shippingPolicyIds.length > 0) {
          await tx.productShipping.createMany({
            data: input.shippingPolicyIds.map((spId) => ({
              productId,
              shippingPolicyId: spId,
            })),
            skipDuplicates: true,
          });
        }
      }

      if (input.campaignIds !== undefined) {
        await tx.campaignProduct.deleteMany({ where: { productId } });
        if (input.campaignIds.length > 0) {
          await tx.campaignProduct.createMany({
            data: input.campaignIds.map((cId) => ({
              productId,
              campaignId: cId,
            })),
            skipDuplicates: true,
          });
        }
      }

      queueProductBestSellerRecalculation(productId);

      return updated;
    });
  }

  /**
   * Soft delete vendor product with ownership check
   */
  async softDeleteVendorProduct(productId: string, storeId: string) {
    return db.product.updateMany({
      where: { id: productId, storeId },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Update stock count for a vendor product
   */
  async updateStock(productId: string, storeId: string, stock: number) {
    const status = stock <= 0 ? "OUT_OF_STOCK" : "ACTIVE";
    const res = await db.product.updateMany({
      where: { id: productId, storeId, deletedAt: null },
      data: { stock, status },
    });
    queueProductBestSellerRecalculation(productId);
    return res;
  }

  // --- SHIPPING POLICIES ---

  /**
   * List all shipping policies for a vendor store
   */
  async getStoreShippingPolicies(storeId: string) {
    return db.shippingPolicy.findMany({
      where: { storeId, deletedAt: null },
      include: {
        _count: {
          select: { productShipping: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get single shipping policy by ID with store ownership check
   */
  async getShippingPolicyById(policyId: string, storeId: string) {
    return db.shippingPolicy.findFirst({
      where: { id: policyId, storeId, deletedAt: null },
      include: {
        _count: {
          select: { productShipping: true },
        },
      },
    });
  }

  /**
   * Create a new shipping policy for a store
   */
  async createShippingPolicy(storeId: string, data: any) {
    return db.shippingPolicy.create({
      data: {
        storeId,
        name: data.name,
        shippingMethod: data.shippingMethod || "STANDARD",
        deliveryTime: data.deliveryTime || "2-4 Business Days",
        shippingCost: Number(data.shippingCost || 0),
        freeShippingThreshold: data.freeShippingThreshold ? Number(data.freeShippingThreshold) : null,
        processingTime: data.processingTime || "1-2 Business Days",
        deliveryRegions: data.deliveryRegions ?? null,
        supportedCountries: data.supportedCountries ?? null,
        localPickup: Boolean(data.localPickup),
        cashOnDelivery: Boolean(data.cashOnDelivery),
        trackingSupported: data.trackingSupported !== undefined ? Boolean(data.trackingSupported) : true,
        description: data.description || null,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
  }

  /**
   * Update an existing shipping policy with ownership check
   */
  async updateShippingPolicy(policyId: string, storeId: string, data: any) {
    // Ensure ownership first
    const policy = await this.getShippingPolicyById(policyId, storeId);
    if (!policy) return null;

    return db.shippingPolicy.update({
      where: { id: policyId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.shippingMethod && { shippingMethod: data.shippingMethod }),
        ...(data.deliveryTime && { deliveryTime: data.deliveryTime }),
        ...(data.shippingCost !== undefined && { shippingCost: Number(data.shippingCost) }),
        ...(data.freeShippingThreshold !== undefined && {
          freeShippingThreshold: data.freeShippingThreshold ? Number(data.freeShippingThreshold) : null,
        }),
        ...(data.processingTime !== undefined && { processingTime: data.processingTime }),
        ...(data.deliveryRegions !== undefined && { deliveryRegions: data.deliveryRegions }),
        ...(data.supportedCountries !== undefined && { supportedCountries: data.supportedCountries }),
        ...(data.localPickup !== undefined && { localPickup: Boolean(data.localPickup) }),
        ...(data.cashOnDelivery !== undefined && { cashOnDelivery: Boolean(data.cashOnDelivery) }),
        ...(data.trackingSupported !== undefined && { trackingSupported: Boolean(data.trackingSupported) }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
      },
    });
  }

  /**
   * Soft delete a shipping policy with ownership check
   */
  async deleteShippingPolicy(policyId: string, storeId: string) {
    const policy = await this.getShippingPolicyById(policyId, storeId);
    if (!policy) return null;

    return db.shippingPolicy.update({
      where: { id: policyId },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  /**
   * Link products to shipping policies
   */
  async setProductShippingPolicies(productId: string, policyIds: string[]) {
    // Delete old links
    await db.productShipping.deleteMany({
      where: { productId },
    });

    if (policyIds && policyIds.length > 0) {
      await db.productShipping.createMany({
        data: policyIds.map((policyId) => ({
          productId,
          shippingPolicyId: policyId,
        })),
        skipDuplicates: true,
      });
    }
  }

  /**
   * Get assigned shipping policies for a product
   */
  async getProductShippingPolicies(productId: string) {
    const links = await db.productShipping.findMany({
      where: { productId, shippingPolicy: { deletedAt: null } },
      include: { shippingPolicy: true },
    });
    return links.map((l) => l.shippingPolicy);
  }

  // --- REFUND, RETURN & WARRANTY POLICIES ---

  async getStorePolicies(storeId: string) {
    const [shipping, refund, returnPol, warranty, generalStore, privacy, storeData] = await Promise.all([
      db.shippingPolicy.findMany({
        where: { storeId, deletedAt: null },
        orderBy: { createdAt: "desc" },
      }),
      db.refundPolicy.findMany({
        where: { storeId, deletedAt: null },
        orderBy: { createdAt: "desc" },
      }),
      db.returnPolicy.findMany({
        where: { storeId, deletedAt: null },
        orderBy: { createdAt: "desc" },
      }),
      db.warrantyPolicy.findMany({
        where: { storeId, deletedAt: null },
        orderBy: { createdAt: "desc" },
      }),
      db.storePolicy.findMany({
        where: { storeId, deletedAt: null },
        orderBy: { createdAt: "desc" },
      }),
      db.privacyPolicy.findMany({
        where: { storeId, deletedAt: null },
        orderBy: { createdAt: "desc" },
      }),
      db.store.findUnique({
        where: { id: storeId },
        select: { currentStorePolicyId: true, currentPrivacyPolicyId: true },
      }),
    ]);
    return {
      shipping,
      refund,
      return: returnPol,
      warranty,
      generalStore,
      privacy,
      currentStorePolicyId: storeData?.currentStorePolicyId || null,
      currentPrivacyPolicyId: storeData?.currentPrivacyPolicyId || null,
    };
  }

  // --- GENERAL STORE POLICY CRUD ---
  async createGeneralStorePolicy(storeId: string, data: any) {
    return db.storePolicy.create({
      data: {
        storeId,
        name: data.name,
        description: data.description || null,
        termsConditions: data.termsConditions || null,
        customerResponsibilities: data.customerResponsibilities || null,
        sellerResponsibilities: data.sellerResponsibilities || null,
        orderAcceptanceRules: data.orderAcceptanceRules || null,
        productRestrictions: data.productRestrictions || null,
        cancellationRules: data.cancellationRules || null,
        disputeResolution: data.disputeResolution || null,
        effectiveDate: data.effectiveDate || null,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
  }

  async updateGeneralStorePolicy(id: string, storeId: string, data: any) {
    const existing = await db.storePolicy.findFirst({ where: { id, storeId, deletedAt: null } });
    if (!existing) return null;
    return db.storePolicy.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.termsConditions !== undefined && { termsConditions: data.termsConditions }),
        ...(data.customerResponsibilities !== undefined && { customerResponsibilities: data.customerResponsibilities }),
        ...(data.sellerResponsibilities !== undefined && { sellerResponsibilities: data.sellerResponsibilities }),
        ...(data.orderAcceptanceRules !== undefined && { orderAcceptanceRules: data.orderAcceptanceRules }),
        ...(data.productRestrictions !== undefined && { productRestrictions: data.productRestrictions }),
        ...(data.cancellationRules !== undefined && { cancellationRules: data.cancellationRules }),
        ...(data.disputeResolution !== undefined && { disputeResolution: data.disputeResolution }),
        ...(data.effectiveDate !== undefined && { effectiveDate: data.effectiveDate }),
        ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
      },
    });
  }

  async deleteGeneralStorePolicy(id: string, storeId: string) {
    const existing = await db.storePolicy.findFirst({ where: { id, storeId, deletedAt: null } });
    if (!existing) return null;
    return db.storePolicy.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
  }

  // --- PRIVACY POLICY CRUD ---
  async createPrivacyPolicy(storeId: string, data: any) {
    return db.privacyPolicy.create({
      data: {
        storeId,
        name: data.name,
        introduction: data.introduction || null,
        infoCollected: data.infoCollected || null,
        howInfoUsed: data.howInfoUsed || null,
        cookiesPolicy: data.cookiesPolicy || null,
        thirdPartyServices: data.thirdPartyServices || null,
        dataSharing: data.dataSharing || null,
        dataRetention: data.dataRetention || null,
        securityMeasures: data.securityMeasures || null,
        customerRights: data.customerRights || null,
        contactInfo: data.contactInfo || null,
        effectiveDate: data.effectiveDate || null,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
  }

  async updatePrivacyPolicy(id: string, storeId: string, data: any) {
    const existing = await db.privacyPolicy.findFirst({ where: { id, storeId, deletedAt: null } });
    if (!existing) return null;
    return db.privacyPolicy.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.introduction !== undefined && { introduction: data.introduction }),
        ...(data.infoCollected !== undefined && { infoCollected: data.infoCollected }),
        ...(data.howInfoUsed !== undefined && { howInfoUsed: data.howInfoUsed }),
        ...(data.cookiesPolicy !== undefined && { cookiesPolicy: data.cookiesPolicy }),
        ...(data.thirdPartyServices !== undefined && { thirdPartyServices: data.thirdPartyServices }),
        ...(data.dataSharing !== undefined && { dataSharing: data.dataSharing }),
        ...(data.dataRetention !== undefined && { dataRetention: data.dataRetention }),
        ...(data.securityMeasures !== undefined && { securityMeasures: data.securityMeasures }),
        ...(data.customerRights !== undefined && { customerRights: data.customerRights }),
        ...(data.contactInfo !== undefined && { contactInfo: data.contactInfo }),
        ...(data.effectiveDate !== undefined && { effectiveDate: data.effectiveDate }),
        ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
      },
    });
  }

  async deletePrivacyPolicy(id: string, storeId: string) {
    const existing = await db.privacyPolicy.findFirst({ where: { id, storeId, deletedAt: null } });
    if (!existing) return null;
    return db.privacyPolicy.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
  }

  // --- ASSIGN STORE & PRIVACY POLICIES ---
  async assignCurrentPolicies(storeId: string, currentStorePolicyId?: string | null, currentPrivacyPolicyId?: string | null) {
    return db.store.update({
      where: { id: storeId },
      data: {
        ...(currentStorePolicyId !== undefined && { currentStorePolicyId }),
        ...(currentPrivacyPolicyId !== undefined && { currentPrivacyPolicyId }),
      },
    });
  }

  // Refund Policy CRUD
  async createRefundPolicy(storeId: string, data: any) {
    return db.refundPolicy.create({
      data: {
        storeId,
        name: data.name,
        description: data.description || null,
        eligibilityPeriod: data.eligibilityPeriod || "7 days",
        refundType: data.refundType || "FULL_REFUND",
        conditions: data.conditions || null,
        excludedProducts: data.excludedProducts || null,
        processingTime: data.processingTime || null,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
  }

  async updateRefundPolicy(id: string, storeId: string, data: any) {
    const existing = await db.refundPolicy.findFirst({ where: { id, storeId, deletedAt: null } });
    if (!existing) return null;
    return db.refundPolicy.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.eligibilityPeriod && { eligibilityPeriod: data.eligibilityPeriod }),
        ...(data.refundType && { refundType: data.refundType }),
        ...(data.conditions !== undefined && { conditions: data.conditions }),
        ...(data.excludedProducts !== undefined && { excludedProducts: data.excludedProducts }),
        ...(data.processingTime !== undefined && { processingTime: data.processingTime }),
        ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
      },
    });
  }

  async deleteRefundPolicy(id: string, storeId: string) {
    const existing = await db.refundPolicy.findFirst({ where: { id, storeId, deletedAt: null } });
    if (!existing) return null;
    return db.refundPolicy.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
  }

  // Return Policy CRUD
  async createReturnPolicy(storeId: string, data: any) {
    return db.returnPolicy.create({
      data: {
        storeId,
        name: data.name,
        description: data.description || null,
        returnWindow: data.returnWindow || "14 days",
        returnConditions: data.returnConditions || null,
        shippingResponsibility: data.shippingResponsibility || "CUSTOMER",
        acceptedReasons: data.acceptedReasons || null,
        inspectionReqs: data.inspectionReqs || null,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
  }

  async updateReturnPolicy(id: string, storeId: string, data: any) {
    const existing = await db.returnPolicy.findFirst({ where: { id, storeId, deletedAt: null } });
    if (!existing) return null;
    return db.returnPolicy.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.returnWindow && { returnWindow: data.returnWindow }),
        ...(data.returnConditions !== undefined && { returnConditions: data.returnConditions }),
        ...(data.shippingResponsibility && { shippingResponsibility: data.shippingResponsibility }),
        ...(data.acceptedReasons !== undefined && { acceptedReasons: data.acceptedReasons }),
        ...(data.inspectionReqs !== undefined && { inspectionReqs: data.inspectionReqs }),
        ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
      },
    });
  }

  async deleteReturnPolicy(id: string, storeId: string) {
    const existing = await db.returnPolicy.findFirst({ where: { id, storeId, deletedAt: null } });
    if (!existing) return null;
    return db.returnPolicy.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
  }

  // Warranty Policy CRUD
  async createWarrantyPolicy(storeId: string, data: any) {
    return db.warrantyPolicy.create({
      data: {
        storeId,
        name: data.name,
        warrantyType: data.warrantyType || "STORE",
        warrantyDuration: data.warrantyDuration || "12 Months",
        coverage: data.coverage || null,
        exclusions: data.exclusions || null,
        claimProcess: data.claimProcess || null,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
  }

  async updateWarrantyPolicy(id: string, storeId: string, data: any) {
    const existing = await db.warrantyPolicy.findFirst({ where: { id, storeId, deletedAt: null } });
    if (!existing) return null;
    return db.warrantyPolicy.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.warrantyType && { warrantyType: data.warrantyType }),
        ...(data.warrantyDuration && { warrantyDuration: data.warrantyDuration }),
        ...(data.coverage !== undefined && { coverage: data.coverage }),
        ...(data.exclusions !== undefined && { exclusions: data.exclusions }),
        ...(data.claimProcess !== undefined && { claimProcess: data.claimProcess }),
        ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
      },
    });
  }

  async deleteWarrantyPolicy(id: string, storeId: string) {
    const existing = await db.warrantyPolicy.findFirst({ where: { id, storeId, deletedAt: null } });
    if (!existing) return null;
    return db.warrantyPolicy.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
  }

  // --- MARKETING CAMPAIGNS ---

  async setProductCampaigns(productId: string, campaignIds: string[]) {
    await db.campaignProduct.deleteMany({ where: { productId } });
    if (campaignIds && campaignIds.length > 0) {
      await db.campaignProduct.createMany({
        data: campaignIds.map((campaignId) => ({
          productId,
          campaignId,
        })),
        skipDuplicates: true,
      });
    }
  }

  async getProductCampaigns(productId: string) {
    const links = await db.campaignProduct.findMany({
      where: { productId, campaign: { deletedAt: null } },
      include: { campaign: true },
    });
    return links.map((l) => l.campaign);
  }

  async getStoreCampaigns(storeId: string) {
    return db.marketingCampaign.findMany({
      where: { storeId, deletedAt: null },
      include: {
        _count: { select: { campaignProducts: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getCampaignById(id: string, storeId?: string) {
    const where: any = { id, deletedAt: null };
    if (storeId) where.storeId = storeId;
    return db.marketingCampaign.findFirst({
      where,
      include: {
        _count: { select: { campaignProducts: true } },
        campaignProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async createCampaign(storeId: string, data: any, actorUserId?: string) {
    const slug = data.slug || `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;
    const now = new Date();
    const startDate = data.startDate ? new Date(data.startDate) : now;
    const endDate = new Date(data.endDate);

    let status = data.status || "ACTIVE";
    if (data.isActive === false) status = "DRAFT";
    else if (startDate > now) status = "SCHEDULED";
    else if (endDate < now) status = "EXPIRED";

    const campaign = await db.marketingCampaign.create({
      data: {
        storeId,
        name: data.name,
        slug,
        type: data.type || "FLASH_SALE",
        description: data.description || null,
        banner: data.banner || null,
        badge: data.badge || null,
        color: data.color || null,
        startDate,
        endDate,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
        status,
        visibility: data.visibility || "PUBLIC",
        discountType: data.discountType || "PERCENTAGE",
        discountValue: data.discountValue ? Number(data.discountValue) : null,
        priority: data.priority ? Number(data.priority) : 0,
        targetScope: data.targetScope || "PRODUCT",
        targetCategories: data.targetCategories || null,
        targetBrands: data.targetBrands || null,
        perCustomerLimit: data.perCustomerLimit ? Number(data.perCustomerLimit) : null,
        minimumOrderValue: data.minimumOrderValue ? Number(data.minimumOrderValue) : null,
        maximumDiscount: data.maximumDiscount ? Number(data.maximumDiscount) : null,
        eligibleCustomerGroups: data.eligibleCustomerGroups || null,
        maxUses: data.maxUses ? Number(data.maxUses) : null,
      },
    });

    if (Array.isArray(data.productIds) && data.productIds.length > 0) {
      await db.campaignProduct.createMany({
        data: data.productIds.map((pid: string) => ({
          campaignId: campaign.id,
          productId: pid,
          assignedBy: actorUserId || null,
        })),
        skipDuplicates: true,
      });
    }

    // Invalidate pricing cache & record audit log
    const { invalidateCampaignCache } = await import("@/lib/campaign-pricing");
    invalidateCampaignCache();

    if (actorUserId) {
      await db.auditLog.create({
        data: {
          actorId: actorUserId,
          action: "MARKETING_CAMPAIGN_CREATED",
          targetResource: `MarketingCampaign:${campaign.id}`,
          metadata: { campaignName: campaign.name, storeId, scope: campaign.targetScope },
        },
      }).catch(() => {});
    }

    return campaign;
  }

  async updateCampaign(id: string, storeId: string, data: any, actorUserId?: string) {
    const existing = await this.getCampaignById(id, storeId);
    if (!existing) return null;

    const now = new Date();
    const startDate = data.startDate ? new Date(data.startDate) : existing.startDate;
    const endDate = data.endDate ? new Date(data.endDate) : existing.endDate;
    const isActive = data.isActive !== undefined ? Boolean(data.isActive) : existing.isActive;

    let status = data.status || existing.status;
    if (!isActive) status = "DRAFT";
    else if (startDate > now) status = "SCHEDULED";
    else if (endDate < now) status = "EXPIRED";
    else status = "ACTIVE";

    const updated = await db.marketingCampaign.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.type && { type: data.type }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.banner !== undefined && { banner: data.banner }),
        ...(data.badge !== undefined && { badge: data.badge }),
        ...(data.color !== undefined && { color: data.color }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.isActive !== undefined && { isActive }),
        status,
        ...(data.visibility && { visibility: data.visibility }),
        ...(data.discountType && { discountType: data.discountType }),
        ...(data.discountValue !== undefined && { discountValue: data.discountValue ? Number(data.discountValue) : null }),
        ...(data.priority !== undefined && { priority: Number(data.priority) }),
        ...(data.targetScope && { targetScope: data.targetScope }),
        ...(data.targetCategories !== undefined && { targetCategories: data.targetCategories }),
        ...(data.targetBrands !== undefined && { targetBrands: data.targetBrands }),
        ...(data.perCustomerLimit !== undefined && { perCustomerLimit: data.perCustomerLimit ? Number(data.perCustomerLimit) : null }),
        ...(data.minimumOrderValue !== undefined && { minimumOrderValue: data.minimumOrderValue ? Number(data.minimumOrderValue) : null }),
        ...(data.maximumDiscount !== undefined && { maximumDiscount: data.maximumDiscount ? Number(data.maximumDiscount) : null }),
        ...(data.eligibleCustomerGroups !== undefined && { eligibleCustomerGroups: data.eligibleCustomerGroups }),
        ...(data.maxUses !== undefined && { maxUses: data.maxUses ? Number(data.maxUses) : null }),
      },
    });

    if (Array.isArray(data.productIds)) {
      await db.campaignProduct.deleteMany({ where: { campaignId: id } });
      if (data.productIds.length > 0) {
        await db.campaignProduct.createMany({
          data: data.productIds.map((pid: string) => ({
            campaignId: id,
            productId: pid,
            assignedBy: actorUserId || null,
          })),
          skipDuplicates: true,
        });
      }
    }

    const { invalidateCampaignCache } = await import("@/lib/campaign-pricing");
    invalidateCampaignCache();

    if (actorUserId) {
      await db.auditLog.create({
        data: {
          actorId: actorUserId,
          action: "MARKETING_CAMPAIGN_UPDATED",
          targetResource: `MarketingCampaign:${id}`,
          metadata: { campaignName: updated.name, storeId, status: updated.status },
        },
      }).catch(() => {});
    }

    return updated;
  }

  async deleteCampaign(id: string, storeId: string, actorUserId?: string) {
    const existing = await this.getCampaignById(id, storeId);
    if (!existing) return null;

    const res = await db.marketingCampaign.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false, status: "CANCELLED" },
    });

    const { invalidateCampaignCache } = await import("@/lib/campaign-pricing");
    invalidateCampaignCache();

    if (actorUserId) {
      await db.auditLog.create({
        data: {
          actorId: actorUserId,
          action: "MARKETING_CAMPAIGN_DELETED",
          targetResource: `MarketingCampaign:${id}`,
          metadata: { campaignName: existing.name, storeId },
        },
      }).catch(() => {});
    }

    return res;
  }
}

export const vendorRepository = new VendorRepository();
