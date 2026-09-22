"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, MessageSquare, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/home/section-header";
import { apiFetch } from "@/lib/api/client";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  isVerifiedPurchase?: boolean;
  customerName: string;
  avatar?: string | null;
  productId: string;
  productName?: string;
  productSlug?: string;
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "AC";
}

export function CustomerReviews({ initialReviews }: { initialReviews?: ReviewItem[] }) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews || []);
  const [isLoading, setIsLoading] = useState(!initialReviews || initialReviews.length === 0);

  useEffect(() => {
    if (initialReviews && initialReviews.length > 0) return;
    async function loadReviews() {
      try {
        setIsLoading(true);
        const res = await apiFetch("/api/marketplace/reviews?limit=6");
        if (res.ok) {
          const data = await res.json();
          setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
        }
      } catch (err) {
        console.error("Failed to load customer reviews:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReviews();
  }, [initialReviews]);

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white via-green-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Customer Reviews"
          title={<>What Our Customers Are <span className="text-gradient">Saying</span></>}
          subtitle="Honest feedback from shoppers who have already bought through AfriCart vendors."
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3 animate-pulse">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="h-4 w-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-2.5 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-2 -mx-4 sm:-mx-6 px-4 sm:px-6 md:mx-0 md:px-0">
            {reviews.map((review, index) => (
              <Card
                key={review.id}
                className="group shrink-0 w-[85%] sm:w-[60%] md:w-auto bg-white border border-gray-200/80 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 rounded-2xl p-5 sm:p-6 flex flex-col"
              >
                {/* Rating stars */}
                <div className="flex items-center gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${s <= (review.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <blockquote className="flex-1 text-sm text-gray-700 font-medium leading-relaxed mb-4">
                  <span aria-hidden="true" className="text-emerald-500">“</span>
                  {review.comment}
                  <span aria-hidden="true" className="text-emerald-500">”</span>
                </blockquote>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={`${review.customerName} avatar`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{initials(review.customerName)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{review.customerName}</p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1 truncate">
                      {review.isVerifiedPurchase !== false && (
                        <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                      )}
                      {review.productName ? (
                        <Link
                          href={`/product/${review.productId}`}
                          className="truncate hover:text-emerald-600 transition-colors"
                        >
                          Verified purchase on {review.productName}
                        </Link>
                      ) : (
                        <span>Verified AfriCart shopper</span>
                      )}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-1">
              No reviews just yet
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              When shoppers start leaving reviews, their authentic feedback will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}