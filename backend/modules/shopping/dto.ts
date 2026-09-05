// DTOs and Validation Schemas for Customer Shopping (Cart, Wishlist, Addresses)

// Cart DTOs
export interface AddToCartInput {
  productId: string;
  quantity?: number;
  variantInfo?: any;
}

export interface UpdateCartItemInput {
  quantity: number;
}

export interface CartItemDTO {
  id: string;
  productId: string;
  quantity: number;
  variantInfo?: any;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number; // Effective campaign price
    originalPrice: number;
    discountAmount: number;
    discountPercent: number;
    isDiscounted: boolean;
    campaignBadge: string | null;
    campaignName: string | null;
    image: string | null;
    stock: number;
    storeName: string;
  };
}

export interface CartResponseDTO {
  items: CartItemDTO[];
  itemCount: number;
  subtotal: number;
}

// Wishlist DTOs
export interface AddToWishlistInput {
  productId: string;
}

export interface WishlistItemDTO {
  id: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string | null;
    stock: number;
    rating: number;
    numReviews: number;
    storeName: string;
  };
}

// Address DTOs
export interface AddressInput {
  type: "shipping" | "billing";
  firstName: string;
  lastName: string;
  phone: string;
  streetAddress: string;
  city: string;
  region: string;
  country: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface AddressDTO {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  phone: string;
  streetAddress: string;
  city: string;
  region: string;
  country: string;
  postalCode: string | null;
  isDefault: boolean;
  createdAt: string;
}

// Schemas & Parsers
export const AddToCartSchema = {
  safeParse: (data: any) => {
    if (!data || typeof data.productId !== "string" || !data.productId.trim()) {
      return { success: false as const, error: "productId is required" };
    }
    const quantity = data.quantity ? parseInt(data.quantity, 10) : 1;
    return {
      success: true as const,
      data: {
        productId: data.productId.trim(),
        quantity: isNaN(quantity) || quantity < 1 ? 1 : quantity,
        variantInfo: data.variantInfo || null,
      } as AddToCartInput,
    };
  },
};

export const UpdateCartItemSchema = {
  safeParse: (data: any) => {
    const quantity = parseInt(data.quantity, 10);
    if (isNaN(quantity) || quantity < 1) {
      return { success: false as const, error: "Valid quantity (at least 1) is required" };
    }
    return {
      success: true as const,
      data: { quantity } as UpdateCartItemInput,
    };
  },
};

export const AddressSchema = {
  safeParse: (data: any) => {
    if (!data.firstName?.trim() || !data.lastName?.trim() || !data.phone?.trim() || !data.streetAddress?.trim() || !data.city?.trim() || !data.region?.trim() || !data.country?.trim()) {
      return { success: false as const, error: "First name, last name, phone, street address, city, region, and country are required" };
    }
    return {
      success: true as const,
      data: {
        type: data.type === "billing" ? "billing" : "shipping",
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone.trim(),
        streetAddress: data.streetAddress.trim(),
        city: data.city.trim(),
        region: data.region.trim(),
        country: data.country.trim(),
        postalCode: data.postalCode?.trim() || null,
        isDefault: Boolean(data.isDefault),
      } as AddressInput,
    };
  },
};

// Payment Method DTOs
export interface PaymentMethodInput {
  type: "mobile_money" | "card";
  provider: string; // "MTN Mobile Money" | "Telecel Cash" | "AT Money"
  accountName: string;
  accountNumber: string;
  isDefault?: boolean;
}

export interface PaymentMethodDTO {
  id: string;
  type: string;
  provider: string;
  accountName: string | null;
  accountNumber: string | null;
  last4: string | null;
  isDefault: boolean;
  createdAt: string;
}

export const PaymentMethodSchema = {
  safeParse: (data: any) => {
    if (!data.provider?.trim() || !data.accountName?.trim() || !data.accountNumber?.trim()) {
      return { success: false as const, error: "Provider, Account Name, and Mobile Money Number are required" };
    }
    const cleanNumber = data.accountNumber.trim().replace(/\s+/g, "");
    if (cleanNumber.length < 9) {
      return { success: false as const, error: "Please enter a valid Mobile Money phone number" };
    }
    return {
      success: true as const,
      data: {
        type: "mobile_money",
        provider: data.provider.trim(),
        accountName: data.accountName.trim(),
        accountNumber: cleanNumber,
        isDefault: Boolean(data.isDefault),
      } as PaymentMethodInput,
    };
  },
};
