import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdminUser } from "@/lib/auth/authentication";
import { adminService } from "@/modules/admin/service";

// GET /api/admin/products
export async function GET(req: NextRequest) {
  const admin = await getAuthenticatedAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  try {
    const data = await adminService.getAdminProducts(page, limit);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Admin products list error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch products" },
      { status: err?.status || 500 }
    );
  }
}
