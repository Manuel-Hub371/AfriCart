"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Select } from "@/components/ui/select";

const reviews = [
  {
    id: 1,
    name: "John Smith",
    avatar: "JS",
    rating: 5,
    date: "2 days ago",
    comment: "Excellent service and fast shipping! The product quality exceeded my expectations. Highly recommend this store!",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "SJ",
    rating: 5,
    date: "1 week ago",
    comment: "Great products and professional customer service. Will definitely shop here again.",
  },
  {
    id: 3,
    name: "Michael Chen",
    avatar: "MC",
    rating: 4,
    date: "2 weeks ago",
    comment: "Good quality products. Shipping was a bit slow but the products are worth the wait.",
  },
  {
    id: 4,
    name: "Emily Davis",
    avatar: "ED",
    rating: 5,
    date: "3 weeks ago",
    comment: "Amazing store! The product descriptions are accurate and the packaging was secure. Very satisfied!",
  },
];

export function StoreReviews() {
  return (
    <div className="space-y-6">
      {/* Overall Rating */}
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">4.8</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= 4.8
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-gray-600">Based on 1,234 reviews</div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: rating === 5 ? "85%" : rating === 4 ? "10%" : "5%",
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">
                  {rating === 5 ? "1,050" : rating === 4 ? "123" : "61"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Sort & Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
        <Select defaultValue="recent">
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
          <option value="helpful">Most Helpful</option>
        </Select>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary-100 text-primary font-semibold">
                  {review.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {review.name}
                    </h4>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
