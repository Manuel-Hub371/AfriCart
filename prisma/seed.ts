import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding base database parameters...");

  // 1. Create Roles
  await prisma.role.upsert({
    where: { name: "CUSTOMER" },
    update: {},
    create: { name: "CUSTOMER", description: "Standard shopper" },
  });

  await prisma.role.upsert({
    where: { name: "VENDOR" },
    update: {},
    create: { name: "VENDOR", description: "Merchant store seller" },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN", description: "Platform administrator" },
  });

  const passwordHash = await bcrypt.hash("password123", 10);

  // 2. Create Default Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@africart.com" },
    update: {
      passwordHash,
      status: "ACTIVE",
      emailVerified: true,
      emailVerificationStatus: "VERIFIED",
    },
    create: {
      email: "admin@africart.com",
      firstName: "AfriCart",
      lastName: "Administrator",
      passwordHash,
      status: "ACTIVE",
      emailVerified: true,
      emailVerificationStatus: "VERIFIED",
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });

  console.log("Database base seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
