"use client";

import { ReviewCard, Review } from "./review-card";

interface ReviewsListProps {
  reviews: Review[];
  onReply: (reviewId: string) => void;
  onViewProduct: (reviewId: string) => void;
  onReport: (reviewId: string) => void;
  onViewDetails: (review: Review) => void;
}

export function ReviewsList({ 
  reviews, 
  onReply, 
  onViewProduct, 
  onReport,
  onViewDetails 
}: ReviewsListProps) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onReply={onReply}
          onViewProduct={onViewProduct}
          onReport={onReport}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
