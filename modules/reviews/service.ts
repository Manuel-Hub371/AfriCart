import { reviewRepository } from "./repository";
import { shoppingRepository } from "@/modules/shopping/repository";
import { vendorRepository } from "@/modules/vendor/repository";
import { CreateReviewInput, ReviewDTO, ReviewSummaryDTO } from "./dto";
import { domainEvents, EVENT_TOPICS } from "@/lib/events";

export class ReviewService {
  /**
   * Create a review for a product
   */
  async createReview(userId: string, productId: string, input: CreateReviewInput): Promise<ReviewDTO> {
    const customerProfile = await shoppingRepository.ensureCustomerProfile(userId);

    const review = await reviewRepository.createReview(customerProfile.id, productId, input);

    // Queue background Best Seller score update asynchronously
    import("@/modules/catalog/best-seller-calculator").then(({ queueProductBestSellerRecalculation }) => {
      queueProductBestSellerRecalculation(productId);
    }).catch(() => {});

    domainEvents.emit(EVENT_TOPICS.REVIEW_CREATED, {
      reviewId: review.id,
      productId: review.productId,
      customerProfileId: customerProfile.id,
      rating: review.rating,
    });

    const user = review.customerProfile.user;
    const customerName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Verified Buyer";

    return {
      id: review.id,
      productId: review.productId,
      customerProfileId: review.customerProfileId,
      customerName,
      productName: review.product.name,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  /**
   * Get product review summary and list
   */
  async getProductReviews(productId: string, page = 1, limit = 20): Promise<ReviewSummaryDTO> {
    const skip = (page - 1) * limit;
    const data = await reviewRepository.findProductReviews(productId, skip, limit);

    return {
      averageRating: data.averageRating,
      totalReviews: data.total,
      ratingBreakdown: data.ratingBreakdown,
      reviews: data.reviews.map((r) => {
        const u = r.customerProfile.user;
        const customerName = [u.firstName, u.lastName].filter(Boolean).join(" ") || "Verified Buyer";
        return {
          id: r.id,
          productId: r.productId,
          customerProfileId: r.customerProfileId,
          customerName,
          rating: r.rating,
          comment: r.comment,
          vendorReply: r.vendorReply || undefined,
          vendorRepliedAt: r.vendorRepliedAt || undefined,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        };
      }),
    };
  }

  /**
   * Get vendor store reviews with full database metrics
   */
  async getVendorReviews(userId: string, page = 1, limit = 50) {
    const vendorProfile = await vendorRepository.findVendorProfileByUserId(userId);
    if (!vendorProfile || !vendorProfile.stores || vendorProfile.stores.length === 0) {
      throw { code: "VENDOR_NOT_FOUND", message: "Vendor store not found", status: 404 };
    }

    const storeId = vendorProfile.stores[0].id;
    const skip = (page - 1) * limit;
    const { reviews, total, averageRating, ratingBreakdown } = await reviewRepository.findVendorStoreReviews(
      storeId,
      skip,
      limit
    );

    return {
      total,
      averageRating,
      ratingBreakdown,
      reviews: reviews.map((r) => {
        const u = r.customerProfile.user;
        const customerName = [u.firstName, u.lastName].filter(Boolean).join(" ") || "Customer";
        const images = r.product.images as string[] | null;
        return {
          id: r.id,
          productId: r.productId,
          productName: r.product.name,
          productImage: Array.isArray(images) && images.length > 0 ? images[0] : undefined,
          customerProfileId: r.customerProfileId,
          customerName,
          rating: r.rating,
          comment: r.comment,
          vendorReply: r.vendorReply || undefined,
          vendorRepliedAt: r.vendorRepliedAt || undefined,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        };
      }),
    };
  }

  /**
   * Submit or update a vendor reply to a review
   */
  async replyToReview(userId: string, reviewId: string, vendorReply: string) {
    const vendorProfile = await vendorRepository.findVendorProfileByUserId(userId);
    if (!vendorProfile || !vendorProfile.stores || vendorProfile.stores.length === 0) {
      throw { code: "VENDOR_NOT_FOUND", message: "Vendor store not found", status: 404 };
    }

    const storeId = vendorProfile.stores[0].id;
    return reviewRepository.replyToReview(reviewId, storeId, vendorReply);
  }

  /**
   * Get customer review history
   */
  async getCustomerReviews(userId: string, page = 1, limit = 50): Promise<ReviewDTO[]> {
    const customerProfile = await shoppingRepository.ensureCustomerProfile(userId);
    const skip = (page - 1) * limit;
    const reviews = await reviewRepository.findCustomerReviews(customerProfile.id, skip, limit);

    return reviews.map((r) => {
      const images = r.product.images as string[] | null;
      return {
        id: r.id,
        productId: r.productId,
        productName: r.product.name,
        productImage: Array.isArray(images) && images.length > 0 ? images[0] : undefined,
        customerProfileId: r.customerProfileId,
        rating: r.rating,
        comment: r.comment,
        vendorReply: r.vendorReply || undefined,
        vendorRepliedAt: r.vendorRepliedAt || undefined,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });
  }

  /**
   * Delete customer review
   */
  async deleteCustomerReview(userId: string, reviewId: string) {
    const customerProfile = await shoppingRepository.ensureCustomerProfile(userId);
    return reviewRepository.deleteReview(reviewId, customerProfile.id);
  }
}

export const reviewService = new ReviewService();
