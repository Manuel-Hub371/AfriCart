import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { shoppingService } from "@/modules/shopping/service";

export async function PUT(
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

    const addresses = await shoppingService.updateAddress(userId, id, body);
    return NextResponse.json(addresses);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(req, { params });
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
    const addresses = await shoppingService.deleteAddress(userId, id);
    return NextResponse.json(addresses);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete address" },
      { status: 500 }
    );
  }
}
