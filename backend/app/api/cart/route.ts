import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { shoppingService } from "@/modules/shopping/service";
import { AddToCartSchema } from "@/modules/shopping/dto";

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cart = await shoppingService.getCart(userId);
    return NextResponse.json(cart);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch cart" },
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
    const parseResult = AddToCartSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ message: parseResult.error }, { status: 400 });
    }

    const cart = await shoppingService.addToCart(userId, parseResult.data);
    return NextResponse.json(cart);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cart = await shoppingService.clearCart(userId);
    return NextResponse.json(cart);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to clear cart" },
      { status: 500 }
    );
  }
}
