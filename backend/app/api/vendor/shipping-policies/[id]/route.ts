import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { vendorService } from "@/modules/vendor/service";
import { vendorRepository } from "@/modules/vendor/repository";

// GET /api/vendor/shipping-policies/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const store = await vendorService.getVendorStore(userId);
    if (!store) {
      return NextResponse.json({ error: "Forbidden: Store ownership required" }, { status: 403 });
    }

    const { id } = await params;
    const policy = await vendorRepository.getShippingPolicyById(id, store.id);

    if (!policy) {
      return NextResponse.json({ error: "Shipping policy not found or unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ policy });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/vendor/shipping-policies/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const store = await vendorService.getVendorStore(userId);
    if (!store) {
      return NextResponse.json({ error: "Forbidden: Store ownership required" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await vendorRepository.updateShippingPolicy(id, store.id, body);
    if (!updated) {
      return NextResponse.json({ error: "Shipping policy not found or unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ policy: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update shipping policy" }, { status: 500 });
  }
}

// DELETE /api/vendor/shipping-policies/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const store = await vendorService.getVendorStore(userId);
    if (!store) {
      return NextResponse.json({ error: "Forbidden: Store ownership required" }, { status: 403 });
    }

    const { id } = await params;
    const deleted = await vendorRepository.deleteShippingPolicy(id, store.id);
    if (!deleted) {
      return NextResponse.json({ error: "Shipping policy not found or unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ success: true, message: "Shipping policy deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to delete shipping policy" }, { status: 500 });
  }
}
