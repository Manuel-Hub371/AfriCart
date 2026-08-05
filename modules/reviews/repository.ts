import { db } from "@/lib/db";
import { CreateReviewInput } from "./dto";

export class ReviewRepository {
  /**
   * Create a review for a product and recalculate product average rating
   */
  async createReview(customerProfileId: string, productId: string, input: CreateReviewInput) {
    return db.$transaction(async (tx) => {
      // 1. Check if product exists
      const product = await tx.product.findUnique({
        where: { id: productId, deletedAt: null },
        include: { store: { select: { id: true, vendorProfile: { select: { userId: true } } } } },
      });

      if (!product) {
        throw { code: "PRODUCT_NOT_FOUND", message: "Product not found", status: 404 };
      }

      // 2. Create the review
      const review = await tx.review.create({
        data: {
          productId,
          customerProfileId,
          rating: input.rating,
          comment: input.comment || null,
        },
        include: {
          customerProfile: {
            include: {
              user: {
                select: { firstName: true, lastName: true, email: true },
              },
            },
          },
          product: {
            select: { id: true, name: true, images: true },
          },
        },
      });

      // 3. Recalculate average rating for product
      const aggregate = await tx.review.aggregate({
        where: { productId },
        _avg: { rating: true },
      });

      const avgRating = Math.round((aggregate._avg.rating || 0) * 10) / 10;

      await tx.product.update({
        where: { id: productId },
        data: {
          rating: avgRating,
        },
      });

      // 4. Send vendor notification
      try {
        const vendorUserId = product.store?.vendorProfile?.userId;
        if (vendorUserId) {
          await tx.notification.create({
            data: {
              userId: vendorUserId,
              title: "New Product Review Received",
              message: `A customer left a ${input.rating}-star review on "${product.name}".`,
              type: "REVIEW",
              link: `/vendor/products/${productId}`,
            },
          });
        }
      } catch {
        // ignore notification failures inside transaction
      }

      return review;
    });
  }

  /**
   * Find reviews for a specific product
   */
  async findProductReviews(productId: string, skip = 0, take = 20) {
    const [reviews, total, aggregate, breakdown] = await Promise.all([
      db.review.findMany({
        where: { productId },
        include: {
          customerProfile: {
            include: {
              user: {
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      db.review.count({ where: { productId } }),
      db.review.aggregate({
        where: { productId },
        _avg: { rating: true },
      }),
      db.review.groupBy({
        by: ["rating"],
        where: { productId },
        _count: { rating: true },
      }),
    ]);

    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    breakdown.forEach((b) => {
      if (b.rating >= 1 && b.rating <= 5) {
        ratingBreakdown[b.rating as keyof typeof ratingBreakdown] = b._count.rating;
      }
    });

    return {
      reviews,
      total,
      averageRating: Math.round((aggregate._avg.rating || 0) * 10) / 10,
      ratingBreakdown,
    };
  }

  /**
   * Find reviews for a vendor store's products with rating aggregation
   */
  async findVendorStoreReviews(storeId: string, skip = 0, take = 50) {
    const [reviews, total, aggregate, breakdown] = await Promise.all([
      db.review.findMany({
        where: {
          product: {
            storeId,
            deletedAt: null,
          },
        },
        include: {
          customerProfile: {
            include: {
              user: {
                select: { id: true, firstName: true, lastName: true, email: true },
              },
            },
          },
          product: {
            select: { id: true, name: true, images: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      db.review.count({
        where: {
          product: { storeId, deletedAt: null },
        },
      }),
      db.review.aggregate({
        where: {
          product: { storeId, deletedAt: null },
        },
        _avg: { rating: true },
      }),
      db.review.groupBy({
        by: ["rating"],
        where: {
          product: { storeId, deletedAt: null },
        },
        _count: { rating: true },
      }),
    ]);

    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    breakdown.forEach((b) => {
      if (b.rating >= 1 && b.rating <= 5) {
        ratingBreakdown[b.rating as keyof typeof ratingBreakdown] = b._count.rating;
      }
    });

    const averageRating = Math.round((aggregate._avg.rating || 5.0) * 10) / 10;

    return { reviews, total, averageRating, ratingBreakdown };
  }

  /**
   * Reply to a customer review as a vendor
   */
  async replyToReview(reviewId: string, storeId: string, vendorReply: string) {
    const review = await db.review.findUnique({
      where: { id: reviewId },
      include: {
        product: { select: { id: true, name: true, storeId: true } },
        customerProfile: { select: { id: true, userId: true } },
      },
    });

    if (!review) {
      throw { code: "REVIEW_NOT_FOUND", message: "Review not found", status: 404 };
    }

    if (review.product.storeId !== storeId) {
      throw { code: "FORBIDDEN", message: "Not authorized to reply to this review", status: 403 };
    }

    const updated = await db.review.update({
      where: { id: reviewId },
      data: {
        vendorReply,
        vendorRepliedAt: new Date(),
      },
    });

    // Create a real notification for the customer
    try {
      await db.notification.create({
        data: {
          userId: review.customerProfile.userId,
          title: "Vendor Replied to Your Review",
          message: `The seller of "${review.product.name}" replied to your review: "${vendorReply.slice(0, 80)}..."`,
          type: "REVIEW",
          link: `/product/${review.productId}`,
        },
      });
    } catch {
      // ignore notification creation error
    }

    return updated;
  }

  /**
   * Find customer's submitted reviews
   */
  async findCustomerReviews(customerProfileId: string, skip = 0, take = 50) {
    return db.review.findMany({
      where: { customerProfileId },
      include: {
        product: {
          select: { id: true, name: true, images: true, price: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  }

  /**
   * Delete customer review
   */
  async deleteReview(reviewId: string, customerProfileId: string) {
    return db.$transaction(async (tx) => {
      const review = await tx.review.findUnique({
        where: { id: reviewId },
      });

      if (!review) {
        throw { code: "REVIEW_NOT_FOUND", message: "Review not found", status: 404 };
      }

      if (review.customerProfileId !== customerProfileId) {
        throw { code: "FORBIDDEN", message: "Not authorized to delete this review", status: 403 };
      }

      await tx.review.delete({
        where: { id: reviewId },
      });

      // Recalculate product rating
      const aggregate = await tx.review.aggregate({
        where: { productId: review.productId },
        _avg: { rating: true },
      });

      const avgRating = Math.round((aggregate._avg.rating || 0) * 10) / 10;

      await tx.product.update({
        where: { id: review.productId },
        data: { rating: avgRating },
      });

      return review;
    });
  }
}

export const reviewRepository = new ReviewRepository();
