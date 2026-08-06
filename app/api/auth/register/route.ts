import { NextResponse } from "next/server";
import { db, withDbRetry } from "@/lib/db";
import { hashPassword, setAuthCookies, formatUserResponse } from "@/lib/auth/authentication";
import { ensureRole, getPermissionsForRoles } from "@/lib/auth/authorization/permissions";

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

    // Check duplicate email
    const existingUserByEmail = await db.user.findFirst({
      where: { email, deletedAt: null }
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
    const newUser = await withDbRetry(() =>
      db.$transaction(async (tx) => {
        // Self-healing CUSTOMER role resolution
        const role = await ensureRole(tx, "CUSTOMER");

      // Create User account
      const user = await tx.user.create({
        data: {
          email,
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

      return user;
    })
    );

    const roles = ["CUSTOMER"];
    const permissions = getPermissionsForRoles(roles);

    // Set secure HttpOnly cookies
    await setAuthCookies({
      userId: newUser.id,
      email: newUser.email,
      firstName,
      lastName,
      roles,
      permissions
    });

    return NextResponse.json({
      success: true,
      user: formatUserResponse(newUser, roles, permissions)
    });

  } catch (error: any) {
    console.error("Registration API error:", error);
    if (error?.code === "P1001" || error?.message?.includes("Can't reach database server")) {
      return NextResponse.json(
        { message: "Cannot connect to database. Please ensure DATABASE_URL environment setting is set correctly on Render." },
        { status: 503 }
      );
    }
    return NextResponse.json({ message: error.message || "Registration failed" }, { status: 500 });
  }
}
