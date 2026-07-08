"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import { Button } from "@/components/ui/button";
import { Star, Edit } from "lucide-react";
import Link from "next/link";

const pendingReviews = [
  {
    id: "1",
    productId: "p1",
    productName: "Premium Wireless Headphones",
    productImage: "bg-gradient-to-br from-blue-400 to-blue-500",
    purchaseDate: "July 5, 2026",
    vendor: "Tech World",
  },
  {
    id: "2",
    productId: "p2",
    productName: "Smart Watch Pro",
    productImage: "bg-gradient-to-br from-purple-400 to-purple-500",
    purchaseDate: "July 3, 2026",
    vendor: "Fashion Hub",
  },
];

const submittedReviews = [
  {
    id: "1",
    productId: "p3",
    productName: "Designer Sneakers",
    productImage: "bg-gradient-to-br from-pink-400 to-pink-500",
    rating: 5,
    review:
      "Absolutely love these sneakers! The quality is amazing and they're so comfortable. Highly recommend!",
    date: "June 28, 2026",
    vendor: "Shoe Palace",
  },
  {
    id: "2",
    productId: "p4",
    productName: "Leather Backpack",
    productImage: "bg-gradient-to-br from-orange-400 to-orange-500",
    rating: 4,
    review:
      "Great backpack with plenty of storage. The leather quality is good but could be better for the price.",
    date: "June 20, 2026",
    vendor: "Bag Store",
  },
  {
    id: "3",
    productId: "p5",
    productName: "Wireless Mouse",
    productImage: "bg-gradient-to-br from-gray-400 to-gray-500",
    rating: 5,
    review:
      "Perfect mouse for work. Very responsive and the battery lasts forever. Worth every penny!",
    date: "June 15, 2026",
    vendor: "Tech Accessories",
  },
];

export default function ReviewsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              Review your purchases and see your feedback
            </p>
          </div>

          {/* Pending Reviews */}
          {pendingReviews.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Pending Reviews ({pendingReviews.length})
              </h2>
              <div className="space-y-4">
                {pendingReviews.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border p-6"
                  >
                    <div className="flex gap-4">
                      <div
                        className={`w-24 h-24 ${item.productImage} rounded-lg flex-shrink-0`}
                      />
                      <div className="flex-1">
                        <Link
                          href={`/product/${item.productId}`}
                          className="font-semibold text-gray-900 hover:text-emerald-600"
                        >
                          {item.productName}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.vendor}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Purchased on {item.purchaseDate}
                        </p>
                        <Button className="mt-4" size="sm">
                          Write Review
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submitted Reviews */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Your Reviews ({submittedReviews.length})
            </h2>
            <div className="space-y-4">
              {submittedReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg border p-6">
                  <div className="flex gap-4">
                    <div
                      className={`w-24 h-24 ${review.productImage} rounded-lg flex-shrink-0`}
                    />
                    <div className="flex-1">
                      <Link
                        href={`/product/${review.productId}`}
                        className="font-semibold text-gray-900 hover:text-emerald-600"
                      >
                        {review.productName}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        {review.vendor}
                      </p>
                      <div className="mt-2">{renderStars(review.rating)}</div>
                      <p className="text-gray-700 mt-3">{review.review}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <p className="text-sm text-gray-500">{review.date}</p>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
