"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle } from "lucide-react";
import { Select } from "@/components/ui/select";

const reviews = [
  {
    id: 1,
    name: "John Smith",
    avatar: "JS",
    rating: 5,
    date: "3 days ago",
    verified: true,
    comment: "Excellent product! The quality exceeded my expectations. Fast shipping and great packaging. Highly recommend!",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "SJ",
    rating: 5,
    date: "1 week ago",
    verified: true,
    comment: "Love it! Works perfectly as described. The seller was very responsive to my questions.",
  },
  {
    id: 3,
    name: "Michael Chen",
    avatar: "MC",
    rating: 4,
    date: "2 weeks ago",
    verified: true,
    comment: "Good product overall. Minor issue with packaging but the product itself is great.",
  },
];

export function ReviewSection() {
  return (
    <div className="space-y-6">
      {/* Overall Rating */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="text-6xl font-bold text-gray-900 mb-2">4.8</div>
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
          <div className="text-gray-600">Based on 2,450 reviews</div>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-8">{rating}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full"
                  style={{
                    width:
                      rating === 5
                        ? "85%"
                        : rating === 4
                        ? "10%"
                        : rating === 3
                        ? "3%"
                        : "2%",
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-16">
                {rating === 5
                  ? "2,083"
                  : rating === 4
                  ? "245"
                  : rating === 3
                  ? "73"
                  : "49"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sort */}
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
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {review.name}
                      </h4>
                      {review.verified && (
                        <Badge className="gap-1 bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                          <CheckCircle className="h-3 w-3" />
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
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
                <p className="text-gray-600 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
