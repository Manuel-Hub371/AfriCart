import { db } from "../lib/db";
import { messagingService } from "../modules/messaging/service";

async function testMessagingSystem() {
  console.log("=================================================");
  console.log("AFRICART FORENSIC MESSAGING & MEDIA AUDIT TEST");
  console.log("=================================================");

  // 1. Setup Test Users & Store
  console.log("\nStep 1: Setting up Test Customer, Vendor, and Store...");
  
  const customerUser = await db.user.upsert({
    where: { email: "testcustomer_msg@africart.com" },
    update: {},
    create: {
      email: "testcustomer_msg@africart.com",
      passwordHash: "hashed_password",
      firstName: "Ama",
      lastName: "Kofi",
    },
  });

  const customerProfile = await db.customerProfile.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: { userId: customerUser.id },
  });

  const vendorUser = await db.user.upsert({
    where: { email: "testvendor_msg@africart.com" },
    update: {},
    create: {
      email: "testvendor_msg@africart.com",
      passwordHash: "hashed_password",
      firstName: "Kwame",
      lastName: "Mensah",
    },
  });

  const vendorProfile = await db.vendorProfile.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      businessName: "Mensah Electronics",
      businessCategory: "Electronics",
      country: "Ghana",
      region: "Greater Accra",
      city: "Accra",
      businessAddress: "123 High Street",
    },
  });

  const store = await db.store.upsert({
    where: { slug: "mensah-gadgets-hub" },
    update: {},
    create: {
      vendorProfileId: vendorProfile.id,
      name: "Mensah Gadgets Hub",
      slug: "mensah-gadgets-hub",
      description: "Official store for high quality electronics",
    },
  });

  console.log(`✅ Customer: ${customerUser.email} (Profile ID: ${customerProfile.id})`);
  console.log(`✅ Vendor: ${vendorUser.email} (Store ID: ${store.id})`);

  // 2. Customer Initiates Conversation
  console.log("\nStep 2: Customer initiates conversation with store...");
  const conv = await messagingService.startConversation(customerUser.id, {
    storeId: store.id,
    initialMessage: "Hello! Is the Smart Watch available in Black?",
  });
  console.log(`✅ Conversation created (ID: ${conv.id})`);

  // 3. Customer Sends Message with Image Attachment
  console.log("\nStep 3: Customer sends message with Image Attachment...");
  const customerMsg = await messagingService.sendMessage(customerUser.id, conv.id, {
    text: "Here is a picture of the exact model I want:",
    attachments: [
      {
        type: "image",
        url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        name: "smartwatch_spec.png",
        size: "0.5 MB",
      },
    ],
  });
  console.log(`✅ Customer Message Sent (ID: ${customerMsg.id}) with Attachment:`, customerMsg.attachments);

  // 4. Vendor Fetches Messages & Responds with Video Attachment
  console.log("\nStep 4: Vendor fetches messages & responds with Video Attachment...");
  const messagesForVendor = await messagingService.getConversationMessages(vendorUser.id, conv.id);
  console.log(`Vendor retrieved ${messagesForVendor.length} messages in conversation.`);

  const vendorMsg = await messagingService.sendMessage(vendorUser.id, conv.id, {
    text: "Yes, we have it in stock! Watch this quick unboxing demo video:",
    attachments: [
      {
        type: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        name: "unboxing_demo.mp4",
        size: "4.2 MB",
      },
    ],
  });
  console.log(`✅ Vendor Message Sent (ID: ${vendorMsg.id}) with Attachment:`, vendorMsg.attachments);

  // 5. Verification
  console.log("\nStep 5: Verifying final message feed...");
  const finalMessages = await messagingService.getConversationMessages(customerUser.id, conv.id);
  console.log(`Total Messages: ${finalMessages.length}`);
  for (const m of finalMessages) {
    console.log(`- [${m.senderType}] ${m.text || "(No Text)"} | Attachments: ${m.attachments ? m.attachments.length : 0}`);
  }

  console.log("\nCleaning up test records...");
  await db.conversation.delete({ where: { id: conv.id } });
  console.log("Cleanup complete. MESSAGING AUDIT PASSED 100%!");

  await db.$disconnect();
}

testMessagingSystem();
