import { NextResponse } from "next/server";
import { db, withDbRetry } from "@/lib/db";
import { hashPassword, setAuthCookies, formatUserResponse } from "@/lib/auth/authentication";
import { ensureRole, getPermissionsForRoles } from "@/lib/auth/authorization/permissions";
import { createEmailVerificationToken } from "@/lib/auth/email-verification";
import { createServerSession } from "@/lib/auth/session";
import { emailService } from "@/lib/email/email-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, password, confirmPassword } = body;

    // Simple Server-side validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: "All required fields must be filled" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    // Normalize email so it matches the login lookup (login lowercases input).
    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate email
    const existingUserByEmail = await db.user.findFirst({
      where: { email: cleanEmail, deletedAt: null }
    });
    if (existingUserByEmail) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 400 });
    }

    // Check duplicate phone
    if (phone) {
      const existingUserByPhone = await db.user.findFirst({
        where: { phone, deletedAt: null }
      });
      if (existingUserByPhone) {
        return NextResponse.json({ message: "An account with this phone number already exists" }, { status: 400 });
      }
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create user and profile in transaction with retry
    let rawVerificationToken: string | null = null;
    const newUser = await withDbRetry(() =>
      db.$transaction(async (tx) => {
        // Self-healing CUSTOMER role resolution
        const role = await ensureRole(tx, "CUSTOMER");

      // Create User account
      const user = await tx.user.create({
        data: {
          email: cleanEmail,
          phone: phone || null,
          passwordHash,
          firstName,
          lastName,
          status: "ACTIVE", // Active account status by default
          emailVerified: false,
          emailVerificationStatus: "UNVERIFIED",
        }
      });

      // Assign Customer Role
      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id
        }
      });

      // Create Customer Profile
      await tx.customerProfile.create({
        data: {
          userId: user.id
        }
      });

      // Write Audit Log
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "USER_REGISTER",
          targetResource: `User:${user.id}`,
          metadata: {
            role: "CUSTOMER",
            firstName,
            lastName
          }
        }
      });

      // Issue one-time email verification token (hashed in DB)
      rawVerificationToken = await createEmailVerificationToken(tx, user.id);

      return user;
    })
    );

    const roles = ["CUSTOMER"];
    const permissions = getPermissionsForRoles(roles);

    // Create a server-side session so the issued tokens have full session security
    // (matches the login flow). Non-fatal: registration must still succeed if this fails.
    let sessionId: string | undefined;
    try {
      const session = await createServerSession(newUser.id, req.headers.get("user-agent"), "127.0.0.1");
      sessionId = session.id;
    } catch (err) {
      console.error("Registration API — could not create server session (non-fatal):", err);
    }

    // Set secure HttpOnly cookies
    await setAuthCookies({
      userId: newUser.id,
      sessionId,
      email: newUser.email,
      firstName,
      lastName,
      roles,
      permissions
    });

    // Send verification email (non-fatal: account creation already succeeded)
    if (rawVerificationToken) {
      await emailService.sendEmailVerificationEmail(email, rawVerificationToken, firstName);
    }

    return NextResponse.json({
      success: true,
      user: formatUserResponse(newUser, roles, permissions)
    });

  } catch (error: any) {
    console.error("Registration API error:", error);
    if (
      error?.code === "P1000" ||
      error?.code === "P1001" ||
      error?.message?.includes("Authentication failed") ||
      error?.message?.includes("Can't reach database server")
    ) {
      return NextResponse.json(
        { message: "Invalid database credentials. Please copy the Internal Database URL directly from your Render Database Dashboard into DATABASE_URL." },
        { status: 503 }
      );
    }
    if (error?.code === "P2021" || error?.message?.includes("does not exist")) {
      return NextResponse.json(
        { message: "Database tables are not initialized. Run migrations: npx prisma migrate deploy (if baseline not applied yet: npx prisma migrate resolve --applied 0_init first)" },
        { status: 503 }
      );
    }
    return NextResponse.json({ message: error.message || "Registration failed" }, { status: 500 });
  }
}
