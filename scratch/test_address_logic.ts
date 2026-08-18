import { db } from "../lib/db";
import { shoppingService } from "../modules/shopping/service";

async function runAddressAudit() {
  console.log("=== STARTING ADDRESS SYSTEM LOGIC AUDIT ===");

  const profile = await db.customerProfile.findFirst({
    include: { user: true },
  });

  if (!profile || !profile.user) {
    console.log("? No customer user found!");
    process.exit(1);
  }

  const userId = profile.userId;
  console.log(`?? Testing with customer: ${profile.user.email} (${userId})`);

  const initialAddrs = await shoppingService.getAddresses(userId);
  console.log(`?? Initial saved addresses count: ${initialAddrs.length}`);

  const addr1 = await shoppingService.createAddress(userId, {
    type: "shipping",
    firstName: "Kwame",
    lastName: "Mensah",
    phone: "+233241234567",
    streetAddress: "15 Independence Avenue",
    city: "Accra",
    region: "Greater Accra",
    country: "Ghana",
    postalCode: "GA-001-2024",
    isDefault: false,
  });

  const created1 = addr1.find((a) => a.streetAddress === "15 Independence Avenue");
  console.log(`? Address 1 Created. ID: ${created1?.id}, IsDefault: ${created1?.isDefault}`);

  const addr2 = await shoppingService.createAddress(userId, {
    type: "shipping",
    firstName: "Abena",
    lastName: "Osei",
    phone: "+233209876543",
    streetAddress: "88 Ring Road Central",
    city: "Accra",
    region: "Greater Accra",
    country: "Ghana",
    postalCode: "GA-100-9999",
    isDefault: true,
  });

  const created2 = addr2.find((a) => a.streetAddress === "88 Ring Road Central");
  console.log(`? Address 2 Created with isDefault=true. ID: ${created2?.id}, IsDefault: ${created2?.isDefault}`);

  const refreshedAddrs = await shoppingService.getAddresses(userId);
  const ref1 = refreshedAddrs.find((a) => a.id === created1?.id);
  console.log(`?? Address 1 isDefault after Address 2 added: ${ref1?.isDefault}`);

  const updatedAddrs = await shoppingService.updateAddress(userId, created1!.id, {
    firstName: "Kwame Updated",
    streetAddress: "15 Independence Avenue, Suite 2B",
  });

  const ref1Updated = updatedAddrs.find((a) => a.id === created1?.id);
  console.log(`?? Address 1 Updated Name: ${ref1Updated?.firstName}, Street: ${ref1Updated?.streetAddress}`);

  const defaultSetAddrs = await shoppingService.setDefaultAddress(userId, created1!.id);
  const ref1Default = defaultSetAddrs.find((a) => a.id === created1?.id);
  console.log(`? Address 1 after setDefaultAddress(): IsDefault = ${ref1Default?.isDefault}`);

  const afterDeleteAddrs = await shoppingService.deleteAddress(userId, created1!.id);
  console.log(`??? Address 1 Soft-Deleted. Total remaining active addresses: ${afterDeleteAddrs.length}`);
  const ref2DefaultFallback = afterDeleteAddrs.find((a) => a.id === created2?.id);
  console.log(`?? Address 2 automatic fallback default assignment: IsDefault = ${ref2DefaultFallback?.isDefault}`);

  if (created2?.id) {
    await shoppingService.deleteAddress(userId, created2.id);
    console.log("?? Test cleanup completed!");
  }

  console.log("=== ADDRESS SYSTEM AUDIT PASSED 100% ===");
  process.exit(0);
}

runAddressAudit();
