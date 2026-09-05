import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { shoppingService } from "@/modules/shopping/service";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const wishlist = await shoppingService.removeFromWishlist(userId, id);
    return NextResponse.json(wishlist);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to remove wishlist item" },
      { status: 500 }
    );
  }
}
