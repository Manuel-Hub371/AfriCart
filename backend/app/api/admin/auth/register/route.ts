import { NextResponse } from "next/server";
import { db, withDbRetry } from "@/lib/db";
import { hashPassword } from "@/lib/auth/authentication";
import { checkRateLimit } from "@/lib/security/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Dedicated admin registration.
 *
 * Security rules (server-enforced — the client can never upgrade itself):
 *  - The created account starts with status PENDING, a single ADMIN_ACCESS_REQUESTED
 *    audit row and NO roles at all. It is NOT granted the ADMIN role here.
 *  - An AdministratorApprovalRequest row is created and must be approved by an
 *    existing administrator before the account gains the ADMIN role / can log in
 *    through /api/admin/auth/login.
 *  - No auth cookies/session are issued on registration (there is nothing to
 *    authenticate yet).
 */
export async function POST(req: Request) {
  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const rateLimit = checkRateLimit(`admin-register:${ipAddress}`, { limit: 5, windowMs: 60 * 1000 });
  if (!rateLimit.success) {
    return NextResponse.json(
      { message: "Too many registration attempts. Please try again in 1 minute." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  try {
    const body = await req.json();
    const { firstName, lastName, email, password, confirmPassword } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: "All required fields must be filled" }, { status: 400 });
    }

    if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ message: "A valid email address is required" }, { status: 400 });
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await db.user.findFirst({
      where: { email: cleanEmail, deletedAt: null },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const created = await withDbRetry(() =>
      db.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: cleanEmail,
            passwordHash,
            firstName,
            lastName,
            status: "PENDING",
            emailVerified: false,
            emailVerificationStatus: "UNVERIFIED",
          },
        });

        // NO role is ever assigned at registration time — an existing admin must
        // grant the ADMIN role through the approval queue.
        await tx.adminApprovalRequest.create({
          data: { userId: user.id },
        });

        await tx.auditLog.create({
          data: {
            actorId: user.id,
            action: "ADMIN_ACCESS_REQUESTED",
            targetResource: `User:${user.id}`,
            metadata: {
              firstName,
              lastName,
              email: cleanEmail,
              ipAddress,
            },
          },
        });

        return user;
      })
    );

    console.log(`[admin-auth] Admin access requested: ${cleanEmail} (user ${created.id})`);

    return NextResponse.json({
      success: true,
      message:
        "Your request for administrator access was submitted and is now pending review by an existing administrator.",
    });
  } catch (error: any) {
    console.error("Admin registration API error:", error);
    if (
      error?.code === "P1000" ||
      error?.code === "P1001" ||
      error?.message?.includes("Can't reach database server")
    ) {
      return NextResponse.json(
        { message: "Cannot connect to the database. Please verify the DATABASE_URL configuration on Render." },
        { status: 503 }
      );
    }
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
  }
}