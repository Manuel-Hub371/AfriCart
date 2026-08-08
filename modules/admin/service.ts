import { db, withDbRetry } from "@/lib/db";
import {
  AdminMetricsDTO,
  VendorApplicationItemDTO,
  VendorApplicationDetailDTO,
} from "./dto";

export class AdminService {
  /**
   * GET real database-driven aggregated platform metrics for Admin Overview Dashboard
   */
  async getAdminDashboardMetrics(): Promise<AdminMetricsDTO> {
    const [
      totalUsers,
      totalVendors,
      pendingApplications,
      approvedVendors,
      rejectedApplications,
      changesRequestedApplications,
      activeStores,
      suspendedStores,
      totalProducts,
      totalOrders,
      revenueAggregate,
    ] = await Promise.all([
      db.user.count({ where: { deletedAt: null } }),
      db.vendorProfile.count({ where: { deletedAt: null } }),
      db.store.count({ where: { status: "PENDING_APPROVAL", deletedAt: null } }),
      db.store.count({ where: { status: "ACTIVE", deletedAt: null } }),
      db.store.count({ where: { status: "REJECTED", deletedAt: null } }),
      db.store.count({ where: { status: "CHANGES_REQUESTED", deletedAt: null } }),
      db.store.count({ where: { status: "ACTIVE", isPublic: true, deletedAt: null } }),
      db.store.count({ where: { status: "SUSPENDED", deletedAt: null } }),
      db.product.count({ where: { deletedAt: null } }),
      db.order.count(),
      db.order.aggregate({
        where: { status: "DELIVERED" },
        _sum: { totalAmount: true },
      }),
    ]);

    const totalRevenue = Number(revenueAggregate._sum.totalAmount || 0);

    return {
      totalUsers,
      totalVendors,
      pendingApplications,
      approvedVendors,
      rejectedApplications,
      changesRequestedApplications,
      activeStores,
      suspendedStores,
      totalProducts,
      totalOrders,
      totalRevenue,
    };
  }

