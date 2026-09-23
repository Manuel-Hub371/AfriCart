import { NextResponse } from "next/server";
import { consumePasswordResetToken } from "@/lib/auth/password-reset";
import { checkRateLimit } from "@/lib/security/rate-limit";

/**
 * Admin password reset confirmation.
 *
 * Reuses the same token-validity + atomic-update logic as the customer flow
 * (`/api/auth/reset-password`) via consumePasswordResetToken. This endpoint is
 * the landing target for the /admin/reset-password page.
 */
export async function POST(req: Request) {
  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const rateLimit = checkRateLimit(`admin-reset-pass:${ipAddress}`, { limit: 5, windowMs: 60 * 1000 });
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

    const result = await consumePasswordResetToken({ token, newPassword: password, ipAddress });

    if (!result.ok) {
      return NextResponse.json(
        { message: result.message },
        { status: result.reason === "INVALID" ? 400 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successful! Please sign in with your new password.",
    });
  } catch (error: any) {
    console.error("Admin reset password API error:", error);
    return NextResponse.json({ message: "An error occurred resetting your password." }, { status: 500 });
  }
}