import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  const rateLimit = checkRateLimit(`verify-email:${ipAddress}`, { limit: 10, windowMs: 60 * 1000 });
  if (!rateLimit.success) {
    return NextResponse.json(
      { message: "Too many attempts. Please try again in 1 minute." },
      { status: 429 }
    );
  }

  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token || typeof token !== "string" || token.length < 20) {
      return NextResponse.json({ message: "Verification token is required." }, { status: 400 });
    }

    const tokenHash = hashToken(token);
    const record = await db.emailVerificationToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!record || record.usedAt || new Date() > record.expiresAt) {
      return NextResponse.json({ message: "Invalid or expired verification link." }, { status: 400 });
    }

    if (record.user.emailVerified) {
      // Idempotent success for already-verified accounts (e.g. link re-opened).
      await db.emailVerificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      });
      return NextResponse.json({ success: true, message: "Email already verified." });
    }

    await db.$transaction(async (tx) => {
      await tx.emailVerificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      });
      await tx.user.update({
        where: { id: record.userId },
        data: {
          emailVerified: true,
          emailVerificationStatus: "VERIFIED",
          verificationToken: null,
          verificationTokenExpires: null,
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: record.userId,
          action: "EMAIL_VERIFIED",
          targetResource: `User:${record.userId}`,
          metadata: { ipAddress },
        },
      });
    });

    return NextResponse.json({ success: true, message: "Email verified successfully." });
  } catch (error: any) {
    console.error("Verify email API error:", error);
    return NextResponse.json({ message: "An error occurred verifying your email." }, { status: 500 });
  }
}