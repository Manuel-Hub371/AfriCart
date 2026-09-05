import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { hashToken } from "@/lib/auth/session";
import { emailService } from "@/lib/email/email-service";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(req: Request) {
  const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";

  // Rate Limiting (3 attempts per minute per IP)
  const rateLimit = checkRateLimit(`forgot-pass:${ipAddress}`, { limit: 3, windowMs: 60 * 1000 });
  if (!rateLimit.success) {
    return NextResponse.json(
      { message: "Too many password reset requests. Please try again in 1 minute." },
      { status: 429 }
    );
  }

  try {
    const { email } = await req.json();

    const genericSuccessResponse = NextResponse.json({
      success: true,
      message: "If an account exists for this email, recovery instructions have been sent."
    });

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return genericSuccessResponse; // Prevent email format enumeration
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await db.user.findFirst({
      where: { email: cleanEmail, deletedAt: null }
    });

    if (!user) {
      // Return generic response to prevent email enumeration
      return genericSuccessResponse;
    }

    // Generate cryptographically random reset token (raw token sent to user email)
    const rawResetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawResetToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete previous unused reset tokens for this user
    await db.passwordResetToken.deleteMany({
      where: { userId: user.id }
    });

    // Create new hashed password reset token in database
    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      }
    });

    // Send reset email via email service
    await emailService.sendPasswordResetEmail(user.email, rawResetToken, user.firstName);

    // Audit Log
    await db.auditLog.create({
      data: {
        actorId: user.id,
        action: "PASSWORD_RESET_REQUESTED",
        targetResource: `User:${user.id}`,
        metadata: {
          ipAddress
        }
      }
    });

    return genericSuccessResponse;
  } catch (error: any) {
    console.error("Forgot password API error:", error);
    return NextResponse.json({ message: "An error occurred processing your request." }, { status: 500 });
  }
}
