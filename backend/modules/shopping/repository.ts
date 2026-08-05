import { db } from "@/lib/db";
import { AddToCartInput, AddressInput } from "./dto";

export class ShoppingRepository {
  /**
   * Helper: Ensure a CustomerProfile exists for given userId
   */
  async ensureCustomerProfile(userId: string) {
    let profile = await db.customerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
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
    if (input.isDefault) {
      await this.resetDefaultAddress(customerProfileId, input.type);
    }

    return db.address.create({
      data: {
        customerProfileId,
        type: input.type,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        streetAddress: input.streetAddress,
        city: input.city,
        region: input.region,
        country: input.country,
        postalCode: input.postalCode || null,
        isDefault: Boolean(input.isDefault),
      },
    });
  }

  async updateAddress(id: string, customerProfileId: string, input: Partial<AddressInput>) {
    if (input.isDefault && input.type) {
      await this.resetDefaultAddress(customerProfileId, input.type);
    }

    return db.address.updateMany({
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
  }

  async softDeleteAddress(id: string, customerProfileId: string) {
    return db.address.updateMany({
      where: { id, customerProfileId },
      data: { deletedAt: new Date() },
    });
  }
}

export const shoppingRepository = new ShoppingRepository();
