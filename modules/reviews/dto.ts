// --- DTO INTERFACES ---

export interface ReviewDTO {
  id: string;
  productId: string;
  customerProfileId: string;
  customerName?: string;
  productName?: string;
  productImage?: string;
  rating: number;
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewSummaryDTO {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  reviews: ReviewDTO[];
}

export interface CreateReviewInput {
  rating: number;
  comment?: string;
}

export interface ReviewQueryFilters {
  page?: number;
  limit?: number;
}

// --- VALIDATION HELPER ---

export function validateCreateReviewInput(body: any): CreateReviewInput {
  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid payload: must be an object");
  }

  const rating = Number(body.rating);
  if (isNaN(rating) || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be an integer between 1 and 5");
  }

  let comment: string | undefined = undefined;
  if (body.comment !== undefined && body.comment !== null) {
    if (typeof body.comment !== "string") {
      throw new Error("Comment must be a string");
    }
    if (body.comment.length > 1000) {
      throw new Error("Comment cannot exceed 1000 characters");
    }
    comment = body.comment.trim();
  }

  return { rating, comment };
}
