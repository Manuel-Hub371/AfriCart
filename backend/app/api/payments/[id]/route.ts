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

    const pms = await shoppingService.updatePaymentMethod(userId, id, body);
    return NextResponse.json(pms);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update payment method" },
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
    const pms = await shoppingService.deletePaymentMethod(userId, id);
    return NextResponse.json(pms);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete payment method" },
      { status: 500 }
    );
  }
}