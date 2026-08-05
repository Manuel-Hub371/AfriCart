import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { db } from "@/lib/db";
import { shoppingRepository } from "@/modules/shopping/repository";

/**
 * GET /api/profile/dashboard
 * Returns all real-time stats + recent orders + featured products for the customer dashboard
 */
export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure customer profile exists
    const customerProfile = await shoppingRepository.ensureCustomerProfile(userId);
    const cpId = customerProfile.id;

    // Run all queries in parallel for speed
    const [
      totalOrders,
      wishlistCount,
      reviewCount,
      recentOrdersRaw,
      featuredProducts,
      totalSpend,
    ] = await Promise.all([
      // Total order count
      db.order.count({ where: { customerProfileId: cpId } }),

      // Wishlist count
      db.wishlistItem.count({ where: { customerProfileId: cpId } }),

      // Reviews written
      db.review.count({ where: { customerProfileId: cpId } }),

      // Recent 4 orders with items
      db.order.findMany({
        where: { customerProfileId: cpId },
        orderBy: { createdAt: "desc" },
        take: 4,
        include: {
          orderItems: {
            include: {
              product: {
                select: { id: true, name: true, images: true, store: { select: { name: true } } },
              },
            },
          },
        },
      }),

      // Featured / newest products (for "Recommended" section)
      db.product.findMany({
        where: { status: "ACTIVE", deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 4,
        select: {
          id: true,
          name: true,
          price: true,
          compareAtPrice: true,
          rating: true,
          images: true,
          stock: true,
        },
      }),

      // Total spend across all delivered orders
      db.order.aggregate({
        where: { customerProfileId: cpId, status: "DELIVERED" },
        _sum: { totalAmount: true },
      }),
    ]);

    // Format recent orders
    const recentOrders = recentOrdersRaw.map((order) => {
      const items = order.orderItems || [];
      const storeName = items[0]?.product?.store?.name ?? "AfriCart Store";

      let status: "Delivered" | "Shipped" | "Processing" | "Cancelled" = "Processing";
      if (order.status === "DELIVERED") status = "Delivered";
      else if (order.status === "SHIPPED") status = "Shipped";
      else if (order.status === "CANCELLED") status = "Cancelled";

      return {
        orderId: order.id.slice(0, 8).toUpperCase(),
        fullId: order.id,
        date: order.createdAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        vendor: { name: storeName, verified: true },
        products: items.map((item) => {
          const images = item.product?.images as string[] | null;
          return {
            name: item.product?.name ?? "Product",
            image: Array.isArray(images) && images.length > 0 ? images[0] : "",
            quantity: item.quantity,
          };
        }),
        total: Number(order.totalAmount),
        status,
      };
    });

    // Format featured products
    const products = featuredProducts.map((p) => {
      const images = p.images as string[] | null;
      return {
        id: p.id,
        name: p.name,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        rating: Number(p.rating) || 0,
        image: Array.isArray(images) && images.length > 0 ? images[0] : "",
        stock: p.stock,
      };
    });

    return NextResponse.json({
      stats: {
        totalOrders,
        wishlistCount,
        reviewCount,
        totalSpend: Number(totalSpend._sum.totalAmount || 0),
      },
      recentOrders,
      featuredProducts: products,
    });
  } catch (error: any) {
    console.error("GET /api/profile/dashboard error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
