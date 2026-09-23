import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { hashToken } from "@/lib/auth/session";
import { emailService } from "@/lib/email/email-service";
import { checkRateLimit } from "@/lib/security/rate-limit";

/**
 * Admin-scoped password reset request.
 *
 * A reset token/email is ONLY issued when the account:
 *  - exists and is not soft-deleted,
 *  - still holds the ADMIN role (a customer/vendor email submitted here gets the
 *    same generic response as an unknown email, so the endpoint cannot be used to
 *    probe which addresses belong to administrators), and
 *  - is ACTIVE.
 *
 * The email links to the dedicated /admin/reset-password page.
 */
export async function POST(req: Request) {
  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const rateLimit = checkRateLimit(`admin-forgot-pass:${ipAddress}`, { limit: 3, windowMs: 60 * 1000 });
  if (!rateLimit.success) {
    return NextResponse.json(
      { message: "Too many password reset requests. Please try again in 1 minute." },
      { status: 429 }
    );
  }

  const genericSuccessResponse = NextResponse.json({
    success: true,
    message: "If an administrator account exists for this email, recovery instructions have been sent.",
  });

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return genericSuccessResponse; // Prevent format enumeration
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await db.user.findFirst({
      where: { email: cleanEmail, deletedAt: null },
      include: { userRoles: { include: { role: true } } },
    });

    const roles = user?.userRoles.map((ur) => ur.role.name.toUpperCase()) || [];

    // Only existing, active administrators may be issued reset links. Everyone
    // else receives the same generic response (no admin-email enumeration).
    if (!user || !roles.includes("ADMIN")) {
      return genericSuccessResponse;
    }

    if (user.status !== "ACTIVE") {
      return genericSuccessResponse;
    }

    const rawResetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawResetToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.passwordResetToken.deleteMany({ where: { userId: user.id } });

    await db.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    await emailService.sendAdminPasswordResetEmail(user.email, rawResetToken, user.firstName);

    try {
      await db.auditLog.create({
        data: {
          actorId: user.id,
          action: "ADMIN_PASSWORD_RESET_REQUESTED",
          targetResource: `User:${user.id}`,
          metadata: { ipAddress },
        },
      });
    } catch (err) {
      console.error("Admin forgot password — could not write audit log (non-fatal):", err);
    }

    return genericSuccessResponse;
  } catch (error: any) {
    console.error("Admin forgot password API error:", error);
    return NextResponse.json({ message: "An error occurred processing your request." }, { status: 500 });
  }
}