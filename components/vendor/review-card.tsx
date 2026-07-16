"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ThumbsUp, Flag, MessageSquare, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  productName: string;
  productImage: string;
  reviewTitle: string;
  reviewContent: string;
  reviewDate: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  photos?: string[];
  vendorReply?: {
    content: string;
    date: string;
  };
  hasReply: boolean;
  isReported: boolean;
}

interface ReviewCardProps {
  review: Review;
  onReply: (reviewId: string) => void;
  onViewProduct: (reviewId: string) => void;
  onReport: (reviewId: string) => void;
  onViewDetails: (review: Review) => void;
}

export function ReviewCard({ 
  review, 
  onReply, 
  onViewProduct, 
  onReport,
  onViewDetails 
}: ReviewCardProps) {
  const [showFullReview, setShowFullReview] = useState(false);
  
  const maxLength = 200;
  const shouldTruncate = review.reviewContent.length > maxLength;
  const displayContent = showFullReview || !shouldTruncate
    ? review.reviewContent
    : `${review.reviewContent.slice(0, maxLength)}...`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold">
            {review.customerName.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">{review.customerName}</h4>
              {review.verifiedPurchase && (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs flex items-center gap-1 px-2 py-0">
                  <BadgeCheck className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">{review.reviewDate}</span>
            </div>
          </div>
        </div>
        
        {/* Product Preview */}
        <div className="flex items-center gap-2 ml-4">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={review.productImage}
              alt={review.productName}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm text-gray-600 hidden sm:block max-w-[150px] truncate">
            {review.productName}
          </span>
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-4">
        {review.reviewTitle && (
          <h5 className="font-semibold text-gray-900 mb-2">{review.reviewTitle}</h5>
        )}
        <p className="text-gray-700 text-sm leading-relaxed">
          {displayContent}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setShowFullReview(!showFullReview)}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium mt-1"
          >
            {showFullReview ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="flex gap-2 mb-4">
          {review.photos.slice(0, 4).map((photo, idx) => (
            <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={photo}
                alt={`Review photo ${idx + 1}`}
                fill
                className="object-cover cursor-pointer hover:opacity-90 transition"
                onClick={() => onViewDetails(review)}
              />
            </div>
          ))}
          {review.photos.length > 4 && (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
              <span className="text-sm font-medium text-gray-600">
                +{review.photos.length - 4}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Vendor Reply */}
      {review.vendorReply && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border-l-4 border-emerald-500">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-gray-900">Vendor Response</span>
            <span className="text-xs text-gray-500">{review.vendorReply.date}</span>
          </div>
          <p className="text-sm text-gray-700">{review.vendorReply.content}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-500">
            <ThumbsUp className="h-4 w-4" />
            <span className="text-sm">{review.helpfulCount} helpful</span>
          </div>
          {review.isReported && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Reported
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewProduct(review.id)}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            View Product
          </Button>
          {!review.hasReply && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReply(review.id)}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Reply
            </Button>
          )}
          {review.hasReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(review.id)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              Edit Reply
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReport(review.id)}
            className="text-gray-600 hover:text-red-600 hover:bg-red-50"
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
