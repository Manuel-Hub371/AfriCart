"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import { Button } from "@/components/ui/button";
import { Star, Trash2 } from "lucide-react";
import Link from "next/link";

interface CustomerReview {
  id: string;
  productId: string;
  productName?: string;
  productImage?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyReviews() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/profile/reviews");
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error("Failed to load customer reviews:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMyReviews();
  }, []);

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      setDeletingId(reviewId);
      const res = await fetch(`/api/profile/reviews?id=${reviewId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      }
    } catch (err) {
      console.error("Failed to delete review:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-4">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs">
            <div>
              <h1 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                My Reviews
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Feedback and ratings submitted on your purchases ({reviews.length})
              </p>
            </div>
            <Link href="/profile/orders">
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-bold rounded-lg border-gray-200 hover:bg-gray-50">
                <span>View My Orders</span>
              </Button>
            </Link>
          </div>

          <div>
            {isLoading ? (
              <div className="py-12 text-center text-gray-400 text-xs font-semibold">
                Loading your reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-400 text-xs font-medium">
                You haven&apos;t submitted any product reviews yet.
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => {
                  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div key={review.id} className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-2xs hover:border-gray-300 transition-all">
                      <div className="flex gap-3">
                        {review.productImage ? (
                          <img
                            src={review.productImage}
                            alt={review.productName || "Product"}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-100 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                            {review.productName?.[0] || "P"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link href={`/product/${review.productId}`}>
                                <h3 className="font-bold text-gray-900 text-xs sm:text-sm hover:text-emerald-600 truncate">
                                  {review.productName || "Purchased Product"}
                                </h3>
                              </Link>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3 w-3 ${
                                        star <= review.rating
                                          ? "fill-amber-400 text-amber-400"
                                          : "text-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium">
                                  {formattedDate}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deletingId === review.id}
                              onClick={() => handleDeleteReview(review.id)}
                              className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-7 w-7 p-0 rounded-lg"
                              title="Delete Review"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          {review.comment && (
                            <p className="text-xs text-gray-700 mt-2 bg-gray-50/80 p-2.5 rounded-lg border border-gray-100 font-medium leading-relaxed">
                              &ldquo;{review.comment}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
