import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  comparePassword,
  setAuthCookies,
  formatUserResponse,
} from "@/lib/auth/authentication";
import { getPermissionsForRoles } from "@/lib/auth/authorization/permissions";
import { createServerSession } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";

/**
 * Dedicated administrator login.
 *
 * This is intentionally NOT the customer login endpoint. It only ever succeeds
 * for accounts that have the ADMIN role in the database (verified server-side,
 * never from anything the browser sends). Non-admin credentials — including a
 * valid customer/vendor password — get a generic 401 so the response does not
 * leak which emails are administrators.
 *
 * On success it creates a real server-side Session, sets the same HttpOnly
 * auth cookies used everywhere else and rotates the session expiry like the
 * customer flow.
 */
export async function POST(req: Request) {
  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const rateLimit = checkRateLimit(`admin-login:${ipAddress}`, { limit: 5, windowMs: 60 * 1000 });
  if (!rateLimit.success) {
    return NextResponse.json(
      { message: "Too many login attempts. Please try again in 1 minute." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  async function recordAdminAudit(userId: string | null, action: string, metadata: Record<string, unknown>) {
    if (!userId) return;
    try {
      await db.auditLog.create({
        data: {
          actorId: userId,
          action,
          targetResource: userId ? `User:${userId}` : null,
          metadata: { ...metadata, ipAddress },
        },
      });
    } catch (err) {
      // Audit writes are non-fatal (must never block authentication).
      console.error("Admin login — could not write audit log (non-fatal):", err);
    }
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const user = await db.user.findFirst({
      where: { email: cleanEmail, deletedAt: null },
      include: {
        userRoles: { include: { role: true } },
        vendorProfile: {
          include: {
            stores: { where: { deletedAt: null }, take: 1 },
          },
        },
      },
    });

    if (!user) {
      // Generic response — do not reveal whether the email exists.
      return NextResponse.json({ message: "Invalid admin credentials" }, { status: 401 });
    }

    const passwordMatch =
      (await comparePassword(String(password).trim(), user.passwordHash)) ||
      (await comparePassword(password, user.passwordHash));

    if (!passwordMatch) {
      await recordAdminAudit(user.id, "ADMIN_LOGIN_REFUSED", { reason: "INVALID_PASSWORD" });
      return NextResponse.json({ message: "Invalid admin credentials" }, { status: 401 });
    }

    if (user.status === "BANNED" || user.status === "SUSPENDED") {
      await recordAdminAudit(user.id, "ADMIN_LOGIN_REFUSED", { reason: user.status });
      return NextResponse.json(
        { message: `Your account has been ${user.status.toLowerCase()}. Please contact support.` },
        { status: 403 }
      );
    }

    // THE role gate — verified from the database, never trusted from the client.
    const roles = user.userRoles.map((ur) => ur.role.name);
    const isAdmin = roles.some((r) => r.toUpperCase() === "ADMIN");

    if (!isAdmin) {
      await recordAdminAudit(user.id, "ADMIN_LOGIN_REFUSED", { reason: "NOT_ADMIN" });
      return NextResponse.json({ message: "Invalid admin credentials" }, { status: 401 });
    }

    const permissions = getPermissionsForRoles(roles);

    const session = await createServerSession(user.id, req.headers.get("user-agent"), ipAddress);

    const formattedUser = formatUserResponse(user, roles, permissions);

    await setAuthCookies({
      userId: user.id,
      sessionId: session.id,
      email: user.email,
      firstName: user.firstName || user.email.split("@")[0],
      lastName: user.lastName || "",
      roles,
      role: formattedUser.role,
      permissions,
    });

    await recordAdminAudit(user.id, "ADMIN_LOGIN", {});

    return NextResponse.json({
      success: true,
      data: { user: formattedUser },
      message: "Signed in successfully",
    });
  } catch (error: any) {
    console.error("Admin login API error:", error);
    if (error?.code === "P1001" || error?.message?.includes("Can't reach database server")) {
      return NextResponse.json(
        { message: "Cannot connect to database. Please ensure DATABASE_URL is set correctly on Render." },
        { status: 503 }
      );
    }
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
  }
}