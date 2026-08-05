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

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
            <p className="text-gray-600">
              Review your purchases and manage your feedback
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Your Submitted Reviews ({reviews.length})
            </h2>

            {isLoading ? (
              <div className="py-12 text-center text-gray-500">
                Loading your reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
                You haven&apos;t submitted any reviews yet.
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => {
                  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });

                  return (
                    <div key={review.id} className="bg-white rounded-lg border p-6">
                      <div className="flex gap-4">
                        {review.productImage ? (
                          <img
                            src={review.productImage}
                            alt={review.productName || "Product"}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 text-emerald-700 font-bold text-lg">
                            {review.productName ? review.productName[0] : "P"}
                          </div>
                        )}
                        <div className="flex-1">
                          <Link
                            href={`/product/${review.productId}`}
                            className="font-semibold text-gray-900 hover:text-emerald-600"
                          >
                            {review.productName || "Product"}
                          </Link>
                          <div className="mt-2">{renderStars(review.rating)}</div>
                          {review.comment && (
                            <p className="text-gray-700 mt-3 text-sm">{review.comment}</p>
                          )}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500">{formattedDate}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deletingId === review.id}
                              onClick={() => handleDeleteReview(review.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1.5"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
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