  /**
   * GET vendor applications with search, status filter, and pagination
   */
  async getVendorApplications(query: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 15));
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (query.status && query.status !== "ALL") {
      where.status = query.status;
    }

    if (query.search && query.search.trim()) {
      const s = query.search.trim();
      where.OR = [
        { name: { contains: s, mode: "insensitive" } },
        { category: { contains: s, mode: "insensitive" } },
        { vendorProfile: { businessName: { contains: s, mode: "insensitive" } } },
        { vendorProfile: { user: { email: { contains: s, mode: "insensitive" } } } },
        { vendorProfile: { user: { firstName: { contains: s, mode: "insensitive" } } } },
        { vendorProfile: { user: { lastName: { contains: s, mode: "insensitive" } } } },
      ];
    }

    const [total, stores] = await Promise.all([
      db.store.count({ where }),
      db.store.findMany({
        where,
        include: {
          vendorProfile: {
            include: {
              user: true,
              verification: true,
            },
          },
          categories: {
            include: {
              storeCategory: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const items: VendorApplicationItemDTO[] = stores.map((store) => {
      const vp = store.vendorProfile;
      const user = vp?.user;
      const verif = vp?.verification;
      const cats = Array.isArray(store.categories)
        ? store.categories.map((c) => c.storeCategory.name)
        : [store.category].filter(Boolean) as string[];

      return {
        id: store.id,
        vendorProfileId: vp?.id || "",
        userId: user?.id || "",
        vendorName: user ? `${user.firstName} ${user.lastName}` : "Unknown Vendor",
        vendorEmail: user?.email || "",
        vendorPhone: user?.phone || null,
        businessName: vp?.businessName || store.name,
        businessType: store.businessType || vp?.businessType || null,
        businessCategory: store.category || vp?.businessCategory || "General",
        categories: cats,
        storeName: store.name,
        storeSlug: store.slug,
        country: store.country || vp?.country || "Ghana",
        region: store.region || vp?.region || "",
        city: store.city || vp?.city || "",
        status: store.status,
        submittedAt: store.createdAt.toISOString(),
        updatedAt: store.updatedAt.toISOString(),
        hasIdDocument: Boolean(verif?.idDocumentUrl),
        hasBusinessCert: Boolean(verif?.businessCertificateUrl),
      };
    });

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * GET single vendor application detail verification profile
   */
  async getVendorApplicationDetail(storeId: string): Promise<VendorApplicationDetailDTO> {
    const store = await db.store.findFirst({
      where: { id: storeId, deletedAt: null },
      include: {
        vendorProfile: {
          include: {
            user: true,
            verification: {
              include: {
                reviewer: true,
              },
            },
            payoutProfile: true,
          },
        },
        categories: {
          include: {
            storeCategory: true,
          },
        },
      },
    });

    if (!store || !store.vendorProfile) {
      throw { code: "STORE_NOT_FOUND", message: "Vendor application not found", status: 404 };
    }

    const vp = store.vendorProfile;
    const user = vp.user;
    const verif = vp.verification;
    const payout = vp.payoutProfile;
    const categories = Array.isArray(store.categories)
      ? store.categories.map((c) => ({
          id: c.storeCategory.id,
          name: c.storeCategory.name,
          slug: c.storeCategory.slug,
        }))
      : [];

    const reviewerName = verif?.reviewer
      ? `${verif.reviewer.firstName} ${verif.reviewer.lastName}`
      : null;

    return {
      id: store.id,
      vendorProfileId: vp.id,
      userId: user.id,

      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || null,
      userStatus: user.status,

      businessName: vp.businessName,
      businessType: store.businessType || vp.businessType || null,
      businessCategory: store.category || vp.businessCategory,
      categories,
      businessAddress: store.address || vp.businessAddress,
      city: store.city || vp.city,
      region: store.region || vp.region,
      country: store.country || vp.country,

      registrationNumber: verif?.registrationNumber || null,
      taxId: verif?.taxId || null,
      idDocumentUrl: verif?.idDocumentUrl || null,
      businessCertificateUrl: verif?.businessCertificateUrl || null,
      rejectionReason: verif?.rejectionReason || null,
      identityVerificationStatus: vp.identityVerificationStatus,
      businessVerificationStatus: vp.businessVerificationStatus,
      reviewedAt: verif?.reviewedAt ? verif.reviewedAt.toISOString() : null,
      reviewerName,

      storeName: store.name,
      storeSlug: store.slug,
      storeDescription: store.description || null,
      storeLogo: store.logo || null,
      storeBanner: store.banner || null,
      storeStatus: store.status,
      isPublic: store.isPublic,

      payoutMethod: payout?.payoutMethod || null,
      payoutProvider: payout?.provider || null,
      payoutAccountNumber: payout?.accountNumber || null,
      payoutAccountName: payout?.accountName || null,

      createdAt: store.createdAt.toISOString(),
      updatedAt: store.updatedAt.toISOString(),
    };
  }

  /**
   * APPROVE Vendor Application
   */
  async approveVendorApplication(
    storeId: string,
    adminUser: { id: string; firstName: string; lastName: string }
  ) {
    return withDbRetry(() =>
      db.$transaction(async (tx) => {
        const store = await tx.store.findFirst({
          where: { id: storeId, deletedAt: null },
          include: { vendorProfile: true },
        });

        if (!store || !store.vendorProfile) {
          throw { code: "NOT_FOUND", message: "Vendor application not found", status: 404 };
        }

        const vp = store.vendorProfile;

        // 1. Update Store status to ACTIVE and make isPublic = true
        await tx.store.update({
          where: { id: store.id },
          data: {
            status: "ACTIVE",
            isPublic: true,
            acceptingOrders: true,
          },
        });

        // 2. Update VendorProfile verification statuses to VERIFIED
        await tx.vendorProfile.update({
          where: { id: vp.id },
          data: {
            identityVerified: true,
            identityVerificationStatus: "VERIFIED",
            businessVerified: true,
            businessVerificationStatus: "VERIFIED",
          },
        });

        // 3. Update VendorVerification record
        await tx.vendorVerification.upsert({
          where: { vendorProfileId: vp.id },
          update: {
            rejectionReason: null,
            reviewedAt: new Date(),
            reviewerId: adminUser.id,
          },
          create: {
            vendorProfileId: vp.id,
            reviewedAt: new Date(),
            reviewerId: adminUser.id,
          },
        });

        // 4. Create Audit Log Entry
        await tx.auditLog.create({
          data: {
            actorId: adminUser.id,
            action: "ADMIN_APPROVE_VENDOR",
            targetResource: `Store:${store.id}`,
            metadata: {
              storeId: store.id,
              storeName: store.name,
              vendorUserId: vp.userId,
              adminName: `${adminUser.firstName} ${adminUser.lastName}`,
            },
          },
        });

        // 5. Send Vendor Notification
        await tx.notification.create({
          data: {
            userId: vp.userId,
            title: "Vendor Application Approved! 🎉",
            message: `Congratulations! Your vendor application for "${store.name}" has been approved. Your store is now active and public on AfriCart!`,
            type: "VENDOR_APPROVED",
          },
        });

        return { success: true, status: "ACTIVE" };
      })
    );
  }

  /**
   * REJECT Vendor Application
   */
  async rejectVendorApplication(
    storeId: string,
    reason: string,
    adminUser: { id: string; firstName: string; lastName: string }
  ) {
    return withDbRetry(() =>
      db.$transaction(async (tx) => {
        const store = await tx.store.findFirst({
          where: { id: storeId, deletedAt: null },
          include: { vendorProfile: true },
        });

        if (!store || !store.vendorProfile) {
          throw { code: "NOT_FOUND", message: "Vendor application not found", status: 404 };
        }

        const vp = store.vendorProfile;

        // 1. Update Store status to REJECTED and isPublic = false
        await tx.store.update({
          where: { id: store.id },
          data: {
            status: "REJECTED",
            isPublic: false,
          },
        });

        // 2. Update VendorProfile verification statuses to REJECTED
        await tx.vendorProfile.update({
          where: { id: vp.id },
          data: {
            identityVerified: false,
            identityVerificationStatus: "REJECTED",
            businessVerified: false,
            businessVerificationStatus: "REJECTED",
          },
        });

        // 3. Update VendorVerification with rejection reason
        await tx.vendorVerification.upsert({
          where: { vendorProfileId: vp.id },
          update: {
            rejectionReason: reason,
            reviewedAt: new Date(),
            reviewerId: adminUser.id,
          },
          create: {
            vendorProfileId: vp.id,
            rejectionReason: reason,
            reviewedAt: new Date(),
            reviewerId: adminUser.id,
          },
        });

        // 4. Audit Log Entry
        await tx.auditLog.create({
          data: {
            actorId: adminUser.id,
            action: "ADMIN_REJECT_VENDOR",
            targetResource: `Store:${store.id}`,
            metadata: {
              storeId: store.id,
              storeName: store.name,
              reason,
              adminName: `${adminUser.firstName} ${adminUser.lastName}`,
            },
          },
        });

        // 5. Vendor Notification
        await tx.notification.create({
          data: {
            userId: vp.userId,
            title: "Vendor Application Update",
            message: `Your vendor application for "${store.name}" was not approved at this time. Reason: ${reason}`,
            type: "VENDOR_REJECTED",
          },
        });

        return { success: true, status: "REJECTED" };
      })
    );
  }

  /**
   * REQUEST CHANGES for Vendor Application
   */
  async requestVendorChanges(
    storeId: string,
    reason: string,
    adminUser: { id: string; firstName: string; lastName: string }
  ) {
    return withDbRetry(() =>
      db.$transaction(async (tx) => {
        const store = await tx.store.findFirst({
          where: { id: storeId, deletedAt: null },
          include: { vendorProfile: true },
        });

        if (!store || !store.vendorProfile) {
          throw { code: "NOT_FOUND", message: "Vendor application not found", status: 404 };
        }

        const vp = store.vendorProfile;

        // 1. Update Store status to CHANGES_REQUESTED and isPublic = false
        await tx.store.update({
          where: { id: store.id },
          data: {
            status: "CHANGES_REQUESTED",
            isPublic: false,
          },
        });

        // 2. Persist requested changes reason in VendorVerification
        await tx.vendorVerification.upsert({
          where: { vendorProfileId: vp.id },
          update: {
            rejectionReason: reason,
            reviewedAt: new Date(),
            reviewerId: adminUser.id,
          },
          create: {
            vendorProfileId: vp.id,
            rejectionReason: reason,
            reviewedAt: new Date(),
            reviewerId: adminUser.id,
          },
        });

        // 3. Audit Log Entry
        await tx.auditLog.create({
          data: {
            actorId: adminUser.id,
            action: "ADMIN_REQUEST_VENDOR_CHANGES",
            targetResource: `Store:${store.id}`,
            metadata: {
              storeId: store.id,
              storeName: store.name,
              reason,
              adminName: `${adminUser.firstName} ${adminUser.lastName}`,
            },
          },
        });

        // 4. Vendor Notification
        await tx.notification.create({
          data: {
            userId: vp.userId,
            title: "Action Required: Vendor Application Changes Requested",
            message: `The administrator has reviewed your vendor application for "${store.name}" and requested changes. Reason: ${reason}`,
            type: "VENDOR_CHANGES_REQUESTED",
          },
        });

        return { success: true, status: "CHANGES_REQUESTED" };
      })
    );
  }

  /**
   * SUSPEND Vendor Store
   */
  async suspendVendor(
    storeId: string,
    reason: string,
    adminUser: { id: string; firstName: string; lastName: string }
  ) {
    return withDbRetry(() =>
      db.$transaction(async (tx) => {
        const store = await tx.store.findFirst({
          where: { id: storeId, deletedAt: null },
          include: { vendorProfile: true },
        });

        if (!store || !store.vendorProfile) {
          throw { code: "NOT_FOUND", message: "Vendor store not found", status: 404 };
        }

        const vp = store.vendorProfile;

        // 1. Update Store status to SUSPENDED and isPublic = false
        await tx.store.update({
          where: { id: store.id },
          data: {
            status: "SUSPENDED",
            isPublic: false,
            acceptingOrders: false,
          },
        });

        // 2. Audit Log Entry
        await tx.auditLog.create({
          data: {
            actorId: adminUser.id,
            action: "ADMIN_SUSPEND_VENDOR",
            targetResource: `Store:${store.id}`,
            metadata: {
              storeId: store.id,
              storeName: store.name,
              reason,
              adminName: `${adminUser.firstName} ${adminUser.lastName}`,
            },
          },
        });

        // 3. Vendor Notification
        await tx.notification.create({
          data: {
            userId: vp.userId,
            title: "Account Notice: Vendor Store Suspended",
            message: `Your store "${store.name}" has been suspended by an administrator. Reason: ${reason}`,
            type: "VENDOR_SUSPENDED",
          },
        });

        return { success: true, status: "SUSPENDED" };
      })
    );
  }

  /**
   * REACTIVATE Vendor Store
   */
  async reactivateVendor(
    storeId: string,
    adminUser: { id: string; firstName: string; lastName: string }
  ) {
    return withDbRetry(() =>
      db.$transaction(async (tx) => {
        const store = await tx.store.findFirst({
          where: { id: storeId, deletedAt: null },
          include: { vendorProfile: true },
        });

        if (!store || !store.vendorProfile) {
          throw { code: "NOT_FOUND", message: "Vendor store not found", status: 404 };
        }

        const vp = store.vendorProfile;

        // 1. Update Store status to ACTIVE and isPublic = true
        await tx.store.update({
          where: { id: store.id },
          data: {
            status: "ACTIVE",
            isPublic: true,
            acceptingOrders: true,
          },
        });

        // 2. Audit Log Entry
        await tx.auditLog.create({
          data: {
            actorId: adminUser.id,
            action: "ADMIN_REACTIVATE_VENDOR",
            targetResource: `Store:${store.id}`,
            metadata: {
              storeId: store.id,
              storeName: store.name,
              adminName: `${adminUser.firstName} ${adminUser.lastName}`,
            },
          },
        });

        // 3. Vendor Notification
        await tx.notification.create({
          data: {
            userId: vp.userId,
            title: "Store Reactivated! 🎉",
            message: `Your store "${store.name}" has been reactivated and is once again live on AfriCart!`,
            type: "VENDOR_REACTIVATED",
          },
        });

        return { success: true, status: "ACTIVE" };
      })
    );
  }

  /**
   * GET Admin Audit Logs
   */
  async getAdminAuditLogs(limit = 50) {
    const logs = await db.auditLog.findMany({
      take: Math.min(100, limit),
      orderBy: { createdAt: "desc" },
    });

    const actorIds = Array.from(
      new Set(logs.map((l) => l.actorId).filter((id): id is string => typeof id === "string" && Boolean(id.trim())))
    );

    const actors = actorIds.length > 0
      ? await db.user.findMany({
          where: { id: { in: actorIds } },
          select: { id: true, firstName: true, lastName: true, email: true },
        })
      : [];

    const actorMap = new Map(actors.map((a) => [a.id, `${a.firstName} ${a.lastName} (${a.email})`]));

    return logs.map((log) => ({
      id: log.id,
      actor: log.actorId ? actorMap.get(log.actorId) || `Admin (${log.actorId.slice(0, 8)})` : "System Admin",
      actorId: log.actorId,
      action: log.action,
      targetResource: log.targetResource,
      metadata: log.metadata,
      createdAt: log.createdAt.toISOString(),
    }));
  }

  /**
   * GET Admin User List
   */
  async getAdminUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, users] = await Promise.all([
      db.user.count({ where: { deletedAt: null } }),
      db.user.findMany({
        where: { deletedAt: null },
        include: {
          userRoles: { include: { role: true } },
          vendorProfile: { include: { stores: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const items = users.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      phone: u.phone || null,
      status: u.status,
      roles: u.userRoles.map((ur) => ur.role.name),
      isVendor: !!u.vendorProfile,
      storeName: u.vendorProfile?.stores?.[0]?.name || null,
      createdAt: u.createdAt.toISOString(),
    }));

    return { items, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  /**
   * GET Admin Stores List
   */
  async getAdminStores(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, stores] = await Promise.all([
      db.store.count({ where: { deletedAt: null } }),
      db.store.findMany({
        where: { deletedAt: null },
        include: {
          vendorProfile: { include: { user: true } },
          _count: { select: { products: true, orderItems: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const items = stores.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      owner: s.vendorProfile?.user ? `${s.vendorProfile.user.firstName} ${s.vendorProfile.user.lastName}` : "Unknown",
      email: s.vendorProfile?.user?.email || s.email || null,
      category: s.category || "General",
      status: s.status,
      isPublic: s.isPublic,
      productCount: s._count.products,
      orderCount: s._count.orderItems,
      createdAt: s.createdAt.toISOString(),
    }));

    return { items, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  /**
   * GET Admin Products List
   */
  async getAdminProducts(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, products] = await Promise.all([
      db.product.count({ where: { deletedAt: null } }),
      db.product.findMany({
        where: { deletedAt: null },
        include: {
          store: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const items = products.map((p) => {
      const images = p.images as string[] | null;
      return {
        id: p.id,
        name: p.name,
        price: Number(p.price),
        stock: p.stock,
        category: p.categoryName || "General",
        storeName: p.store?.name || "AfriCart Store",
        status: p.status,
        image: Array.isArray(images) && images.length > 0 ? images[0] : null,
        createdAt: p.createdAt.toISOString(),
      };
    });

    return { items, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  /**
   * GET Admin Orders List
   */
  async getAdminOrders(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, orders] = await Promise.all([
      db.order.count(),
      db.order.findMany({
        include: {
          customerProfile: { include: { user: true } },
          orderItems: { include: { product: { include: { store: true } } } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const items = orders.map((o) => {
      const user = o.customerProfile?.user;
      const storeName = o.orderItems?.[0]?.product?.store?.name || "AfriCart Merchant";

      return {
        id: o.id,
        orderId: o.id.slice(0, 8).toUpperCase(),
        customerName: user ? `${user.firstName} ${user.lastName}` : "Customer",
        customerEmail: user?.email || "Unknown",
        storeName,
        totalAmount: Number(o.totalAmount),
        status: o.status,
        itemCount: o.orderItems.length,
        createdAt: o.createdAt.toISOString(),
      };
    });

    return { items, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  /**
   * GET Admin Financial Summary
   */
  async getAdminFinance() {
    const [orders, activeStoresCount] = await Promise.all([
      db.order.findMany({
        where: { status: "DELIVERED" },
        select: { totalAmount: true },
      }),
      db.store.count({ where: { status: "ACTIVE", deletedAt: null } }),
    ]);

    const grossVolume = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const platformCommissionRate = 0.05; // 5% marketplace commission
    const platformRevenue = grossVolume * platformCommissionRate;
    const vendorPayoutsTotal = grossVolume - platformRevenue;

    return {
      grossVolume,
      platformRevenue,
      vendorPayoutsTotal,
      activeStoresCount,
      completedOrdersCount: orders.length,
    };
  }
}

export const adminService = new AdminService();
