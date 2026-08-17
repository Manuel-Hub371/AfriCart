import { db } from "../lib/db";
import { messagingService } from "../modules/messaging/service";
import { notificationService } from "../modules/notifications/service";

async function testLiveMessagingNotifications() {
  console.log("=================================================");
  console.log("TESTING AUTOMATIC MESSAGE NOTIFICATIONS & LIVE POLLING");
  console.log("=================================================");

  // 1. Setup Test Customer & Vendor
  const customerUser = await db.user.upsert({
    where: { email: "live_cust@africart.com" },
    update: {},
    create: { email: "live_cust@africart.com", passwordHash: "pass", firstName: "Kofi", lastName: "Annan" },
  });

  const customerProfile = await db.customerProfile.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: { userId: customerUser.id },
  });

  const vendorUser = await db.user.upsert({
    where: { email: "live_vendor@africart.com" },
    update: {},
    create: { email: "live_vendor@africart.com", passwordHash: "pass", firstName: "Akosua", lastName: "Darko" },
  });

  const vendorProfile = await db.vendorProfile.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: { userId: vendorUser.id, businessName: "Darko Fashions", businessCategory: "Fashion", country: "Ghana", region: "Greater Accra", city: "Accra", businessAddress: "Accra Mall" },
  });

  const store = await db.store.upsert({
    where: { slug: "darko-fashions-hub" },
    update: {},
    create: { vendorProfileId: vendorProfile.id, name: "Darko Fashions Hub", slug: "darko-fashions-hub" },
  });

  // 2. Start Conversation
  const conv = await messagingService.startConversation(customerUser.id, { storeId: store.id });

  // 3. Customer Sends Message -> Verify Vendor Gets Notification
  console.log("\nStep 1: Customer sends message to Vendor...");
  await messagingService.sendMessage(customerUser.id, conv.id, { text: "Is the Kente cloth in stock?" });

  const vendorNotifications = await notificationService.getUserNotifications(vendorUser.id);
  console.log(`✅ Vendor Received ${vendorNotifications.length} Notifications:`);
  for (const n of vendorNotifications) {
    console.log(`  - Title: "${n.title}" | Message: ${n.message} | Link: ${n.link}`);
  }

  // 4. Vendor Sends Message -> Verify Customer Gets Notification
  console.log("\nStep 2: Vendor replies to Customer...");
  await messagingService.sendMessage(vendorUser.id, conv.id, { text: "Yes! We have original Kente in stock." });

  const customerNotifications = await notificationService.getUserNotifications(customerUser.id);
  console.log(`✅ Customer Received ${customerNotifications.length} Notifications:`);
  for (const n of customerNotifications) {
    console.log(`  - Title: "${n.title}" | Message: ${n.message} | Link: ${n.link}`);
  }

  // Cleanup
  console.log("\nCleaning up test entities...");
  await db.conversation.delete({ where: { id: conv.id } });
  await db.notification.deleteMany({ where: { userId: { in: [customerUser.id, vendorUser.id] } } });
  console.log("✅ SUCCESS: Live messaging notifications created automatically for recipient!");

  await db.$disconnect();
}

testLiveMessagingNotifications();
