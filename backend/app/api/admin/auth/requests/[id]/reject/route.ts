import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdminUser } from "@/lib/auth/authentication";
import { adminService } from "@/modules/admin/service";

// POST /api/admin/auth/requests/[id]/reject
// Rejects a pending administrator access request (with an optional reason).
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const admin = await getAuthenticatedAdminUser();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  const { id } = await context.params;

  let reason = "";
  try {
    const body = await req.json();
    reason = typeof body?.reason === "string" ? body.reason.trim() : "";
  } catch {
    // reason is optional — ignore malformed request bodies
  }

  try {
    const result = await adminService.rejectAdminApprovalRequest(id, reason, admin);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error("Reject admin request error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to reject admin access request" },
      { status: err?.status || 500 }
    );
  }
}