import { NextResponse } from "next/server";
import { getAuthenticatedAdminUser } from "@/lib/auth/authentication";
import { adminService } from "@/modules/admin/service";

// GET /api/admin/finance
export async function GET() {
  const admin = await getAuthenticatedAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const data = await adminService.getAdminFinance();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Admin finance error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch financial data" },
      { status: err?.status || 500 }
    );
  }
}
