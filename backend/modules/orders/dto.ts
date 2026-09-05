// DTOs and Validation Parsers for Orders & Checkout Module

export interface ShippingAddressInput {
  firstName: string;
  lastName: string;
  phone: string;
  streetAddress: string;
  city: string;
  region: string;
  country: string;
  postalCode?: string;
}

export interface CreateOrderInput {
  shippingAddress: ShippingAddressInput;
  paymentMethod: string;
}

export interface OrderItemDTO {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  /** Effective (campaign-adjusted) price paid per unit */
  price: number;
  /** Original base price before any campaign discount */
  originalPrice: number | null;
  /** GH₵ saved per unit by the campaign */
  discountAmount: number | null;
  /** ID of campaign applied at time of purchase (null if none) */
  campaignId: string | null;
  /** Campaign name snapshot — preserved even after campaign deletion */
  campaignName: string | null;
  storeId: string;
  storeName?: string;
}

export interface OrderDTO {
  id: string;
  customerProfileId: string;
  customerName?: string;
  customerEmail?: string;
  status: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED" | "RETURNED";
  totalAmount: number;
  shippingAddress: ShippingAddressInput | null;
  paymentMethod: string | null;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItemDTO[];
}

export interface UpdateOrderStatusInput {
  status: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED" | "RETURNED";
}

// Validation Parsers
export const CreateOrderSchema = {
  safeParse: (data: any) => {
    if (!data || typeof data !== "object") {
      return { success: false as const, error: "Invalid payload" };
    }
    const { shippingAddress, paymentMethod } = data;
    if (!shippingAddress || typeof shippingAddress !== "object") {
      return { success: false as const, error: "Shipping address is required" };
    }
    if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.streetAddress || !shippingAddress.city || !shippingAddress.region || !shippingAddress.country) {
      return { success: false as const, error: "Complete shipping address fields are required" };
    }
    if (!paymentMethod || typeof paymentMethod !== "string") {
      return { success: false as const, error: "Payment method is required" };
    }

    return {
      success: true as const,
      data: {
        shippingAddress: {
          firstName: String(shippingAddress.firstName).trim(),
          lastName: String(shippingAddress.lastName).trim(),
          phone: String(shippingAddress.phone || "").trim(),
          streetAddress: String(shippingAddress.streetAddress).trim(),
          city: String(shippingAddress.city).trim(),
          region: String(shippingAddress.region).trim(),
          country: String(shippingAddress.country).trim(),
          postalCode: shippingAddress.postalCode ? String(shippingAddress.postalCode).trim() : undefined,
        },
        paymentMethod: paymentMethod.trim(),
      } as CreateOrderInput,
    };
  },
};

export const UpdateOrderStatusSchema = {
  safeParse: (data: any) => {
    if (!data || !data.status || !["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].includes(data.status)) {
      return { success: false as const, error: "Invalid order status. Must be PROCESSING, SHIPPED, DELIVERED, or CANCELLED" };
    }
    return {
      success: true as const,
      data: { status: data.status } as UpdateOrderStatusInput,
    };
  },
};
