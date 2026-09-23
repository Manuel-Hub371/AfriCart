import { NextResponse } from "next/server";
import { getAuthenticatedAdminUser } from "@/lib/auth/authentication";
import { adminService } from "@/modules/admin/service";

// GET /api/admin/auth/requests
// Lists pending administrator access requests (admin-only).
export async function GET() {
  const admin = await getAuthenticatedAdminUser();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const items = await adminService.getAdminApprovalRequests();
    return NextResponse.json({ success: true, data: { items } });
  } catch (err: any) {
    console.error("Admin approval requests error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch admin access requests" },
      { status: err?.status || 500 }
    );
  }
}