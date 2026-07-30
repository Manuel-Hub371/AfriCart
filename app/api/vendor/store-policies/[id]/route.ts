import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { vendorService } from "@/modules/vendor/service";
import { vendorRepository } from "@/modules/vendor/repository";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/vendor/store-policies/[id]
export async function PATCH(req: NextRequest, { params }: RouteParams) {
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
    const updated = await vendorRepository.updateGeneralStorePolicy(id, store.id, body);
    if (!updated) {
      return NextResponse.json({ error: "Policy not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ policy: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/vendor/store-policies/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
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

    const deleted = await vendorRepository.deleteGeneralStorePolicy(id, store.id);
    if (!deleted) {
      return NextResponse.json({ error: "Policy not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
