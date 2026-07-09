"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star, MessageCircle } from "lucide-react";

const reviews = [
  {
    id: "1",
    product: "Premium Wireless Headphones",
    customer: "John Doe",
    rating: 5,
    review:
      "Amazing quality! The sound is crystal clear and noise cancellation works perfectly.",
    date: "July 8, 2026",
    status: "Published",
    reply: null,
  },
  {
    id: "2",
    product: "Smart Watch Pro",
    customer: "Jane Smith",
    rating: 4,
    review:
      "Great watch with lots of features. Battery life could be better though.",
    date: "July 5, 2026",
    status: "Published",
    reply: "Thank you for your feedback! We're working on battery optimization.",
  },
  {
    id: "3",
    product: "Wireless Mouse",
    customer: "Mike Johnson",
    rating: 5,
    review: "Perfect for work. Very responsive and comfortable to use.",
    date: "July 3, 2026",
    status: "Published",
    reply: null,
  },
  {
    id: "4",
    product: "USB-C Cable",
    customer: "Sarah Wilson",
    rating: 3,
    review: "Works fine but a bit short for my setup.",
    date: "July 1, 2026",
    status: "Pending",
    reply: null,
  },
];

const statusColors: Record<string, string> = {
  Published: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Hidden: "bg-gray-100 text-gray-700",
};

export default function VendorReviewsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
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

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Product Reviews
            </h1>
            <p className="text-gray-600">Manage customer feedback</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-amber-500">4.6</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">1,245</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">5 Stars</p>
              <p className="text-2xl font-bold text-green-600">892</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">24</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Reply Rate</p>
              <p className="text-2xl font-bold text-blue-600">78%</p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input placeholder="Search reviews..." className="pl-10" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">{review.date}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {review.product}
                    </h3>
                    <p className="text-sm text-gray-600">by {review.customer}</p>
                  </div>
                  <Badge className={statusColors[review.status]}>
                    {review.status}
                  </Badge>
                </div>

                <p className="text-gray-700 mb-4">{review.review}</p>

                {review.reply && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-600">
                        Your Reply
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{review.reply}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {!review.reply && (
                    <Button variant="outline" size="sm">
                      Reply
                    </Button>
                  )}
                  {review.status === "Pending" && (
                    <>
                      <Button size="sm">Publish</Button>
                      <Button variant="outline" size="sm">
                        Hide
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
