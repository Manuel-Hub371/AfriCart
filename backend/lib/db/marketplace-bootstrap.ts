// Idempotent demo-marketplace bootstrap.
//
// Shared by:
//   - prisma/seed.ts  (runs inside the Render deploy build)
//   - instrumentation.ts (runs on every server start)
//
// Creates a demo vendor + an ACTIVE/public store + a few ACTIVE products ONLY
// when the database has no publicly visible store yet. Purely additive: it never
// modifies or removes existing records (users, stores, products are all guarded
// by "create only if missing"), and it never writes to Cloudinary.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const DEMO_PRODUCTS = [
  { name: "Premium Bluetooth Headphones Pro", slug: "premium-bluetooth-headphones-pro", price: 449.99, description: "Over-ear wireless headphones with active noise cancellation and 40h battery life.", stock: 25 },
  { name: "Smart Fitness Watch X2", slug: "smart-fitness-watch-x2", price: 299.99, description: "Heart-rate tracking, GPS, and water resistance up to 50m.", stock: 40 },
  { name: "4K Ultra HD Action Camera", slug: "4k-ultra-hd-action-camera", price: 189.99, description: "Waterproof 4K action camera with image stabilization.", stock: 15 },
  { name: "Wireless Charging Pad Trio", slug: "wireless-charging-pad-trio", price: 59.99, description: "Charge phone, earbuds, and smartwatch simultaneously.", stock: 60 },
];

export interface MarketplaceBootstrapResult {
  seeded: boolean;
  reason?: string;
}

export async function ensureDemoMarketplace(prisma: PrismaClient): Promise<MarketplaceBootstrapResult> {
  const email = (process.env.DEMO_VENDOR_EMAIL || "demo@africart.com").trim().toLowerCase();
  const password = process.env.DEMO_VENDOR_PASSWORD || "AfriCart123!";
  const storeSlug = process.env.DEMO_STORE_SLUG || "africart-demo-store";

  const customerRole = await prisma.role.upsert({
    where: { name: "CUSTOMER" },
    update: {},
    create: { name: "CUSTOMER", description: "Standard shopper" },
  });
  const vendorRole = await prisma.role.upsert({
    where: { name: "VENDOR" },
    update: {},
    create: { name: "VENDOR", description: "Store vendor" },
  });

  const passwordHash = await bcrypt.hash(password, 10);

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

  for (const p of DEMO_PRODUCTS) {
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

  return { seeded: true };
}

/**
 * Seed the demo marketplace only when the database has no publicly visible
 * store yet (deleted = false + ACTIVE + isPublic). Legacy PENDING_APPROVAL /
 * suspended stores do NOT count as "marketplace populated".
 */
export async function ensureDemoMarketplaceIfEmpty(
  prisma: PrismaClient
): Promise<MarketplaceBootstrapResult> {
  const publicStoreCount = await prisma.store.count({
    where: { deletedAt: null, status: "ACTIVE", isPublic: true },
  });
  if (publicStoreCount > 0) {
    return { seeded: false, reason: "marketplace_already_populated" };
  }
  return ensureDemoMarketplace(prisma);
}