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

  // 2. Seed Official Store Categories
  const OFFICIAL_STORE_CATEGORIES = [
    { name: "Electronics & Gadget", slug: "electronics-gadget", description: "Consumer electronics, smartphones, accessories, computing, and home entertainment." },
    { name: "Home & Living", slug: "home-living", description: "Furniture, home decor, kitchenware, bedding, lighting, and home improvement." },
    { name: "Fashion & Appeal", slug: "fashion-appeal", description: "Clothing, footwear, jewelry, watches, bags, and fashion accessories." },
    { name: "Beauty & Personal Care", slug: "beauty-personal-care", description: "Cosmetics, skincare, haircare, fragrances, and personal grooming products." },
    { name: "Food & Gorrices", slug: "food-gorrices", description: "Fresh produce, packaged foods, beverages, snacks, and daily household essentials." },
    { name: "Pharmacy & Health", slug: "pharmacy-health", description: "Over-the-counter health products, vitamins, supplements, and medical wellness supplies." },
    { name: "Automotive & Automobile", slug: "automotive-automobile", description: "Vehicle parts, auto accessories, car care, tools, and automotive electronics." },
    { name: "Sorts & Fitness", slug: "sorts-fitness", description: "Sports gear, outdoor equipment, athletic wear, fitness instruments, and activewear." },
    { name: "Books & Stationery", slug: "books-stationery", description: "Educational books, literature, office supplies, art materials, and stationery items." },
  ];

  for (const cat of OFFICIAL_STORE_CATEGORIES) {
    await prisma.storeCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: { name: cat.name, slug: cat.slug, description: cat.description },
    });
  }

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
