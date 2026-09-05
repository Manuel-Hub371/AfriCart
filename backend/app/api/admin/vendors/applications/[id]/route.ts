import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdminUser } from "@/lib/auth/authentication";
import { adminService } from "@/modules/admin/service";

// GET /api/admin/vendors/applications/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const application = await adminService.getVendorApplicationDetail(id);
    return NextResponse.json({ application });
  } catch (err: any) {
    console.error("Admin vendor application detail error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch application details" },
      { status: err?.status || 500 }
    );
  }
}
