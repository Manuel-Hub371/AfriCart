"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, MessageSquarePlus, Send, Loader2, ThumbsUp, Store, Filter, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  customerName: string;
  avatar?: string | null;
  rating: number;
  comment?: string;
  vendorReply?: string | null;
  vendorRepliedAt?: string | null;
  helpfulVotes?: number;
  images?: string[];
  isVerifiedPurchase?: boolean;
  createdAt: string;
}

interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
  reviews: Review[];
}

export function ReviewSection({ productId }: { productId?: string }) {
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Filters
  const [filterType, setFilterType] = useState<"all" | "newest" | "highest" | "lowest" | "verified" | "photos">("all");
  const [votedReviews, setVotedReviews] = useState<Record<string, boolean>>({});

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    async function loadReviews() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/products/${productId}/reviews`);
        if (res.ok) {
          const data = await res.json();
          setSummary(data);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReviews();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: newRating, comment: newComment }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Please log in to submit a review");
        }
        throw new Error(data.error || "Failed to submit review");
      }

      setSubmitSuccess("Review submitted successfully!");
      setNewComment("");
      setShowForm(false);

      const updatedRes = await fetch(`/api/products/${productId}/reviews`);
      if (updatedRes.ok) {
        setSummary(await updatedRes.json());
      }
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpfulVote = (reviewId: string) => {
    if (votedReviews[reviewId]) return;
    setVotedReviews((prev) => ({ ...prev, [reviewId]: true }));
    if (summary) {
      setSummary({
        ...summary,
        reviews: summary.reviews.map((r) =>
          r.id === reviewId ? { ...r, helpfulVotes: (r.helpfulVotes || 0) + 1 } : r
        ),
      });
    }
  };

  const reviews = summary?.reviews || [];
  const avgRating = summary?.averageRating || 0;
  const totalReviews = summary?.totalReviews || 0;
  const breakdown = summary?.ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  // Filtered & Sorted Reviews
  const filteredReviews = useMemo(() => {
    let list = [...reviews];
    if (filterType === "verified") {
      list = list.filter((r) => r.isVerifiedPurchase);
    } else if (filterType === "photos") {
      list = list.filter((r) => r.images && r.images.length > 0);
    } else if (filterType === "highest") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (filterType === "lowest") {
      list.sort((a, b) => a.rating - b.rating);
    } else if (filterType === "newest") {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [reviews, filterType]);

  return (
    <div className="space-y-8">
      {/* Overall Rating Breakdown */}
      <div className="grid md:grid-cols-2 gap-8 bg-gray-50/70 p-6 md:p-8 rounded-3xl border border-gray-200">
        <div className="text-center flex flex-col justify-center items-center">
          <div className="text-6xl font-black text-gray-900 mb-2">{avgRating.toFixed(1)}</div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-6 w-6 ${
                  star <= Math.round(avgRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-sm font-semibold text-gray-600 mb-4">
            Based on {totalReviews} verified customer review{totalReviews === 1 ? "" : "s"}
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold px-6"
          >
            <MessageSquarePlus className="h-4 w-4" />
            {showForm ? "Cancel Review" : "Write a Verified Review"}
          </Button>
        </div>

        <div className="space-y-2 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = breakdown[rating as keyof typeof breakdown] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-700 w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-500 w-16 text-right">
                  {count} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {submitSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-bold">
          {submitSuccess}
        </div>
      )}

      {/* Interactive Review Form */}
      {showForm && (
        <Card className="p-6 border border-emerald-200 bg-white shadow-lg rounded-3xl">
          <h4 className="text-lg font-extrabold text-gray-900 mb-4">Write Your Review</h4>
          {submitError && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              {submitError}
            </div>
          )}
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Your Overall Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= newRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300 hover:text-amber-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Detailed Review Comment
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share specific details about product quality, performance, and seller experience..."
                className="w-full min-h-[110px] p-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-xl font-bold"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit Review
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Review Filters & Sorting Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-gray-200">
        <h3 className="text-xl font-extrabold text-gray-900">
          Customer Reviews ({filteredReviews.length})
        </h3>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <Filter className="h-4 w-4 text-gray-400 mr-1" />
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-full font-bold transition-colors ${
              filterType === "all" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setFilterType("newest")}
            className={`px-3 py-1.5 rounded-full font-bold transition-colors ${
              filterType === "newest" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => setFilterType("highest")}
            className={`px-3 py-1.5 rounded-full font-bold transition-colors ${
              filterType === "highest" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Highest Rated
          </button>
          <button
            onClick={() => setFilterType("verified")}
            className={`px-3 py-1.5 rounded-full font-bold transition-colors ${
              filterType === "verified" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Verified Purchases
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-8 text-center text-gray-500 text-sm font-medium">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <Card className="p-8 text-center text-gray-500 rounded-3xl border-dashed">
            No reviews match the selected filter.
          </Card>
        ) : (
          filteredReviews.map((review) => {
            const initials = review.customerName
              ? review.customerName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
              : "VB";
            const formattedDate = review.createdAt
              ? new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Recently";

            return (
              <Card key={review.id} className="p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border">
                    <AvatarFallback className="bg-emerald-100 text-emerald-800 font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-gray-900 text-sm">
                            {review.customerName}
                          </h4>
                          {review.isVerifiedPurchase && (
                            <Badge className="gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold border-0">
                              <CheckCircle className="h-3 w-3 text-emerald-600" />
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">{formattedDate}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {review.comment && (
                      <p className="text-gray-700 leading-relaxed text-sm mt-2">
                        {review.comment}
                      </p>
                    )}

                    {/* Customer Review Photos if present */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex items-center gap-2 mt-3 overflow-x-auto">
                        {review.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="Review photo"
                            className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                          />
                        ))}
                      </div>
                    )}

                    {/* Vendor Reply if present */}
                    {review.vendorReply && (
                      <div className="mt-4 p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                          <Store className="h-4 w-4 text-emerald-700" />
                          <span>Merchant Reply</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed font-medium">{review.vendorReply}</p>
                      </div>
                    )}

                    {/* Helpful Vote */}
                    <div className="flex items-center justify-end pt-3 text-xs text-gray-500">
                      <button
                        onClick={() => handleHelpfulVote(review.id)}
                        disabled={votedReviews[review.id]}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border transition-colors ${
                          votedReviews[review.id]
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold"
                            : "hover:bg-gray-100 border-gray-200"
                        }`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        Helpful ({review.helpfulVotes || 0})
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
