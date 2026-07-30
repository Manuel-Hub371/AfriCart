import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { reviewService } from "@/modules/reviews/service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/vendor/reviews/[id]/reply
 * Allow a vendor to reply to a review left on one of their store products
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: reviewId } = await params;
    const body = await req.json();
    const vendorReply = (body.vendorReply || body.reply || "").trim();

    if (!vendorReply) {
      return NextResponse.json({ error: "Reply text cannot be empty" }, { status: 400 });
    }

    const updatedReview = await reviewService.replyToReview(userId, reviewId, vendorReply);
    return NextResponse.json({ success: true, review: updatedReview });
  } catch (error: any) {
    console.error("POST /api/vendor/reviews/[id]/reply error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit review reply" },
      { status: error.status || 500 }
    );
  }
}
