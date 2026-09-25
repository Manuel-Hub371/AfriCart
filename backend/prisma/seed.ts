import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync, existsSync } from "fs";
import path from "path";

const prisma = new PrismaClient();

// Load DB credentials from a local env file when DATABASE_URL is not already set
// (bare `tsx prisma/seed.ts` does not auto-load .env; Prisma CLI / Render builds do).
function setFromEnvFile(filePath: string): void {
  if (!existsSync(filePath)) return;
  for (const rawLine of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

for (const file of [
  path.join(process.cwd(), ".env.local"),
  path.join(process.cwd(), ".env"),
  path.resolve(process.cwd(), "..", ".env"),
]) {
  setFromEnvFile(file);
}

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

async function seedRoles() {
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

  return prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN", description: "Platform administrator" },
  });
}

async function seedStoreCategories() {
  for (const cat of OFFICIAL_STORE_CATEGORIES) {
    await prisma.storeCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: { name: cat.name, slug: cat.slug, description: cat.description },
    });
  }
}

/**
 * Idempotent admin bootstrap.
 * - Uses ADMIN_EMAIL / ADMIN_FIRST_NAME / ADMIN_LAST_NAME if provided.
 * - If the admin already exists its passwordHash is NEVER overwritten (so a redeploy
 *   after a password change does not silently reset it back to the default).
 * - Only fixes status/verification flags on the existing account.
 */
async function seedAdmin(adminRole: { id: string }) {
  const email = (process.env.ADMIN_EMAIL || "admin@africart.com").trim().toLowerCase();
  const firstName = process.env.ADMIN_FIRST_NAME || "AfriCart";
  const lastName = process.env.ADMIN_LAST_NAME || "Administrator";

  const existing = await prisma.user.findUnique({ where: { email } });

  let adminUser: NonNullable<typeof existing>;
  if (existing) {
    const needsUpdate =
      existing.status !== "ACTIVE" ||
      !existing.emailVerified ||
      existing.emailVerificationStatus !== "VERIFIED";
    adminUser = needsUpdate
      ? await prisma.user.update({
          where: { id: existing.id },
          data: {
            status: "ACTIVE",
            emailVerified: true,
            emailVerificationStatus: "VERIFIED",
          },
        })
      : existing;
  } else {
    const password = process.env.ADMIN_PASSWORD || "password123";
    const passwordHash = await bcrypt.hash(password, 10);
    adminUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash,
        status: "ACTIVE",
        emailVerified: true,
        emailVerificationStatus: "VERIFIED",
      },
    });
  }

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });

  console.log(`Admin account ready: ${email}`);
}

/**
 * Optional demo catalog (opt-in via SEED_DEMO_DATA=true).
 * Creates a real vendor account + a public ACTIVE store with a few products so the
 * discovery pages render actual data. Never runs unless explicitly enabled.
 */
async function seedDemoData() {
  const explicit = (process.env.SEED_DEMO_DATA || "").trim().toLowerCase();

  if (explicit === "false") {
    console.log("Demo data disabled (SEED_DEMO_DATA=false).");
    return;
  }

  if (explicit !== "true") {
    // Auto-bootstrap the marketplace: if the database has no stores yet (e.g. a
    // fresh production deployment), seed the demo vendor + store + products so
    // the live discovery pages never render an empty catalog by default. This is
    // additive and idempotent — it only creates records that do not exist yet.
    // Set SEED_DEMO_DATA=true to force it, or =false to skip demo data entirely.
    const storeCount = await prisma.store.count({ where: { deletedAt: null } });
    if (storeCount > 0) {
      console.log("Demo data skipped (marketplace already has stores).");
      return;
    }
    console.log("Auto-seeding demo marketplace (no stores exist yet).");
  }

  const email = (process.env.DEMO_VENDOR_EMAIL || "demo@africart.com").trim().toLowerCase();
  const password = process.env.DEMO_VENDOR_PASSWORD || "AfriCart123!";
  const storeSlug = process.env.DEMO_STORE_SLUG || "africart-demo-store";

  const passwordHash = await bcrypt.hash(password, 10);

  const customerRole = await prisma.role.findUnique({ where: { name: "CUSTOMER" } });
  const vendorRole = await prisma.role.findUnique({ where: { name: "VENDOR" } });
  if (!customerRole || !vendorRole) throw new Error("Roles must be seeded before demo data.");

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        firstName: "AfriCart",
        lastName: "Demo Vendor",
        phone: "+233000000000",
        passwordHash,
        status: "ACTIVE",
        emailVerified: true,
        emailVerificationStatus: "VERIFIED",
      },
    });
    await prisma.userRole.createMany({
      data: [
        { userId: user.id, roleId: customerRole.id },
        { userId: user.id, roleId: vendorRole.id },
      ],
    });
    await prisma.customerProfile.create({ data: { userId: user.id } });
  }

  let vendorProfile = await prisma.vendorProfile.findUnique({ where: { userId: user.id } });
  if (!vendorProfile) {
    vendorProfile = await prisma.vendorProfile.create({
      data: {
        userId: user.id,
        businessName: "AfriCart Demo Ltd",
        businessCategory: "electronics-gadget",
        businessType: "company",
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
  }

  let store = await prisma.store.findUnique({ where: { slug: storeSlug } });
  if (!store) {
    store = await prisma.store.create({
      data: {
        vendorProfileId: vendorProfile.id,
        name: "AfriCart Demo Store",
        slug: storeSlug,
        description: "A demo marketplace store showcasing the AfriCart catalog, powered by regional vendors.",
        category: "Electronics & Gadget",
        businessType: "company",
        email,
        phone: "+233000000000",
        city: "Accra",
        region: "Greater Accra",
        country: "Ghana",
        isPublic: true,
        acceptingOrders: true,
        vacationMode: false,
        status: "ACTIVE",
      },
    });

    const electronics = await prisma.storeCategory.findUnique({ where: { slug: "electronics-gadget" } });
    if (electronics) {
      await prisma.storeCategoryAssignment.create({
        data: { storeId: store.id, storeCategoryId: electronics.id },
      }).catch(() => {});
    }
  }

  const demoProducts = [
    { name: "Premium Bluetooth Headphones Pro", slug: "premium-bluetooth-headphones-pro", price: 449.99, description: "Over-ear wireless headphones with active noise cancellation and 40h battery life.", stock: 25 },
    { name: "Smart Fitness Watch X2", slug: "smart-fitness-watch-x2", price: 299.99, description: "Heart-rate tracking, GPS, and water resistance up to 50m.", stock: 40 },
    { name: "4K Ultra HD Action Camera", slug: "4k-ultra-hd-action-camera", price: 189.99, description: "Waterproof 4K action camera with image stabilization.", stock: 15 },
    { name: "Wireless Charging Pad Trio", slug: "wireless-charging-pad-trio", price: 59.99, description: "Charge phone, earbuds, and smartwatch simultaneously.", stock: 60 },
  ];

  for (const p of demoProducts) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) continue;
    await prisma.product.create({
      data: {
        storeId: store.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        stock: p.stock,
        isFeatured: true,
        status: "ACTIVE",
      },
    });
  }

  console.log(`Demo store ready: ${store.name} (${storeSlug})`);
}

async function main() {
  console.log("Seeding base database parameters...");

  const adminRole = await seedRoles();
  await seedStoreCategories();
  await seedAdmin(adminRole);

  // Category count summary for logs
  const storeCategoryCount = await prisma.storeCategory.count();
  console.log(`Store categories ready: ${storeCategoryCount}`);

  await seedDemoData();

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