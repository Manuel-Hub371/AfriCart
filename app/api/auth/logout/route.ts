import { NextResponse } from "next/server";
import { clearAuthCookies, verifyToken } from "@/lib/auth/authentication";
import { revokeServerSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("afriCart_accessToken")?.value || cookieStore.get("afriCart_refreshToken")?.value;
    
    let userId: string | null = null;
    let sessionId: string | null = null;

    if (token) {
      const decoded = await verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
        sessionId = decoded.sessionId;
      }
    }

    // Revoke server-side session
    if (sessionId) {
      await revokeServerSession(sessionId);
    }

    // Clear session cookies
    await clearAuthCookies();

    // Log the event if we could identify the user
    if (userId) {
      await db.auditLog.create({
        data: {
          actorId: userId,
          action: "USER_LOGOUT",
          targetResource: `User:${userId}`,
          metadata: {
            timestamp: new Date().toISOString(),
            sessionId
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Logout API error:", error);
    return NextResponse.json({ message: "An error occurred during logout" }, { status: 500 });
  }
}
