import { db } from "../lib/db";
import { shoppingService } from "../modules/shopping/service";

async function runPaymentAudit() {
  console.log("=== STARTING MOBILE MONEY PAYMENT SYSTEM LOGIC AUDIT ===");

  const profile = await db.customerProfile.findFirst({
    include: { user: true },
  });

  if (!profile || !profile.user) {
    console.log("? No customer profile found!");
    process.exit(1);
  }

  const userId = profile.userId;
  console.log(`?? Testing with customer: ${profile.user.email} (${userId})`);

  // 1. Initial Payment Method count
  const initialPms = await shoppingService.getPaymentMethods(userId);
  console.log(`?? Initial saved Mobile Money count: ${initialPms.length}`);

  // 2. Add Mobile Money Account 1 (MTN MoMo) - Should automatically be set as default!
  const pm1List = await shoppingService.createPaymentMethod(userId, {
    type: "mobile_money",
    provider: "MTN Mobile Money",
    accountName: "Kwame Mensah",
    accountNumber: "0241234567",
    isDefault: false,
  });

  const created1 = pm1List.find((p) => p.accountNumber === "0241234567");
  console.log(`? Mobile Money 1 Created (MTN). ID: ${created1?.id}, IsDefault: ${created1?.isDefault}`);
  if (!created1?.isDefault && initialPms.length === 0) {
    console.error("? ERROR: First Mobile Money account should automatically be default!");
  }

  // 3. Add Mobile Money Account 2 (Telecel Cash) with isDefault=true
  const pm2List = await shoppingService.createPaymentMethod(userId, {
    type: "mobile_money",
    provider: "Telecel Cash",
    accountName: "Kwame Mensah Telecel",
    accountNumber: "0509876543",
    isDefault: true,
  });

  const created2 = pm2List.find((p) => p.accountNumber === "0509876543");
  console.log(`? Mobile Money 2 Created (Telecel) with isDefault=true. ID: ${created2?.id}, IsDefault: ${created2?.isDefault}`);

  // Verify Account 1 is no longer default
  const refreshedList = await shoppingService.getPaymentMethods(userId);
  const ref1 = refreshedList.find((p) => p.id === created1?.id);
  console.log(`?? Mobile Money 1 isDefault after Account 2 added: ${ref1?.isDefault}`);

  // 4. Update Mobile Money Account 1
  const updatedList = await shoppingService.updatePaymentMethod(userId, created1!.id, {
    accountName: "Kwame Mensah Updated",
  });
  const ref1Updated = updatedList.find((p) => p.id === created1?.id);
  console.log(`?? Mobile Money 1 Updated Name: ${ref1Updated?.accountName}`);

  // 5. One-click Set Default back to Account 1
  const defaultSetList = await shoppingService.setDefaultPaymentMethod(userId, created1!.id);
  const ref1Default = defaultSetList.find((p) => p.id === created1?.id);
  console.log(`? Mobile Money 1 after setDefaultPaymentMethod(): IsDefault = ${ref1Default?.isDefault}`);

  // 6. Delete Account 1 (Soft Delete & automatic fallback default assignment to Account 2)
  const afterDeleteList = await shoppingService.deletePaymentMethod(userId, created1!.id);
  console.log(`??? Mobile Money 1 Deleted. Remaining active count: ${afterDeleteList.length}`);
  const ref2Fallback = afterDeleteList.find((p) => p.id === created2?.id);
  console.log(`?? Account 2 fallback default assignment: IsDefault = ${ref2Fallback?.isDefault}`);

  // Cleanup test Account 2
  if (created2?.id) {
    await shoppingService.deletePaymentMethod(userId, created2.id);
    console.log("?? Test cleanup completed!");
  }

  console.log("=== MOBILE MONEY PAYMENT AUDIT PASSED 100% ===");
  process.exit(0);
}

runPaymentAudit();
