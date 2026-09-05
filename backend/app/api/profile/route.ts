import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId, formatUserResponse } from "@/lib/auth/authentication";
import { db } from "@/lib/db";
import { getPermissionsForRoles } from "@/lib/auth/authorization/permissions";

/**
 * GET /api/profile
 * Get authenticated user's profile info
 */
export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: {
        userRoles: { include: { role: true } },
        vendorProfile: { include: { stores: { take: 1 } } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = getPermissionsForRoles(roles);

    return NextResponse.json({
      user: formatUserResponse(user, roles, permissions),
    });
  } catch (error: any) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/profile
 * Update user's profile details (avatar, firstName, lastName, phone)
 */
export async function PATCH(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { avatar, firstName, lastName, phone } = body;

    const updateData: any = {};
    if (avatar !== undefined) updateData.avatar = avatar;
    if (firstName !== undefined && firstName.trim() !== "") updateData.firstName = firstName.trim();
    if (lastName !== undefined && lastName.trim() !== "") updateData.lastName = lastName.trim();
    if (phone !== undefined) updateData.phone = phone.trim() || null;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        userRoles: { include: { role: true } },
        vendorProfile: { include: { stores: { take: 1 } } },
      },
    });

    const roles = updatedUser.userRoles.map((ur) => ur.role.name);
    const permissions = getPermissionsForRoles(roles);

    return NextResponse.json({
      success: true,
      user: formatUserResponse(updatedUser, roles, permissions),
    });
  } catch (error: any) {
    console.error("PATCH /api/profile error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
