import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/marketplace/reviews - Fetch recent public product reviews for the homepage
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(12, Math.max(1, parseInt(searchParams.get("limit") || "6", 10)));

    const reviews = await db.review.findMany({
      where: { comment: { not: null }, product: { deletedAt: null } },
      include: {
        customerProfile: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true },
            },
          },
        },
        product: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      reviews: reviews.map((r) => {
        const firstName = r.customerProfile?.user?.firstName || "";
        const lastName = r.customerProfile?.user?.lastName || "";
        return {
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          isVerifiedPurchase: r.isVerifiedPurchase ?? true,
          customerName: [firstName, lastName].filter(Boolean).join(" ") || "AfriCart Shopper",
          avatar: r.customerProfile?.user?.avatar || null,
          productId: r.product.id,
          productName: r.product.name,
          productSlug: r.product.slug,
          createdAt: r.createdAt.toISOString(),
        };
      }),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch recent reviews" },
      { status: 500 }
    );
  }
}