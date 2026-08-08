import { NextResponse } from "next/server";
import { getAuthenticatedAdminUser } from "@/lib/auth/authentication";
import { adminService } from "@/modules/admin/service";

// GET /api/admin/dashboard
export async function GET() {
  const admin = await getAuthenticatedAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const metrics = await adminService.getAdminDashboardMetrics();
    return NextResponse.json({ metrics });
  } catch (err: any) {
    console.error("Admin dashboard metrics error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch admin metrics" },
      { status: err?.status || 500 }
    );
  }
}
