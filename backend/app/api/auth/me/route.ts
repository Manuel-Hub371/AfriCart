import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, setAuthCookies, clearAuthCookies, formatUserResponse } from "@/lib/auth/authentication";
import { db } from "@/lib/db";
import { verifyServerSession } from "@/lib/auth/session";
import { getPermissionsForRoles } from "@/lib/auth/authorization/permissions";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("afriCart_accessToken")?.value;
    const refreshToken = cookieStore.get("afriCart_refreshToken")?.value;

    let userId: string | null = null;
    let sessionId: string | null = null;
    let shouldRotate = false;

    if (accessToken) {
      const decodedAccess = await verifyToken(accessToken);
      if (decodedAccess) {
        userId = decodedAccess.userId;
        sessionId = decodedAccess.sessionId || null;
      } else {
        shouldRotate = true;
      }
    } else {
      shouldRotate = true;
    }

    // Try rotating with the refresh token if the access token has expired
    if (shouldRotate && refreshToken) {
      const decodedRefresh = await verifyToken(refreshToken);
      if (decodedRefresh) {
        userId = decodedRefresh.userId;
        sessionId = decodedRefresh.sessionId || null;
      }
      // If rotation is required but the refresh token is also invalid, fall through
      // to the unauthorized branch (userId stays null).
    }

    if (!userId) {
      // Clear invalid cookies
      await clearAuthCookies();
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // When the token carries a server sessionId (login-created sessions), enforce it:
    // revoked/expired sessions or suspended/banned users are rejected and logged out.
    // Tokens without a sessionId (e.g. accounts created before server sessions were
    // introduced) keep the previous JWT-only behavior.
    if (sessionId) {
      const serverSession = await verifyServerSession(sessionId);
      if (!serverSession || serverSession.user.id !== userId) {
        await clearAuthCookies();
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
    }

    // Fetch fresh user details
    const user = await db.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: {
        userRoles: {
          include: {
            role: true
          }
        },
        vendorProfile: {
          where: { deletedAt: null },
          include: {
            stores: {
              where: { deletedAt: null },
              take: 1
            }
          }
        }
      }
    });

    if (!user || user.status === "BANNED" || user.status === "SUSPENDED") {
      await clearAuthCookies();
      return NextResponse.json({ message: "Unauthorized or account suspended" }, { status: 401 });
    }

    const roles = user.userRoles.map(ur => ur.role.name);
    const permissions = getPermissionsForRoles(roles);

    // Perform rotation by generating new cookies, carrying the sessionId through
    if (shouldRotate) {
      await setAuthCookies({
        userId: user.id,
        sessionId: sessionId || undefined,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles,
        permissions
      });
    }

    return NextResponse.json({
      success: true,
      user: formatUserResponse(user, roles, permissions)
    });

  } catch (error: any) {
    console.error("me endpoint error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
