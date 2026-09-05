import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdminUser } from "@/lib/auth/authentication";
import { adminService } from "@/modules/admin/service";

// PATCH /api/admin/vendors/[id]/reactivate
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const result = await adminService.reactivateVendor(id, admin);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Reactivate vendor error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to reactivate vendor" },
      { status: err?.status || 500 }
    );
  }
}
