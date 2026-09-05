import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { validateCreateReviewInput } from "@/modules/reviews/dto";
import { reviewService } from "@/modules/reviews/service";

/**
 * GET /api/products/[id]/reviews
 * Fetch reviews and aggregate summary for a specific product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const summary = await reviewService.getProductReviews(productId, page, limit);
    return NextResponse.json(summary);
  } catch (error: any) {
    console.error("GET /api/products/[id]/reviews error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch reviews" },
      { status: error.status || 500 }
    );
  }
}

/**
 * POST /api/products/[id]/reviews
 * Submit a review for a specific product
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: productId } = await params;
    const body = await request.json();
    const validatedData = validateCreateReviewInput(body);

    const review = await reviewService.createReview(userId, productId, validatedData);
    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/products/[id]/reviews error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit review" },
      { status: error.status || 400 }
    );
  }
}
