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

    const orders = await db.order.findMany({
      where: {
        orderItems: {
          some: { storeId },
        },
      },
      include: {
        customerProfile: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                avatar: true,
                createdAt: true,
              },
            },
            addresses: {
              take: 1,
            },
          },
        },
        orderItems: {
          where: { storeId },
          select: { price: true, quantity: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const customerMap = new Map<string, any>();

    orders.forEach((order) => {
      const u = order.customerProfile?.user;
      if (!u) return;

      const vendorSpendForOrder = order.orderItems.reduce(
        (sum, item) => sum + Number(item.price || 0) * item.quantity,
        0
      );

      const customerAddr = order.customerProfile?.addresses?.[0];
      const city = customerAddr?.city || "N/A";
      const country = customerAddr?.country || "N/A";

      if (!customerMap.has(u.id)) {
        customerMap.set(u.id, {
          id: u.id,
          name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email,
          email: u.email,
          phone: u.phone || "N/A",
          country,
          city,
          totalOrders: 1,
          lifetimeSpend: vendorSpendForOrder,
          averageOrderValue: vendorSpendForOrder,
          lastPurchase: new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          lastPurchaseDate: new Date(order.createdAt),
          status: "returning",
          registrationDate: new Date(u.createdAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
        });
      } else {
        const existing = customerMap.get(u.id);
        existing.totalOrders += 1;
        existing.lifetimeSpend += vendorSpendForOrder;
        existing.averageOrderValue = existing.lifetimeSpend / existing.totalOrders;
        if (new Date(order.createdAt) > existing.lastPurchaseDate) {
          existing.lastPurchaseDate = new Date(order.createdAt);
          existing.lastPurchase = new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        }
        if (existing.totalOrders > 5) existing.status = "vip";
      }
    });

    const customers = Array.from(customerMap.values());

    return NextResponse.json(customers);
  } catch (error: any) {
    console.error("Error fetching vendor customers:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
