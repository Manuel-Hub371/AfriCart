import { orderRepository } from "./repository";
import { shoppingRepository } from "@/modules/shopping/repository";
import { vendorRepository } from "@/modules/vendor/repository";
import { domainEvents, EVENT_TOPICS } from "@/lib/events";
import { CreateOrderInput, UpdateOrderStatusInput, OrderDTO, OrderItemDTO } from "./dto";

function toOrderItemDTO(item: any): OrderItemDTO {
  return {
    id: item.id,
    orderId: item.orderId,
    productId: item.productId,
    productName: item.product?.name ?? "Unknown Product",
    productImage: item.product?.images?.[0] ?? null,
    quantity: item.quantity,
    price: Number(item.price),
    originalPrice: item.originalPrice != null ? Number(item.originalPrice) : null,
    discountAmount: item.discountAmount != null ? Number(item.discountAmount) : null,
    campaignId: item.campaignId ?? null,
    campaignName: item.campaignName ?? null,
    storeId: item.storeId,
    storeName: item.store?.name ?? item.product?.store?.name ?? "Store",
  };
}

function toOrderDTO(order: any): OrderDTO {
  const customerUser = order.customerProfile?.user;
  const customerName = customerUser
    ? `${customerUser.firstName} ${customerUser.lastName}`.trim()
    : undefined;

  return {
    id: order.id,
    customerProfileId: order.customerProfileId,
    customerName,
    customerEmail: customerUser?.email,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    shippingAddress: order.shippingAddress ?? null,
    paymentMethod: order.paymentMethod ?? null,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
    updatedAt: order.updatedAt instanceof Date ? order.updatedAt.toISOString() : order.updatedAt,
    orderItems: (order.orderItems ?? []).map(toOrderItemDTO),
  };
}

export class OrderService {
  /**
   * Process checkout for authenticated customer
   */
  async processCheckout(userId: string, input: CreateOrderInput): Promise<OrderDTO> {
    const customerProfile = await shoppingRepository.ensureCustomerProfile(userId);

    const order = await orderRepository.createOrderFromCart(customerProfile.id, input);

    domainEvents.emit(EVENT_TOPICS.ORDER_CREATED, {
      orderId: order.id,
      customerProfileId: customerProfile.id,
      totalAmount: order.totalAmount,
    });

    return toOrderDTO(order);
  }

  /**
   * GET customer order history
   */
  async getCustomerOrders(userId: string): Promise<OrderDTO[]> {
    const customerProfile = await shoppingRepository.ensureCustomerProfile(userId);
    const orders = await orderRepository.findCustomerOrders(customerProfile.id);
    return orders.map(toOrderDTO);
  }

  /**
   * GET single customer order details
   */
  async getCustomerOrderDetails(userId: string, orderId: string): Promise<OrderDTO> {
    const customerProfile = await shoppingRepository.ensureCustomerProfile(userId);
    const order = await orderRepository.findCustomerOrderById(customerProfile.id, orderId);
    if (!order) {
      throw { code: "ORDER_NOT_FOUND", message: "Order not found", status: 404 };
    }
    return toOrderDTO(order);
  }

  /**
   * GET vendor store orders
   */
  async getVendorOrders(userId: string): Promise<OrderDTO[]> {
    const vendorProfile = await vendorRepository.findVendorProfileByUserId(userId);
    if (!vendorProfile) {
      throw { code: "VENDOR_NOT_FOUND", message: "Vendor profile not found", status: 404 };
    }

    const store = await vendorRepository.findStoreByVendorProfileId(vendorProfile.id);
    if (!store) {
      throw { code: "STORE_NOT_FOUND", message: "Vendor store not found", status: 404 };
    }

    const orders = await orderRepository.findVendorOrders(store.id);
    return orders.map(toOrderDTO);
  }

  /**
   * PATCH update vendor order status
   */
  async updateVendorOrderStatus(
    userId: string,
    orderId: string,
    input: UpdateOrderStatusInput
  ): Promise<OrderDTO> {
    const vendorProfile = await vendorRepository.findVendorProfileByUserId(userId);
    if (!vendorProfile) {
      throw { code: "VENDOR_NOT_FOUND", message: "Vendor profile not found", status: 404 };
    }

    const store = await vendorRepository.findStoreByVendorProfileId(vendorProfile.id);
    if (!store) {
      throw { code: "STORE_NOT_FOUND", message: "Vendor store not found", status: 404 };
    }

    const updated = await orderRepository.updateVendorOrderStatus(store.id, orderId, input.status);

    domainEvents.emit(EVENT_TOPICS.ORDER_STATUS_CHANGED, {
      orderId: updated.id,
      status: input.status,
    });

    return toOrderDTO(updated);
  }
}

export const orderService = new OrderService();
