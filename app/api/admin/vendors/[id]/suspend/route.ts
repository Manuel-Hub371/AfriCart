import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdminUser } from "@/lib/auth/authentication";
import { adminService } from "@/modules/admin/service";
import { SuspendVendorSchema } from "@/modules/admin/dto";

// PATCH /api/admin/vendors/[id]/suspend
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = SuspendVendorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Validation error" }, { status: 400 });
  }

  try {
    const result = await adminService.suspendVendor(id, parsed.data.reason, admin);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Suspend vendor error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to suspend vendor" },
      { status: err?.status || 500 }
    );
  }
}
