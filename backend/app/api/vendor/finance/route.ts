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
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
        orderItems: {
          where: { storeId },
          select: { price: true, quantity: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let grossRevenue = 0;
    let completedPayouts = 0;
    let pendingPayouts = 0;

    const platformFeeRate = 0.10;

    const transactions = orders.map((o) => {
      const u = o.customerProfile?.user;
      const customerName = `${u?.firstName || "Customer"} ${u?.lastName || ""}`.trim() || u?.email || "Guest";
      
      const vendorGrossAmount = o.orderItems.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0);
      const fee = vendorGrossAmount * platformFeeRate;
      const netAmount = vendorGrossAmount - fee;

      if (o.status !== "CANCELLED") {
        grossRevenue += vendorGrossAmount;
        if (o.status === "DELIVERED") {
          completedPayouts += netAmount;
        } else {
          pendingPayouts += netAmount;
        }
      }

      return {
        id: o.id.slice(0, 8).toUpperCase(),
        fullId: o.id,
        customer: customerName,
        type: "Sale",
        grossAmount: vendorGrossAmount,
        fee,
        netAmount,
        status: o.status === "DELIVERED" ? "Completed" : o.status === "CANCELLED" ? "Refunded" : "Pending",
        date: new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
    });

    const totalPlatformFee = grossRevenue * platformFeeRate;
    const netEarnings = grossRevenue - totalPlatformFee;

    return NextResponse.json({
      summary: {
        grossRevenue,
        platformFees: totalPlatformFee,
        netEarnings,
        completedPayouts,
        pendingPayouts,
      },
      transactions,
    });
  } catch (error: any) {
    console.error("Error fetching vendor financial stats:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
