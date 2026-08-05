import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { reviewService } from "@/modules/reviews/service";

/**
 * GET /api/vendor/reviews
 * Fetch reviews left on products belonging to the authenticated vendor's store
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

    const result = await reviewService.getVendorReviews(userId, page, limit);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("GET /api/vendor/reviews error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch vendor reviews" },
      { status: error.status || 500 }
    );
  }
}
