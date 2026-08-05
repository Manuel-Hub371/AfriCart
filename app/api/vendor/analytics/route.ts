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

    const storeId = vendorProfile.stores[0].id;

    // Query all non-deleted orders containing products from this store
    const orders = await db.order.findMany({
      where: {
        deletedAt: null,
        orderItems: {
          some: { storeId },
        },
      },
      include: {
        orderItems: {
          where: { storeId },
          include: {
            product: { select: { id: true, name: true, price: true, categoryName: true, views: true } },
          },
        },
        customerProfile: { select: { userId: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalOrders = orders.length;
    const cancelledOrRefundedOrders = orders.filter((o) => o.status === "CANCELLED" || o.status === "REFUNDED").length;
    const refundRate = totalOrders > 0 ? parseFloat(((cancelledOrRefundedOrders / totalOrders) * 100).toFixed(1)) : 0.0;

    let totalRevenue = 0;
    let unitsSold = 0;
    let totalProductViews = 0;
    const productSalesMap = new Map<string, { id: string; name: string; category: string; units: number; revenue: number }>();

    orders.forEach((order) => {
      // Calculate revenue from non-cancelled orders
      const isPaid = order.status !== "CANCELLED";
      order.orderItems.forEach((item: any) => {
        if (item.product) {
          unitsSold += item.quantity;
          totalProductViews += item.product.views || 0;
          const itemRevenue = Number(item.price || 0) * item.quantity;
          if (isPaid) {
            totalRevenue += itemRevenue;
          }

          const pid = item.product.id;
          const current = productSalesMap.get(pid) || {
            id: pid,
            name: item.product.name,
            category: item.product.categoryName || "General",
            units: 0,
            revenue: 0,
          };
          current.units += item.quantity;
          if (isPaid) current.revenue += itemRevenue;
          productSalesMap.set(pid, current);
        }
      });
    });

    const avgOrderValue = totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0;
    const conversionRate = totalProductViews > 0
      ? parseFloat(((totalOrders / totalProductViews) * 100).toFixed(1))
      : (totalOrders > 0 ? 5.0 : 0.0);

    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const customerUserIds = orders.map((o) => o.customerProfile?.userId).filter(Boolean);
    const uniqueCustomers = new Set(customerUserIds).size;
    const customerCountsMap = new Map<string, number>();
    customerUserIds.forEach((cid) => {
      customerCountsMap.set(cid!, (customerCountsMap.get(cid!) || 0) + 1);
    });

    const returningCustomers = Array.from(customerCountsMap.values()).filter((cnt) => cnt > 1).length;
    const newCustomers = uniqueCustomers - returningCustomers;

    return NextResponse.json({
      kpis: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        unitsSold,
        avgOrderValue,
        conversionRate,
        returningCustomers,
        newCustomers,
        refundRate,
      },
      topProducts,
    });
  } catch (error: any) {
    console.error("Error fetching vendor analytics:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
