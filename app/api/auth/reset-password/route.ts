import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/authentication";
import { hashToken, revokeAllUserSessions } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(req: Request) {
  const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";

  // Rate Limiting (5 attempts per minute per IP)
  const rateLimit = checkRateLimit(`reset-pass:${ipAddress}`, { limit: 5, windowMs: 60 * 1000 });
  if (!rateLimit.success) {
    return NextResponse.json(
      { message: "Too many attempts. Please try again in 1 minute." },
      { status: 429 }
    );
  }

  try {
    const { token, password, confirmPassword } = await req.json();

    if (!token || typeof token !== "string" || !password || typeof password !== "string") {
      return NextResponse.json({ message: "Token and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 });
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    // Hash token candidate for secure database lookup
    const tokenHash = hashToken(token);

    const resetRecord = await db.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });

    if (!resetRecord || resetRecord.usedAt || new Date() > resetRecord.expiresAt) {
      return NextResponse.json({ message: "Invalid or expired password reset token" }, { status: 400 });
    }

    const newPasswordHash = await hashPassword(password);

    // Atomically update password, invalidate reset token, and revoke all active sessions
    await db.$transaction(async (tx) => {
      // 1. Update user password
      await tx.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash: newPasswordHash }
      });

      // 2. Mark reset token as used
      await tx.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() }
      });

      // 3. Write Audit Log
      await tx.auditLog.create({
        data: {
          actorId: resetRecord.userId,
          action: "PASSWORD_RESET_COMPLETED",
          targetResource: `User:${resetRecord.userId}`,
          metadata: { ipAddress }
        }
      });
    });

    // 4. Revoke all existing sessions for security
    await revokeAllUserSessions(resetRecord.userId);

    return NextResponse.json({
      success: true,
      message: "Password reset successful! Please log in with your new password."
    });
  } catch (error: any) {
    console.error("Reset password API error:", error);
    return NextResponse.json({ message: "An error occurred resetting your password." }, { status: 500 });
  }
}
