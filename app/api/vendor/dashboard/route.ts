import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized vendor access" }, { status: 401 });
    }

    const vendorProfile = await db.vendorProfile.findUnique({
      where: { userId },
      include: {
        stores: {
          where: { deletedAt: null },
          take: 1,
        },
      },
    });

    if (!vendorProfile || vendorProfile.stores.length === 0) {
      return NextResponse.json({ error: "Vendor store profile not found" }, { status: 404 });
    }

    const store = vendorProfile.stores[0];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      allOrders,
      productsCount,
      lowStockProducts,
      recentOrders,
      productRatingAggregate,
    ] = await Promise.all([
      db.order.findMany({
        where: {
          orderItems: {
            some: {
              product: { storeId: store.id },
            },
          },
        },
        select: {
          id: true,
          totalAmount: true,
          status: true,
          createdAt: true,
          customerProfileId: true,
        },
      }),
      db.product.count({
        where: { storeId: store.id, deletedAt: null },
      }),
      db.product.findMany({
        where: {
          storeId: store.id,
          deletedAt: null,
          stock: { lte: 10 },
        },
        select: { id: true, name: true, slug: true, stock: true },
        take: 5,
      }),
      db.order.findMany({
        where: {
          orderItems: {
            some: {
              product: { storeId: store.id },
            },
          },
        },
        include: {
          customerProfile: {
            include: {
              user: { select: { firstName: true, lastName: true, email: true } },
            },
          },
          orderItems: {
            include: {
              product: { select: { name: true } },
            },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      db.product.aggregate({
        where: { storeId: store.id, deletedAt: null },
        _avg: { rating: true },
        _sum: { numReviews: true },
      }),
    ]);

    const totalRevenue = allOrders.reduce((acc, order) => acc + Number(order.totalAmount || 0), 0);
    const todaySales = allOrders
      .filter((o) => new Date(o.createdAt) >= startOfToday)
      .reduce((acc, order) => acc + Number(order.totalAmount || 0), 0);
    const monthlyRevenue = allOrders
      .filter((o) => new Date(o.createdAt) >= startOfMonth)
      .reduce((acc, order) => acc + Number(order.totalAmount || 0), 0);

    const pendingOrdersCount = allOrders.filter((o) => o.status === "PENDING" || o.status === "PROCESSING").length;
    const processingOrdersCount = allOrders.filter((o) => o.status === "PROCESSING").length;
    const shippedTodayCount = allOrders.filter((o) => o.status === "SHIPPED" && new Date(o.createdAt) >= startOfToday).length;

    const uniqueCustomerIds = new Set(allOrders.map((o) => o.customerProfileId));

    return NextResponse.json({
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
        logo: store.logo,
        banner: store.banner,
        category: store.category,
      },
      stats: {
        totalRevenue,
        todaySales,
        monthlyRevenue,
        totalOrders: allOrders.length,
        pendingOrders: pendingOrdersCount,
        processingOrders: processingOrdersCount,
        shippedToday: shippedTodayCount,
        totalProducts: productsCount,
        totalCustomers: uniqueCustomerIds.size,
        avgRating: Number((productRatingAggregate._avg.rating || 5.0).toFixed(1)),
        numReviews: productRatingAggregate._sum.numReviews || 0,
      },
      recentOrders: recentOrders.map((o) => {
        const u = o.customerProfile?.user;
        const customerName = `${u?.firstName || "Customer"} ${u?.lastName || ""}`.trim() || u?.email || "Guest";
        return {
          id: o.id.slice(0, 8).toUpperCase(),
          fullId: o.id,
          customer: customerName,
          product: o.orderItems[0]?.product?.name || "Order Item",
          amount: Number(o.totalAmount || 0),
          status: o.status,
          date: new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        };
      }),
      lowStockProducts: lowStockProducts.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.slug || p.id.slice(0, 6).toUpperCase(),
        stock: p.stock,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching vendor dashboard stats:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
