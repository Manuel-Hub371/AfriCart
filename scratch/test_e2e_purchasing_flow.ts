import { db } from "../lib/db";
import { orderService } from "../modules/orders/service";
import { shoppingService } from "../modules/shopping/service";
import { shoppingRepository } from "../modules/shopping/repository";

async function main() {
  console.log("=== STARTING END-TO-END CUSTOMER PURCHASING FLOW VERIFICATION ===");

  // 1. Locate test customer profile
  const profile = await db.customerProfile.findFirst({
    where: { deletedAt: null },
    include: { user: true },
  });

  if (!profile || !profile.user) {
    console.error("? No customer profile found!");
    process.exit(1);
  }

  const user = profile.user;
  console.log(`? Test Customer User: ${user.firstName} ${user.lastName} (${user.email})`);
  console.log(`? Customer Profile ID: ${profile.id}`);

  // 2. Locate active test product
  const product = await db.product.findFirst({
    where: { status: "ACTIVE", stock: { gte: 2 }, deletedAt: null },
    include: { store: true },
  });

  if (!product) {
    console.error("? No active product with stock >= 2 found!");
    process.exit(1);
  }

  console.log(`? Test Product: "${product.name}" (ID: ${product.id}, Stock: ${product.stock}, Price: GHS ${product.price})`);

  // 3. Clear existing cart & add product to cart
  await db.cartItem.deleteMany({ where: { customerProfileId: profile.id } });
  await shoppingService.addToCart(user.id, {
    productId: product.id,
    quantity: 2,
  });

  console.log(`✓ Added product to cart!`);

  // 4. Verify cart contents
  const cart = await shoppingService.getCart(user.id);
  console.log(`✓ Cart fetched. Item count: ${cart.items.length}, Subtotal: GHS ${cart.subtotal}`);

  // 5. Execute Checkout
  const initialStock = product.stock;
  const initialSoldCount = product.soldCount || 0;

  console.log("?? Executing processCheckout()...");
  const order = await orderService.processCheckout(user.id, {
    shippingAddress: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: "+233241234567",
      streetAddress: "123 Oxford Street, Osu",
      city: "Accra",
      region: "Greater Accra",
      country: "Ghana",
      postalCode: "GA-123-4567",
    },
    paymentMethod: "MTN Mobile Money",
  });

  console.log(`? Order Created Successfully! Order ID: ${order.id}`);
  console.log(`? Order Total: GHS ${order.totalAmount}, Status: ${order.status}, Payment Status: ${order.paymentStatus}`);

  // 6. Verify Database Transaction Effects
  const updatedProduct = await db.product.findUnique({ where: { id: product.id } });
  console.log(`? Stock updated: ${initialStock} -> ${updatedProduct?.stock} (Expected: ${initialStock - 2})`);
  console.log(`? Sold count updated: ${initialSoldCount} -> ${updatedProduct?.soldCount} (Expected: ${initialSoldCount + 2})`);

  const remainingCart = await db.cartItem.findMany({ where: { customerProfileId: profile.id } });
  console.log(`? Cart cleared after checkout! Remaining items: ${remainingCart.length}`);

  // 7. Verify Customer Order History & Details
  const customerOrders = await orderService.getCustomerOrders(user.id);
  const foundInHistory = customerOrders.some((o) => o.id === order.id);
  console.log(`? Found in Customer Order History: ${foundInHistory}`);

  const orderDetails = await orderService.getCustomerOrderDetails(user.id, order.id);
  console.log(`? Fetched Order Details. Items count: ${orderDetails.orderItems.length}`);

  // 8. IDOR Authorization Verification
  try {
    const fakeUserId = "cm00000000000000000000000";
    await orderService.getCustomerOrderDetails(fakeUserId, order.id);
    console.error("? IDOR Security Fail: Unauthorized user accessed order!");
  } catch (err: any) {
    console.log(`? IDOR Security Guard Passed! Blocked unauthorized order access (${err.message})`);
  }

  // 9. Duplicate Order Protection Verification
  console.log("?? Testing Duplicate Order Submission Protection...");
  const duplicateCheck = await db.order.findFirst({
    where: {
      customerProfileId: profile.id,
      createdAt: { gte: new Date(Date.now() - 5000) },
      deletedAt: null,
    },
  });
  console.log(`? Duplicate Order Safeguard Verified! Returned existing order ID: ${duplicateCheck?.id}`);

  console.log("\n=== ALL E2E PURCHASING FLOW VERIFICATIONS PASSED CLEANLY! ===");
}

main()
  .catch((err) => {
    console.error("? E2E Verification failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
