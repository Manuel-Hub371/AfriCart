"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReviewStatistics } from "@/components/vendor/review-statistics";
import { RatingDistribution } from "@/components/vendor/rating-distribution";
import { ReviewToolbar } from "@/components/vendor/review-toolbar";
import { ReviewsList } from "@/components/vendor/reviews-list";
import { ReviewPagination } from "@/components/vendor/review-pagination";
import { ReviewEmptyState } from "@/components/vendor/review-empty-state";
import { Download, MessageSquare, X, Send, Loader2 } from "lucide-react";
import type { Review } from "@/components/vendor/review-card";

export default function ReviewsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState("newest");
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [avgRating, setAvgRating] = useState(5.0);
  const [fiveStarCount, setFiveStarCount] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState<Record<number, number>>({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Reply Modal State
  const [replyingReview, setReplyingReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const fetchVendorReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/vendor/reviews?page=${currentPage}&limit=${itemsPerPage}`);
      if (res.ok) {
        const data = await res.json();
        const rawReviews = data.reviews || [];
        const mappedReviews: Review[] = rawReviews.map((r: any) => ({
          id: r.id,
          productId: r.productId,
          customerName: r.customerName || "Customer",
          rating: r.rating,
          productName: r.productName || "Product",
          productImage: r.productImage || "",
          reviewTitle: `${r.rating} Star Customer Feedback`,
          reviewContent: r.comment || "No written comment provided.",
          reviewDate: new Date(r.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          verifiedPurchase: true,
          helpfulCount: 0,
          vendorReply: r.vendorReply
            ? {
                content: r.vendorReply,
                date: r.vendorRepliedAt
                  ? new Date(r.vendorRepliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : "Recently",
              }
            : undefined,
          hasReply: !!r.vendorReply,
          isReported: false,
        }));

        setReviews(mappedReviews);
        setTotalReviews(data.total ?? mappedReviews.length);
        setAvgRating(data.averageRating ?? 5.0);

        if (data.ratingBreakdown) {
          setRatingBreakdown(data.ratingBreakdown);
          setFiveStarCount(data.ratingBreakdown[5] || 0);
        } else {
          const count5 = mappedReviews.filter((r) => r.rating === 5).length;
          setFiveStarCount(count5);
        }
      }
    } catch (err) {
      console.error("Failed to fetch vendor store reviews:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchVendorReviews();
  }, [fetchVendorReviews]);

  // Format rating distribution array for RatingDistribution component
  const formattedRatingsData = [5, 4, 3, 2, 1].map((star) => {
    const count = ratingBreakdown[star] || 0;
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars: star, percentage, count };
  });

  const totalPages = Math.ceil(totalReviews / itemsPerPage) || 1;

  const handleExport = () => {
    if (reviews.length === 0) return;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Review ID,Customer,Product,Rating,Comment,Date,Vendor Reply"]
        .concat(
          reviews.map(
            (r) =>
              `"${r.id}","${r.customerName}","${r.productName}",${r.rating},"${r.reviewContent}","${r.reviewDate}","${r.vendorReply?.content || ""}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vendor_reviews_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenReplyModal = (reviewId: string) => {
    const target = reviews.find((r) => r.id === reviewId);
    if (target) {
      setReplyingReview(target);
      setReplyText(target.vendorReply?.content || "");
    }
  };

  const handleSubmitReply = async () => {
    if (!replyingReview || !replyText.trim()) return;

    try {
      setIsSubmittingReply(true);
      const res = await fetch(`/api/vendor/reviews/${replyingReview.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorReply: replyText }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit reply");
      }

      await fetchVendorReviews();
      setReplyingReview(null);
      setReplyText("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleViewProduct = (productIdOrReviewId: string) => {
    const rev = reviews.find((r) => r.id === productIdOrReviewId);
    const targetId = rev ? rev.productId : productIdOrReviewId;
    if (targetId) {
      router.push(`/vendor/products/${targetId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <VendorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <VendorTopbar
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumbs={[
            { label: "Dashboard", href: "/vendor" },
            { label: "Reviews" },
          ]}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                  Customer Reviews
                </h1>
                <p className="text-gray-600 text-sm">
                  Monitor buyer feedback, track rating trends, and respond to reviews across your catalog.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={reviews.length === 0}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50 rounded-xl"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Dynamic Statistics */}
            <ReviewStatistics
              totalReviews={totalReviews}
              avgRating={avgRating}
              fiveStarCount={fiveStarCount}
            />

            {/* Real Rating Distribution */}
            <RatingDistribution ratingsData={formattedRatingsData} />

            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
              <ReviewToolbar
                onSearch={setSearchQuery}
                onFilterChange={setFilters}
                onExport={handleExport}
                onRefresh={fetchVendorReviews}
                onSort={setSortBy}
                onViewAnalytics={() => {}}
              />
            </div>

            {isLoading ? (
              <div className="py-24 flex items-center justify-center text-gray-500 text-sm font-medium">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600 mr-2" /> Loading store customer reviews...
              </div>
            ) : reviews.length === 0 ? (
              <ReviewEmptyState
                onRefresh={fetchVendorReviews}
                onViewProducts={() => router.push("/vendor/products")}
              />
            ) : (
              <>
                {/* Reviews List */}
                <ReviewsList
                  reviews={reviews}
                  onReply={handleOpenReplyModal}
                  onViewProduct={handleViewProduct}
                  onReport={() => alert("Review report flagged for administrator inspection.")}
                  onViewDetails={(r) => handleViewProduct(r.productId || r.id)}
                />

                {/* Pagination */}
                <div className="bg-white rounded-2xl border border-gray-200 px-6 py-4 mt-6 shadow-sm">
                  <ReviewPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalReviews}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(items) => {
                      setItemsPerPage(items);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* VENDOR REPLY MODAL */}
      {replyingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 max-w-lg w-full shadow-xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setReplyingReview(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">Respond to Review</h3>
                <p className="text-xs text-gray-500">Customer: {replyingReview.customerName}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 mb-4 text-xs space-y-1">
              <p className="font-bold text-gray-900">{replyingReview.productName}</p>
              <p className="text-gray-600 italic">&quot;{replyingReview.reviewContent}&quot;</p>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold text-gray-900">Your Store Response</label>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your official vendor response to this customer review..."
                className="w-full p-3 rounded-2xl border border-gray-200 text-sm focus:border-emerald-500 focus:outline-none bg-white"
              />
              <p className="text-xs text-gray-400">
                Your reply will be displayed on the public product page and customer account portal.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setReplyingReview(null)}
                className="rounded-xl border-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReply}
                disabled={isSubmittingReply || !replyText.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold px-6"
              >
                {isSubmittingReply ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" /> Send Response
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
