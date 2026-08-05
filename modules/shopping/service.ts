import { shoppingRepository, ShoppingRepository } from "./repository";
import {
  AddToCartInput,
  UpdateCartItemInput,
  AddressInput,
  CartResponseDTO,
  CartItemDTO,
  WishlistItemDTO,
  AddressDTO,
} from "./dto";

export class ShoppingService {
  constructor(private repo: ShoppingRepository = shoppingRepository) {}

  // --- CART SERVICE ---

  async getCart(userId: string): Promise<CartResponseDTO> {
    const profile = await this.repo.ensureCustomerProfile(userId);
    const rawItems = await this.repo.findCart(profile.id);

    const items: CartItemDTO[] = rawItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      variantInfo: item.variantInfo,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price,
        compareAtPrice: item.product.compareAtPrice,
        image: Array.isArray(item.product.images) && item.product.images.length > 0 ? (item.product.images[0] as string) : null,
        stock: item.product.stock,
        storeName: item.product.store.name,
      },
    }));

    const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return {
      items,
      itemCount,
      subtotal: Math.round(subtotal * 100) / 100,
    };
  }

  async addToCart(userId: string, input: AddToCartInput): Promise<CartResponseDTO> {
    const profile = await this.repo.ensureCustomerProfile(userId);
    await this.repo.upsertCartItem(profile.id, input);
    return this.getCart(userId);
  }

  async updateCartItem(userId: string, itemId: string, input: UpdateCartItemInput): Promise<CartResponseDTO> {
    const profile = await this.repo.ensureCustomerProfile(userId);
    await this.repo.updateCartItemQuantity(itemId, profile.id, input.quantity);
    return this.getCart(userId);
  }

  async removeFromCart(userId: string, itemIdOrProductId: string): Promise<CartResponseDTO> {
    const profile = await this.repo.ensureCustomerProfile(userId);
    await this.repo.deleteCartItem(itemIdOrProductId, profile.id);
    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<CartResponseDTO> {
    const profile = await this.repo.ensureCustomerProfile(userId);
    await this.repo.clearCart(profile.id);
    return { items: [], itemCount: 0, subtotal: 0 };
  }

  // --- WISHLIST SERVICE ---

  async getWishlist(userId: string): Promise<WishlistItemDTO[]> {
    const profile = await this.repo.ensureCustomerProfile(userId);
    const rawItems = await this.repo.findWishlist(profile.id);

    return rawItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt.toISOString(),
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price,
        compareAtPrice: item.product.compareAtPrice,
        image: Array.isArray(item.product.images) && item.product.images.length > 0 ? (item.product.images[0] as string) : null,
        stock: item.product.stock,
        rating: item.product.rating,
        numReviews: item.product.numReviews,
        storeName: item.product.store.name,
      },
    }));
  }

  async addToWishlist(userId: string, productId: string): Promise<WishlistItemDTO[]> {
    const profile = await this.repo.ensureCustomerProfile(userId);
    await this.repo.addWishlistItem(profile.id, productId);
    return this.getWishlist(userId);
  }

  async removeFromWishlist(userId: string, itemIdOrProductId: string): Promise<WishlistItemDTO[]> {
    const profile = await this.repo.ensureCustomerProfile(userId);
    await this.repo.removeWishlistItem(itemIdOrProductId, profile.id);
    return this.getWishlist(userId);
  }

  // --- ADDRESS SERVICE ---

  async getAddresses(userId: string): Promise<AddressDTO[]> {
    const profile = await this.repo.ensureCustomerProfile(userId);
    const rawAddresses = await this.repo.findAddresses(profile.id);

    return rawAddresses.map((addr) => ({
      id: addr.id,
      type: addr.type,
      firstName: addr.firstName,
      lastName: addr.lastName,
      phone: addr.phone,
      streetAddress: addr.streetAddress,
      city: addr.city,
      region: addr.region,
      country: addr.country,
      postalCode: addr.postalCode,
      isDefault: addr.isDefault,
      createdAt: addr.createdAt.toISOString(),
    }));
  }

  async createAddress(userId: string, input: AddressInput): Promise<AddressDTO[]> {
    const profile = await this.repo.ensureCustomerProfile(userId);
    await this.repo.createAddress(profile.id, input);
    return this.getAddresses(userId);
  }

  async updateAddress(userId: string, addressId: string, input: Partial<AddressInput>): Promise<AddressDTO[]> {
    const profile = await this.repo.ensureCustomerProfile(userId);
    await this.repo.updateAddress(addressId, profile.id, input);
    return this.getAddresses(userId);
  }

  async deleteAddress(userId: string, addressId: string): Promise<AddressDTO[]> {
    const profile = await this.repo.ensureCustomerProfile(userId);
    await this.repo.softDeleteAddress(addressId, profile.id);
    return this.getAddresses(userId);
  }
}

export const shoppingService = new ShoppingService();
