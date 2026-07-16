"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { ReviewStatistics } from "@/components/vendor/review-statistics";
import { RatingDistribution } from "@/components/vendor/rating-distribution";
import { ReviewToolbar } from "@/components/vendor/review-toolbar";
import { ReviewsList } from "@/components/vendor/reviews-list";
import { ReviewPagination } from "@/components/vendor/review-pagination";
import { ReviewEmptyState } from "@/components/vendor/review-empty-state";
import { Download, BarChart3 } from "lucide-react";
import type { Review } from "@/components/vendor/review-card";

export default function ReviewsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState("newest");

  // Mock data - replace with actual API call
  const mockReviews: Review[] = Array.from({ length: 100 }, (_, i) => {
    const customerNames = [
      "John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", "David Wilson",
      "Jessica Martinez", "Daniel Garcia", "Ashley Rodriguez", "Christopher Lee", "Amanda Taylor"
    ];
    
    const products = [
      "Wireless Headphones", "Smart Watch", "Laptop Bag", "USB-C Cable", "Power Bank",
      "Ceramic Mug", "Yoga Mat", "LED Lamp", "Water Bottle", "Phone Case"
    ];
    
    const titles = [
      "Great product!",
      "Exceeded expectations",
      "Good value for money",
      "Very satisfied",
      "Highly recommend",
      "",
      "",
      "",
      "",
      ""
    ];
    
    const contents = [
      "This product is exactly what I was looking for. The quality is excellent and it arrived quickly. I'm very happy with my purchase and would definitely buy from this vendor again.",
      "Amazing quality! The product works perfectly and looks even better in person. Fast shipping and great customer service. Highly recommended!",
      "Good product overall. It meets my expectations and the price is reasonable. Would recommend to others looking for something similar.",
      "Perfect! Just what I needed. The quality is great and it arrived on time. Very happy with this purchase.",
      "Love it! This product has made my daily routine so much easier. The quality is top-notch and it's very durable.",
    ];

    const rating = [5, 5, 5, 4, 4, 4, 3, 3, 2, 1][i % 10];
    const hasPhotos = i % 5 === 0;
    const hasReply = i % 3 !== 0;
    
    return {
      id: `review-${i + 1}`,
      customerName: customerNames[i % 10],
      rating,
      productName: products[i % 10],
      productImage: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=100&h=100&fit=crop`,
      reviewTitle: titles[i % 10],
      reviewContent: contents[i % 5],
      reviewDate: new Date(Date.now() - (i * 2 * 86400000)).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      verifiedPurchase: true,
      helpfulCount: ((i * 7 + 3) % 50),
      photos: hasPhotos ? [
        `https://images.unsplash.com/photo-${1500000000000 + i * 1000 + 1}?w=100&h=100&fit=crop`,
        `https://images.unsplash.com/photo-${1500000000000 + i * 1000 + 2}?w=100&h=100&fit=crop`,
      ] : undefined,
      vendorReply: hasReply ? {
        content: "Thank you so much for your positive feedback! We're thrilled to hear that you're happy with your purchase. Your satisfaction is our top priority.",
        date: new Date(Date.now() - (i * 2 * 86400000) + 86400000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      } : undefined,
      hasReply,
      isReported: i === 5,
    };
  });

  const totalReviews = mockReviews.length;
  const totalPages = Math.ceil(totalReviews / itemsPerPage);
  const currentReviews = mockReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleReply = (reviewId: string) => {
    console.log("Reply to review:", reviewId);
  };

  const handleViewProduct = (reviewId: string) => {
    console.log("View product for review:", reviewId);
  };

  const handleReport = (reviewId: string) => {
    console.log("Report review:", reviewId);
  };

  const handleViewDetails = (review: Review) => {
    console.log("View review details:", review);
  };

  const handleExport = () => {
    console.log("Exporting reviews...");
  };

  const handleRefresh = () => {
    console.log("Refreshing reviews...");
  };

  const handleViewAnalytics = () => {
    console.log("View analytics...");
  };

  const handleViewProducts = () => {
    console.log("View products...");
  };

  const showEmptyState = false; // Change based on actual data

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <VendorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Reviews Management
                </h1>
                <p className="text-gray-600">
                  Monitor customer feedback, reply to reviews, and improve satisfaction
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleViewAnalytics}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Statistics */}
            <ReviewStatistics />

            {/* Rating Distribution */}
            <RatingDistribution />

            {/* Toolbar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <ReviewToolbar
                onSearch={setSearchQuery}
                onFilterChange={setFilters}
                onExport={handleExport}
                onRefresh={handleRefresh}
                onSort={setSortBy}
                onViewAnalytics={handleViewAnalytics}
              />
            </div>

            {showEmptyState ? (
              <ReviewEmptyState
                onRefresh={handleRefresh}
                onViewProducts={handleViewProducts}
              />
            ) : (
              <>
                {/* Reviews List */}
                <ReviewsList
                  reviews={currentReviews}
                  onReply={handleReply}
                  onViewProduct={handleViewProduct}
                  onReport={handleReport}
                  onViewDetails={handleViewDetails}
                />

                {/* Pagination */}
                <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 mt-6">
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
    </div>
  );
}
