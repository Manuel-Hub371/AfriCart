import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function checkAdmin() {
  console.log("Checking DATABASE_URL:", process.env.DATABASE_URL);
  
  const user = await prisma.user.findFirst({
    where: { email: "admin@africart.com" },
    include: {
      userRoles: {
        include: { role: true }
      }
    }
  });

  if (!user) {
    console.log("RESULT: Admin user does NOT exist in database!");
    return;
  }

  console.log("RESULT: Admin user EXISTS in database.");
  console.log("Email:", user.email);
  console.log("Password Hash in DB:", user.passwordHash);
  
  const match = await bcrypt.compare("password123", user.passwordHash);
  console.log("Password 'password123' comparison result:", match);
  
  const roles = user.userRoles.map(ur => ur.role.name);
  console.log("Assigned roles:", roles);
}

checkAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
