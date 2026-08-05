import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { reviewService } from "@/modules/reviews/service";

/**
 * GET /api/profile/reviews
 * Fetch authenticated customer's review history
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const reviews = await reviewService.getCustomerReviews(userId, page, limit);
    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("GET /api/profile/reviews error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch customer reviews" },
      { status: error.status || 500 }
    );
  }
}

/**
 * DELETE /api/profile/reviews?id=[reviewId]
 * Delete a specific review submitted by the authenticated customer
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    await reviewService.deleteCustomerReview(userId, reviewId);
    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/profile/reviews error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete review" },
      { status: error.status || 500 }
    );
  }
}
