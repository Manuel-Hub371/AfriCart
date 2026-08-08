import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdminUser } from "@/lib/auth/authentication";
import { adminService } from "@/modules/admin/service";

// GET /api/admin/audit-logs
export async function GET(req: NextRequest) {
  const admin = await getAuthenticatedAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  try {
    const logs = await adminService.getAdminAuditLogs(limit);
    return NextResponse.json({ logs });
  } catch (err: any) {
    console.error("Admin audit logs error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch audit logs" },
      { status: err?.status || 500 }
    );
  }
}
