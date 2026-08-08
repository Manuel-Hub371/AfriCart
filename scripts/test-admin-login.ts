import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { verifyToken, generateAccessToken } from "../lib/auth/jwt";

const prisma = new PrismaClient();

async function testAdminLogin() {
  console.log("--- AUDITING ADMIN ACCOUNT & AUTHENTICATION FLOW ---");

  // 1. Audit User in Database
  const adminUser = await prisma.user.findFirst({
    where: { email: "admin@africart.com", deletedAt: null },
    include: {
      userRoles: {
        include: { role: true },
      },
    },
  });

  if (!adminUser) {
    console.error("FAIL: Admin user 'admin@africart.com' does NOT exist in database!");
    return;
  }

  console.log("✓ Admin User Exists:");
  console.log("  ID:", adminUser.id);
  console.log("  Email:", adminUser.email);
  console.log("  Status:", adminUser.status);
  console.log("  Email Verified:", adminUser.emailVerified);

  // 2. Audit Password Verification
  const passwordValid = await bcrypt.compare("password123", adminUser.passwordHash);
  console.log("✓ Password Verification ('password123'):", passwordValid ? "PASS" : "FAIL");

  // 3. Audit Roles & RBAC Mapping
  const roles = adminUser.userRoles.map((ur) => ur.role.name);
  console.log("✓ Assigned User Roles in DB:", roles);

  // 4. Audit Token Generation & Verification
  const tokenPayload = {
    userId: adminUser.id,
    email: adminUser.email,
    firstName: adminUser.firstName,
    lastName: adminUser.lastName,
    roles,
    permissions: ["ACCESS_ADMIN", "MANAGE_USERS", "VERIFY_VENDORS"],
  };

  const token = await generateAccessToken(tokenPayload);
  const decoded = await verifyToken(token);
  console.log("✓ JWT Token Generation & Edge Verification:", decoded ? "PASS" : "FAIL");
  if (decoded) {
    console.log("  Decoded Roles:", decoded.roles);
  }
}

testAdminLogin()
  .catch((e) => console.error("Test error:", e))
  .finally(async () => await prisma.$disconnect());
