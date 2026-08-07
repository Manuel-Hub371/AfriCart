import { db } from "@/lib/db";
import { resolveCampaignPricing, extractCampaigns } from "@/lib/campaign-pricing";
import { CreateOrderInput, UpdateOrderStatusInput } from "./dto";

export class OrderRepository {
  /**
   * Fetch all orders for a customer profile
   */
  async findCustomerOrders(customerProfileId: string) {
    return db.order.findMany({
      where: { customerProfileId, deletedAt: null },
      include: {
        orderItems: {
          include: {
            product: true,
            store: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Fetch a single order by ID for a customer profile
   */
  async findCustomerOrderById(customerProfileId: string, orderId: string) {
    return db.order.findFirst({
      where: { id: orderId, customerProfileId, deletedAt: null },
      include: {
        orderItems: {
          include: {
            product: true,
            store: true,
          },
        },
      },
    });
  }

  /**
   * Process checkout from active cart in an atomic transaction:
   * 1. Fetch cart items WITH campaign data
   * 2. Resolve effective (campaign-adjusted) price per item
   * 3. Create Order & OrderItems at effective prices
   * 4. Record campaign snapshot (originalPrice, discountAmount, campaignId, campaignName)
   * 5. Update stock levels
   * 6. Clear cart items
   * 7. Increment campaign stats (salesCount, revenueGenerated, usedCount) outside the tx
   */
  async createOrderFromCart(customerProfileId: string, input: CreateOrderInput) {
    // 1. Get active cart items WITH their campaigns
    const cartItems = await db.cartItem.findMany({
      where: { customerProfileId },
      include: {
        product: {
          include: {
            store: true,
            campaignProducts: {
              include: { campaign: true },
            },
          },
        },
      },
    });

    if (!cartItems || cartItems.length === 0) {
      throw { code: "EMPTY_CART", message: "Cart is empty", status: 400 };
    }

    // 2. Resolve campaign pricing for every item
    const pricedItems = cartItems.map((item) => {
      const campaigns = extractCampaigns((item.product as any).campaignProducts || []);
      const pricing = resolveCampaignPricing(item.product.price, campaigns);
      return { item, pricing };
    });

    // 3. Check stock availability
    for (const { item } of pricedItems) {
      if (item.product.stock < item.quantity) {
        throw {
          code: "INSUFFICIENT_STOCK",
          message: `Insufficient stock for product "${item.product.name}". Available: ${item.product.stock}`,
          status: 400,
        };
      }
    }

    // 4. Calculate total using campaign-adjusted prices
    const totalAmount = pricedItems.reduce(
      (sum, { item, pricing }) => sum + pricing.effectivePrice * item.quantity,
      0
    );

    // 5. Run atomic transaction
    const order = await db.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          customerProfileId,
          totalAmount,
          shippingAddress: input.shippingAddress as any,
          paymentMethod: input.paymentMethod,
          paymentStatus: "PAID",
          status: "PROCESSING",
          orderItems: {
            create: pricedItems.map(({ item, pricing }) => ({
              productId: item.productId,
              quantity: item.quantity,
              // Effective (campaign-discounted) price
              price: pricing.effectivePrice,
              // Historical snapshot fields
              originalPrice: pricing.originalPrice,
              discountAmount: pricing.amountSaved,
              campaignId: pricing.campaignId,
              campaignName: pricing.campaignName,
              storeId: item.product.storeId,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
              store: true,
            },
          },
        },
      });

      // Update product stock and status
      for (const { item } of pricedItems) {
        const newStock = item.product.stock - item.quantity;
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: newStock,
            status: newStock <= 0 ? "OUT_OF_STOCK" : item.product.status,
            soldCount: { increment: item.quantity },
          },
        });
      }

      // Clear customer's cart
      await tx.cartItem.deleteMany({ where: { customerProfileId } });

      return created;
    });

    // 6. Queue non-blocking background Best Seller score recalculation & increment campaign stats
    const { queueProductBestSellerRecalculation } = await import("@/modules/catalog/best-seller-calculator");

    for (const { item } of pricedItems) {
      queueProductBestSellerRecalculation(item.productId);
    }

    const campaignStatMap = new Map<string, { qty: number; revenue: number }>();
    for (const { item, pricing } of pricedItems) {
      if (pricing.campaignId) {
        const prev = campaignStatMap.get(pricing.campaignId) || { qty: 0, revenue: 0 };
        campaignStatMap.set(pricing.campaignId, {
          qty: prev.qty + item.quantity,
          revenue: prev.revenue + pricing.effectivePrice * item.quantity,
        });
      }
    }

    for (const [campaignId, { qty, revenue }] of campaignStatMap) {
      db.marketingCampaign
        .update({
          where: { id: campaignId },
          data: {
            salesCount: { increment: qty },
            revenueGenerated: { increment: revenue },
            usedCount: { increment: 1 },
          },
        })
        .catch(() => {/* non-fatal — stats are informational */});
    }

    return order;
  }

  /**
   * Find orders that contain products from vendor's store
   */
  async findVendorOrders(storeId: string) {
    return db.order.findMany({
      where: {
        deletedAt: null,
        orderItems: {
          some: { storeId },
        },
      },
      include: {
        customerProfile: {
          include: {
            user: true,
          },
        },
        orderItems: {
          where: { storeId },
          include: {
            product: true,
            store: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Update order status with store ownership check
   */
  async updateVendorOrderStatus(storeId: string, orderId: string, status: UpdateOrderStatusInput["status"]) {
    const order = await db.order.findFirst({
      where: {
        id: orderId,
        deletedAt: null,
        orderItems: {
          some: { storeId },
        },
      },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw { code: "ORDER_NOT_FOUND", message: "Order not found for this store", status: 404 };
    }

    const previousStatus = String(order.status);
    const targetStatus = String(status);
    const isNowCancelledOrRefunded = targetStatus === "CANCELLED" || targetStatus === "REFUNDED" || targetStatus === "RETURNED";
    const wasNotCancelledOrRefunded = previousStatus !== "CANCELLED" && previousStatus !== "REFUNDED" && previousStatus !== "RETURNED";

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        orderItems: {
          include: {
            product: true,
            store: true,
          },
        },
      },
    });

    // If order was cancelled or refunded, adjust product stock and soldCount
    if (isNowCancelledOrRefunded && wasNotCancelledOrRefunded) {
      const { queueProductBestSellerRecalculation } = await import("@/modules/catalog/best-seller-calculator");

      for (const item of order.orderItems) {
        const prod = await db.product.findUnique({
          where: { id: item.productId },
          select: { id: true, stock: true, soldCount: true, status: true },
        });
        if (prod) {
          const newSoldCount = Math.max(0, (prod.soldCount || 0) - item.quantity);
          const newStock = (prod.stock || 0) + item.quantity;
          const newStatus = prod.status === "OUT_OF_STOCK" && newStock > 0 ? "ACTIVE" : prod.status;

          await db.product.update({
            where: { id: item.productId },
            data: {
              soldCount: newSoldCount,
              stock: newStock,
              status: newStatus,
            },
          });

          queueProductBestSellerRecalculation(item.productId);
        }
      }
    }

    return updatedOrder;
  }
}

export const orderRepository = new OrderRepository();
