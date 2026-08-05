import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { vendorService } from "@/modules/vendor/service";
import { vendorRepository } from "@/modules/vendor/repository";

// PATCH & DELETE /api/vendor/policies/refund/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const store = await vendorService.getVendorStore(userId);
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const body = await req.json();
    const policy = await vendorRepository.updateRefundPolicy(id, store.id, body);
    if (!policy) {
      return NextResponse.json({ error: "Refund policy not found or unauthorized" }, { status: 403 });
    }
    return NextResponse.json({ policy });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update refund policy" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const store = await vendorService.getVendorStore(userId);
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const policy = await vendorRepository.deleteRefundPolicy(id, store.id);
    if (!policy) {
      return NextResponse.json({ error: "Refund policy not found or unauthorized" }, { status: 403 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to delete refund policy" }, { status: 500 });
  }
}
