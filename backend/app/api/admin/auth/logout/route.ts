import { NextResponse } from "next/server";
import { clearAuthCookies, verifyToken } from "@/lib/auth/authentication";
import { revokeServerSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

/**
 * Administrator logout: revokes the active server-side session and clears the
 * HttpOnly auth cookies. It shares the platform-wide session cookie pair, so
 * this is a real logout (not just a client-side clear).
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("afriCart_accessToken")?.value ||
      cookieStore.get("afriCart_refreshToken")?.value;

    let userId: string | null = null;
    let sessionId: string | null = null;

    if (token) {
      const decoded = await verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
        sessionId = decoded.sessionId || null;
      }
    }

    if (sessionId) {
      await revokeServerSession(sessionId);
    }

    await clearAuthCookies();

    if (userId) {
      try {
        await db.auditLog.create({
          data: {
            actorId: userId,
            action: "ADMIN_LOGOUT",
            targetResource: `User:${userId}`,
            metadata: { sessionId, timestamp: new Date().toISOString() },
          },
        });
      } catch (err) {
        console.error("Admin logout — could not write audit log (non-fatal):", err);
      }
    }

    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Admin logout API error:", error);
    return NextResponse.json({ message: "An error occurred during logout" }, { status: 500 });
  }
}