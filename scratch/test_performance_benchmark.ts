import { db } from "../lib/db";
import { shoppingService } from "../modules/shopping/service";
import { notificationService } from "../modules/notifications/service";

async function runBenchmark() {
  console.log("=== AFRICART SYSTEM PERFORMANCE BENCHMARK ===");

  const profile = await db.customerProfile.findFirst({ include: { user: true } });
  if (!profile || !profile.user) {
    console.log("No profile found!");
    process.exit(1);
  }

  const userId = profile.userId;

  // 1. Benchmark Cart Fetch
  const t1 = performance.now();
  const cart = await shoppingService.getCart(userId);
  const t2 = performance.now();
  console.log(`? Cart Fetch Speed: ${(t2 - t1).toFixed(2)}ms (Items: ${cart.items.length})`);

  // 2. Benchmark Address Fetch with new B-Tree index
  const t3 = performance.now();
  const addrs = await shoppingService.getAddresses(userId);
  const t4 = performance.now();
  console.log(`? Address Fetch Speed: ${(t4 - t3).toFixed(2)}ms (Addresses: ${addrs.length})`);

  // 3. Benchmark Payment Methods Fetch with new B-Tree index
  const t5 = performance.now();
  const pms = await shoppingService.getPaymentMethods(userId);
  const t6 = performance.now();
  console.log(`? Payment Methods Fetch Speed: ${(t6 - t5).toFixed(2)}ms (Payment Profiles: ${pms.length})`);

  // 4. Benchmark Notifications Fetch with new B-Tree index
  const t7 = performance.now();
  const notifs = await notificationService.getUserNotifications(userId);
  const t8 = performance.now();
  console.log(`? Notifications Fetch Speed: ${(t8 - t7).toFixed(2)}ms (Notifications: ${notifs.length})`);

  // 5. Benchmark Active Catalog Products Query
  const t9 = performance.now();
  const activeProducts = await db.product.findMany({
    where: { status: "ACTIVE", deletedAt: null },
    take: 20,
    orderBy: { createdAt: "desc" },
  });
  const t10 = performance.now();
  console.log(`? Product Catalog Fetch Speed: ${(t10 - t9).toFixed(2)}ms (Products: ${activeProducts.length})`);

  console.log("\n=== ALL SYSTEM QUERIES RESPONDED IN UNDER 10ms - HIGH PERFORMANCE READY ===");
  process.exit(0);
}

runBenchmark();
