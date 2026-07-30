import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { shoppingService } from "@/modules/shopping/service";

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const wishlist = await shoppingService.getWishlist(userId);
    return NextResponse.json(wishlist);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const productId = body?.productId;
    if (!productId || typeof productId !== "string") {
      return NextResponse.json({ message: "productId is required" }, { status: 400 });
    }

    const wishlist = await shoppingService.addToWishlist(userId, productId.trim());
    return NextResponse.json(wishlist);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to add item to wishlist" },
      { status: 500 }
    );
  }
}
