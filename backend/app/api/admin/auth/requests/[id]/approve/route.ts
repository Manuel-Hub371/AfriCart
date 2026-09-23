import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdminUser } from "@/lib/auth/authentication";
import { adminService } from "@/modules/admin/service";

// POST /api/admin/auth/requests/[id]/approve
// Approves a pending administrator access request and grants the ADMIN role.
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const admin = await getAuthenticatedAdminUser();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  const { id } = await context.params;

  try {
    const result = await adminService.approveAdminApprovalRequest(id, admin);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error("Approve admin request error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to approve admin access request" },
      { status: err?.status || 500 }
    );
  }
}