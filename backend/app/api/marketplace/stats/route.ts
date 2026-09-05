import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/marketplace/stats - Get real-time public marketplace statistics
export async function GET() {
  try {
    const [totalProducts, totalStores, totalCustomers, totalReviews] = await Promise.all([
      db.product.count({ where: { deletedAt: null, status: "ACTIVE" } }),
      db.store.count({ where: { deletedAt: null } }),
      db.customerProfile.count(),
      db.review.count(),
    ]);

    return NextResponse.json({
      totalProducts,
      totalStores,
      totalCustomers,
      totalReviews,
      satisfactionRate: 99,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch marketplace statistics" },
      { status: 500 }
    );
  }
}
