import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { shoppingService } from "@/modules/shopping/service";
import { UpdateCartItemSchema } from "@/modules/shopping/dto";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parseResult = UpdateCartItemSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ message: parseResult.error }, { status: 400 });
    }

    const cart = await shoppingService.updateCartItem(userId, id, parseResult.data);
    return NextResponse.json(cart);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update cart item" },
      { status: 500 }
    );
  }
}

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
    const cart = await shoppingService.removeFromCart(userId, id);
    return NextResponse.json(cart);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to remove cart item" },
      { status: 500 }
    );
  }
}
