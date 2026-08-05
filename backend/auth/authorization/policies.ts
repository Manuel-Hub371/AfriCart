import { db } from "@/lib/db";

/**
 * Validates if a user owns and can modify a specific store
 */
export async function canModifyStore(userId: string, storeId: string): Promise<boolean> {
  if (!userId || !storeId) return false;
  
  const store = await db.store.findFirst({
    where: {
      id: storeId,
      deletedAt: null,
      vendorProfile: {
        userId: userId,
        deletedAt: null,
      },
    },
  });
  
  return !!store;
}

/**
 * Validates if a user owns and can modify a specific product
 */
export async function canModifyProduct(userId: string, productId: string): Promise<boolean> {
  if (!userId || !productId) return false;

  const product = await db.product.findFirst({
    where: {
      id: productId,
      deletedAt: null,
      store: {
        deletedAt: null,
        vendorProfile: {
          userId: userId,
          deletedAt: null,
        },
      },
    },
  });

  return !!product;
}

/**
 * Validates if a user has access to view or update an order.
 * - Customers can access orders they placed.
 * - Vendors can access orders containing items from their stores.
 */
export async function canAccessOrder(userId: string, orderId: string): Promise<boolean> {
  if (!userId || !orderId) return false;

  // 1. Check if the user is the customer who placed the order
  const orderAsCustomer = await db.order.findFirst({
    where: {
      id: orderId,
      deletedAt: null,
      customerProfile: {
        userId: userId,
        deletedAt: null,
      },
    },
  });
  if (orderAsCustomer) return true;

  // 2. Check if the user is a vendor who owns a store that fulfills items in this order
  const orderAsVendor = await db.order.findFirst({
    where: {
      id: orderId,
      deletedAt: null,
      orderItems: {
        some: {
          store: {
            deletedAt: null,
            vendorProfile: {
              userId: userId,
              deletedAt: null,
            },
          },
        },
      },
    },
  });

  return !!orderAsVendor;
}
