import { db } from "@/lib/db";
import { AddToCartInput, AddressInput, PaymentMethodInput } from "./dto";

export class ShoppingRepository {
  /**
   * Helper: Ensure a CustomerProfile exists for given userId
   */
  async ensureCustomerProfile(userId: string) {
    let profile = await db.customerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      const user = await db.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw { code: "USER_NOT_FOUND", message: "User account not found", status: 404 };
      }
      profile = await db.customerProfile.create({
        data: { userId },
      });
    }

    return profile;
  }

  // --- CART PERSISTENCE ---

  async findCart(customerProfileId: string) {
    return db.cartItem.findMany({
      where: { customerProfileId },
      include: {
        product: {
          include: {
            store: { select: { name: true, slug: true } },
            campaignProducts: {
              include: { campaign: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findCartItem(customerProfileId: string, productId: string) {
    return db.cartItem.findUnique({
      where: {
        customerProfileId_productId: { customerProfileId, productId },
      },
    });
  }

  async upsertCartItem(customerProfileId: string, input: AddToCartInput) {
    const existing = await this.findCartItem(customerProfileId, input.productId);

    if (existing) {
      return db.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + (input.quantity || 1),
          variantInfo: input.variantInfo ?? existing.variantInfo,
        },
      });
    }

    return db.cartItem.create({
      data: {
        customerProfileId,
        productId: input.productId,
        quantity: input.quantity || 1,
        variantInfo: input.variantInfo ?? null,
      },
    });
  }

  async updateCartItemQuantity(id: string, customerProfileId: string, quantity: number) {
    return db.cartItem.updateMany({
      where: { id, customerProfileId },
      data: { quantity },
    });
  }

  async deleteCartItem(idOrProductId: string, customerProfileId: string) {
    return db.cartItem.deleteMany({
      where: {
        customerProfileId,
        OR: [{ id: idOrProductId }, { productId: idOrProductId }],
      },
    });
  }

  async clearCart(customerProfileId: string) {
    return db.cartItem.deleteMany({
      where: { customerProfileId },
    });
  }

  // --- WISHLIST PERSISTENCE ---

  async findWishlist(customerProfileId: string) {
    return db.wishlistItem.findMany({
      where: { customerProfileId },
      include: {
        product: {
          include: {
            store: { select: { name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findWishlistItem(customerProfileId: string, productId: string) {
    return db.wishlistItem.findUnique({
      where: {
        customerProfileId_productId: { customerProfileId, productId },
      },
    });
  }

  async addWishlistItem(customerProfileId: string, productId: string) {
    const existing = await this.findWishlistItem(customerProfileId, productId);
    if (existing) return existing;

    return db.wishlistItem.create({
      data: {
        customerProfileId,
        productId,
      },
    });
  }

  async removeWishlistItem(idOrProductId: string, customerProfileId: string) {
    return db.wishlistItem.deleteMany({
      where: {
        customerProfileId,
        OR: [{ id: idOrProductId }, { productId: idOrProductId }],
      },
    });
  }

  // --- ADDRESS PERSISTENCE ---

  async findAddresses(customerProfileId: string) {
    return db.address.findMany({
      where: { customerProfileId, deletedAt: null },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  }

  async findAddressById(id: string, customerProfileId: string) {
    return db.address.findFirst({
      where: { id, customerProfileId, deletedAt: null },
    });
  }

  async resetDefaultAddress(customerProfileId: string, type: string) {
    return db.address.updateMany({
      where: { customerProfileId, type, isDefault: true },
      data: { isDefault: false },
    });
  }

  async createAddress(customerProfileId: string, input: AddressInput) {
    const addressType = input.type || "shipping";
    const existingCount = await db.address.count({
      where: { customerProfileId, deletedAt: null, type: addressType },
    });

    const shouldBeDefault = Boolean(input.isDefault) || existingCount === 0;

    if (shouldBeDefault) {
      await this.resetDefaultAddress(customerProfileId, addressType);
    }

    return db.address.create({
      data: {
        customerProfileId,
        type: addressType,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        streetAddress: input.streetAddress,
        city: input.city,
        region: input.region,
        country: input.country,
        postalCode: input.postalCode || null,
        isDefault: shouldBeDefault,
      },
    });
  }

  async updateAddress(id: string, customerProfileId: string, input: Partial<AddressInput>) {
    const existing = await this.findAddressById(id, customerProfileId);
    if (!existing) return null;

    const addressType = input.type || existing.type;

    if (input.isDefault) {
      await this.resetDefaultAddress(customerProfileId, addressType);
    }

    await db.address.updateMany({
      where: { id, customerProfileId, deletedAt: null },
      data: {
        ...(input.type && { type: input.type }),
        ...(input.firstName && { firstName: input.firstName }),
        ...(input.lastName && { lastName: input.lastName }),
        ...(input.phone && { phone: input.phone }),
        ...(input.streetAddress && { streetAddress: input.streetAddress }),
        ...(input.city && { city: input.city }),
        ...(input.region && { region: input.region }),
        ...(input.country && { country: input.country }),
        ...(input.postalCode !== undefined && { postalCode: input.postalCode }),
        ...(input.isDefault !== undefined && { isDefault: input.isDefault }),
      },
    });

    return this.findAddresses(customerProfileId);
  }

  async setDefaultAddress(id: string, customerProfileId: string) {
    const existing = await this.findAddressById(id, customerProfileId);
    if (!existing) return null;

    await this.resetDefaultAddress(customerProfileId, existing.type);
    await db.address.update({
      where: { id },
      data: { isDefault: true },
    });

    return this.findAddresses(customerProfileId);
  }

  async softDeleteAddress(id: string, customerProfileId: string) {
    const existing = await db.address.findFirst({
      where: { id, customerProfileId, deletedAt: null },
    });

    if (!existing) return;

    await db.address.update({
      where: { id },
      data: { deletedAt: new Date(), isDefault: false },
    });

    if (existing.isDefault) {
      const nextAddress = await db.address.findFirst({
        where: { customerProfileId, deletedAt: null, type: existing.type },
        orderBy: { createdAt: "desc" },
      });
      if (nextAddress) {
        await db.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }
  }

  // --- PAYMENT METHOD PERSISTENCE ---

  async findPaymentMethods(customerProfileId: string) {
    return db.paymentMethod.findMany({
      where: { customerProfileId, deletedAt: null },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  }

  async findPaymentMethodById(id: string, customerProfileId: string) {
    return db.paymentMethod.findFirst({
      where: { id, customerProfileId, deletedAt: null },
    });
  }

  async resetDefaultPaymentMethod(customerProfileId: string) {
    return db.paymentMethod.updateMany({
      where: { customerProfileId, isDefault: true },
      data: { isDefault: false },
    });
  }

  async createPaymentMethod(customerProfileId: string, input: PaymentMethodInput) {
    const existingCount = await db.paymentMethod.count({
      where: { customerProfileId, deletedAt: null },
    });

    const shouldBeDefault = Boolean(input.isDefault) || existingCount === 0;

    if (shouldBeDefault) {
      await this.resetDefaultPaymentMethod(customerProfileId);
    }

    const last4 = input.accountNumber.length >= 4 ? input.accountNumber.slice(-4) : input.accountNumber;

    return db.paymentMethod.create({
      data: {
        customerProfileId,
        provider: input.provider,
        type: input.type || "mobile_money",
        accountName: input.accountName,
        accountNumber: input.accountNumber,
        last4,
        isDefault: shouldBeDefault,
      },
    });
  }

  async updatePaymentMethod(id: string, customerProfileId: string, input: Partial<PaymentMethodInput>) {
    const existing = await this.findPaymentMethodById(id, customerProfileId);
    if (!existing) return null;

    if (input.isDefault) {
      await this.resetDefaultPaymentMethod(customerProfileId);
    }

    const last4 = input.accountNumber
      ? input.accountNumber.slice(-4)
      : existing.last4;

    await db.paymentMethod.updateMany({
      where: { id, customerProfileId, deletedAt: null },
      data: {
        ...(input.provider && { provider: input.provider }),
        ...(input.accountName && { accountName: input.accountName }),
        ...(input.accountNumber && { accountNumber: input.accountNumber, last4 }),
        ...(input.isDefault !== undefined && { isDefault: input.isDefault }),
      },
    });

    return this.findPaymentMethods(customerProfileId);
  }

  async setDefaultPaymentMethod(id: string, customerProfileId: string) {
    const existing = await this.findPaymentMethodById(id, customerProfileId);
    if (!existing) return null;

    await this.resetDefaultPaymentMethod(customerProfileId);
    await db.paymentMethod.update({
      where: { id },
      data: { isDefault: true },
    });

    return this.findPaymentMethods(customerProfileId);
  }

  async softDeletePaymentMethod(id: string, customerProfileId: string) {
    const existing = await db.paymentMethod.findFirst({
      where: { id, customerProfileId, deletedAt: null },
    });

    if (!existing) return;

    await db.paymentMethod.update({
      where: { id },
      data: { deletedAt: new Date(), isDefault: false },
    });

    if (existing.isDefault) {
      const nextPm = await db.paymentMethod.findFirst({
        where: { customerProfileId, deletedAt: null },
        orderBy: { createdAt: "desc" },
      });
      if (nextPm) {
        await db.paymentMethod.update({
          where: { id: nextPm.id },
          data: { isDefault: true },
        });
      }
    }
  }
}

export const shoppingRepository = new ShoppingRepository();
