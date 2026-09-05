import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdminUser } from "@/lib/auth/authentication";
import { adminService } from "@/modules/admin/service";

// GET /api/admin/vendors/applications
export async function GET(req: NextRequest) {
  const admin = await getAuthenticatedAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "ALL";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "15", 10);

  try {
    const data = await adminService.getVendorApplications({
      status,
      search,
      page,
      limit,
    });
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Admin vendor applications error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch vendor applications" },
      { status: err?.status || 500 }
    );
  }
}
