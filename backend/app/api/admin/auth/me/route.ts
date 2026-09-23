import { NextResponse } from "next/server";
import { getAuthenticatedAdminUser, clearAuthCookies } from "@/lib/auth/authentication";

/**
 * Admin session resolution.
 *
 * Unlike the customer /api/auth/me, this endpoint only ever resolves accounts
 * that still have the ADMIN role in the database (re-queried on every call —
 * demoted admins are rejected immediately). It shares the same HttpOnly cookie
 * session as the rest of the platform; cookie rotation is handled by the
 * customer /api/auth/me during middleware route guards.
 */
export async function GET() {
  const admin = await getAuthenticatedAdminUser();
  if (!admin) {
    await clearAuthCookies();
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    data: {
      user: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        roles: ["ADMIN"],
        role: "admin",
      },
    },
  });
}