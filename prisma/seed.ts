import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create Roles
  const customerRole = await prisma.role.upsert({
    where: { name: "CUSTOMER" },
    update: {},
    create: { name: "CUSTOMER", description: "Standard shopper" },
  });

  const vendorRole = await prisma.role.upsert({
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

  // 1b. Create Admin User
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

  // 2. Create Sample Vendor User & Vendor Store
  const vendorUser = await prisma.user.upsert({
    where: { email: "vendor@africart.com" },
    update: {
      passwordHash,
      status: "ACTIVE",
      emailVerified: true,
      emailVerificationStatus: "VERIFIED",
    },
    create: {
      email: "vendor@africart.com",
      firstName: "Kofi",
      lastName: "Mensah",
      passwordHash,
      status: "ACTIVE",
      emailVerified: true,
      emailVerificationStatus: "VERIFIED",
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: vendorUser.id, roleId: vendorRole.id } },
    update: {},
    create: { userId: vendorUser.id, roleId: vendorRole.id },
  });

  const vendorProfile = await prisma.vendorProfile.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      businessName: "AfriCrafts Studio",
      businessCategory: "Arts & Crafts",
      country: "Ghana",
      region: "Greater Accra",
      city: "Accra",
      businessAddress: "12 Independence Avenue, Accra",
      identityVerified: true,
      identityVerificationStatus: "VERIFIED",
      businessVerified: true,
      businessVerificationStatus: "VERIFIED",
    },
  });

  const store = await prisma.store.upsert({
    where: { slug: "africrafts-studio" },
    update: {},
    create: {
      vendorProfileId: vendorProfile.id,
      name: "AfriCrafts Studio",
      slug: "africrafts-studio",
      description: "Authentic African handcrafted art, jewelry, fashion, and home decor.",
      category: "Arts & Crafts",
      logo: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=150&h=150&fit=crop",
      banner: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&h=400&fit=crop",
    },
  });

  // 3. Create Sample Customer User & Profile
  const customerUser = await prisma.user.upsert({
    where: { email: "customer@africart.com" },
    update: {
      passwordHash,
      status: "ACTIVE",
      emailVerified: true,
      emailVerificationStatus: "VERIFIED",
    },
    create: {
      email: "customer@africart.com",
      firstName: "Ama",
      lastName: "Osei",
      passwordHash,
      status: "ACTIVE",
      emailVerified: true,
      emailVerificationStatus: "VERIFIED",
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: customerUser.id, roleId: customerRole.id } },
    update: {},
    create: { userId: customerUser.id, roleId: customerRole.id },
  });

  const customerProfile = await prisma.customerProfile.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: { userId: customerUser.id },
  });

  // Create default address
  await prisma.address.create({
    data: {
      customerProfileId: customerProfile.id,
      type: "shipping",
      firstName: "Ama",
      lastName: "Osei",
      phone: "+233241234567",
      streetAddress: "45 Oxford Street, Osu",
      city: "Accra",
      region: "Greater Accra",
      country: "Ghana",
      isDefault: true,
    },
  });

  // 4. Create Categories
  const categoriesData = [
    { name: "Fashion & Apparel", slug: "fashion-apparel", description: "Traditional and modern African attire, batik, Kente, and accessories." },
    { name: "Art & Crafts", slug: "art-crafts", description: "Handmade sculptures, wood carvings, beadwork, and paintings." },
    { name: "Beauty & Wellness", slug: "beauty-wellness", description: "Natural Shea butter, black soap, essential oils, and organic skincare." },
    { name: "Home & Living", slug: "home-living", description: "African baskets, woven rugs, pottery, and decorative items." },
    { name: "Electronics & Tech", slug: "electronics-tech", description: "Gadgets, accessories, smart devices, and power solutions." },
  ];

  const categories = [];
  for (const catData of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: {},
      create: catData,
    });
    categories.push(cat);
  }

  // 5. Create Sample Products
  const sampleProducts = [
    {
      name: "Handwoven Kente Cloth Stole",
      slug: "handwoven-kente-cloth-stole",
      description: "Authentic handwoven Ashanti Kente cloth stealing vibrance and culture. Perfect for special occasions and celebrations.",
      price: 85.0,
      categoryName: "Fashion & Apparel",
      categoryId: categories[0].id,
      images: ["https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=600&h=600&fit=crop"],
      stock: 25,
      rating: 4.9,
      numReviews: 12,
      isFeatured: true,
    },
    {
      name: "Organic Raw African Black Soap",
      slug: "organic-raw-african-black-soap",
      description: "100% natural, handcrafted black soap infused with unrefined shea butter, cocoa pod ash, and coconut oil for radiant skin.",
      price: 18.5,
      categoryName: "Beauty & Wellness",
      categoryId: categories[2].id,
      images: ["https://images.unsplash.com/photo-1607006482172-3ba983050c26?w=600&h=600&fit=crop"],
      stock: 80,
      rating: 4.8,
      numReviews: 45,
      isFeatured: true,
    },
    {
      name: "Handcarved Wooden Ashanti Stool",
      slug: "handcarved-wooden-ashanti-stool",
      description: "Traditional royal Ashanti stool handcarved from durable mahogany wood with intricate symbolic motifs.",
      price: 140.0,
      categoryName: "Art & Crafts",
      categoryId: categories[1].id,
      images: ["https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&h=600&fit=crop"],
      stock: 10,
      rating: 5.0,
      numReviews: 8,
      isFeatured: true,
    },
    {
      name: "Bolgatanga Woven Bolga Basket",
      slug: "bolgatanga-woven-bolga-basket",
      description: "Durable and colorful market tote basket handwoven from elephant grass in Northern Ghana.",
      price: 45.0,
      categoryName: "Home & Living",
      categoryId: categories[3].id,
      images: ["https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=600&h=600&fit=crop"],
      stock: 35,
      rating: 4.7,
      numReviews: 19,
      isFeatured: true,
    },
    {
      name: "Unrefined Pure Shea Butter (500g)",
      slug: "unrefined-pure-shea-butter-500g",
      description: "Grade-A unrefined yellow shea butter ethically sourced from women cooperatives in Tamale.",
      price: 22.0,
      categoryName: "Beauty & Wellness",
      categoryId: categories[2].id,
      images: ["https://images.unsplash.com/photo-1608248597260-2646c05d762e?w=600&h=600&fit=crop"],
      stock: 120,
      rating: 4.9,
      numReviews: 34,
      isFeatured: false,
    },
  ];

  for (const prodData of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: prodData.slug },
      update: {},
      create: {
        ...prodData,
        storeId: store.id,
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
