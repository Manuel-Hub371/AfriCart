import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function safeDelete(modelName: string, deleteFn: () => Promise<any>) {
  try {
    await deleteFn();
  } catch (err) {
    // Model might not have records or might be optional
  }
}

async function main() {
  console.log("Starting complete database wipe for fresh restart...");

  // 1. Transactional & Product child tables
  await safeDelete("CampaignProduct", () => (prisma as any).campaignProduct.deleteMany());
  await safeDelete("Campaign", () => (prisma as any).campaign.deleteMany());
  await safeDelete("Deal", () => (prisma as any).deal ? (prisma as any).deal.deleteMany() : Promise.resolve());
  await safeDelete("ProductShipping", () => prisma.productShipping.deleteMany());
  await safeDelete("OrderItem", () => prisma.orderItem.deleteMany());
  await safeDelete("Order", () => prisma.order.deleteMany());
  await safeDelete("CartItem", () => prisma.cartItem.deleteMany());
  await safeDelete("WishlistItem", () => prisma.wishlistItem.deleteMany());
  await safeDelete("Review", () => prisma.review.deleteMany());
  await safeDelete("ProductQuestion", () => prisma.productQuestion.deleteMany());
  await safeDelete("ProductVariant", () => prisma.productVariant.deleteMany());
  await safeDelete("Product", () => prisma.product.deleteMany());

  // 2. Policy & Store link tables
  await safeDelete("RefundPolicy", () => prisma.refundPolicy.deleteMany());
  await safeDelete("ReturnPolicy", () => prisma.returnPolicy.deleteMany());
  await safeDelete("WarrantyPolicy", () => prisma.warrantyPolicy.deleteMany());
  await safeDelete("ShippingPolicy", () => prisma.shippingPolicy.deleteMany());
  await safeDelete("PrivacyPolicy", () => prisma.privacyPolicy.deleteMany());
  await safeDelete("StorePolicy", () => prisma.storePolicy.deleteMany());
  await safeDelete("StoreCategoryAssignment", () => prisma.storeCategoryAssignment.deleteMany());
  await safeDelete("StoreFollow", () => prisma.storeFollow.deleteMany());

  // 3. Store, Verification, Profiles
  await safeDelete("Store", () => prisma.store.deleteMany());
  await safeDelete("VendorVerification", () => prisma.vendorVerification.deleteMany());
  await safeDelete("VendorPayoutProfile", () => prisma.vendorPayoutProfile.deleteMany());
  await safeDelete("VendorProfile", () => prisma.vendorProfile.deleteMany());
  await safeDelete("CustomerProfile", () => prisma.customerProfile.deleteMany());

  // 4. Logs & Communication
  await safeDelete("AuditLog", () => prisma.auditLog.deleteMany());
  await safeDelete("Notification", () => prisma.notification.deleteMany());
  await safeDelete("SupportTicket", () => prisma.supportTicket.deleteMany());
  await safeDelete("Message", () => prisma.message.deleteMany());
  await safeDelete("Conversation", () => prisma.conversation.deleteMany());

  // 5. User Roles & Accounts
  await safeDelete("UserRole", () => prisma.userRole.deleteMany());
  await safeDelete("User", () => prisma.user.deleteMany());

  console.log("Database wiped clean!");

  // 6. Seed System Roles
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

  // 7. Seed single clean Administrator Account
  const passwordHash = await bcrypt.hash("password123", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@africart.com",
      firstName: "AfriCart",
      lastName: "Administrator",
      passwordHash,
      status: "ACTIVE",
      emailVerified: true,
      emailVerificationStatus: "VERIFIED",
    },
  });

  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log("Fresh Restart Complete!");
  console.log("Created Admin Account:");
  console.log("  Email: admin@africart.com");
  console.log("  Password: password123");
}

main()
  .catch((e) => {
    console.error("Cleanup error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
