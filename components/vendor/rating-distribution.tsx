"use client";

import { Star } from "lucide-react";

interface RatingBarProps {
  stars: number;
  percentage: number;
  count: number;
}

function RatingBar({ stars, percentage, count }: RatingBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 w-24">
        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        <span className="text-sm font-medium text-gray-700">{stars} Star{stars !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-700 w-12 text-right">{percentage}%</span>
      <span className="text-xs text-gray-500 w-16 text-right">({count})</span>
    </div>
  );
}

export function RatingDistribution() {
  const ratings = [
    { stars: 5, percentage: 68, count: 1936 },
    { stars: 4, percentage: 18, count: 512 },
    { stars: 3, percentage: 8, count: 228 },
    { stars: 2, percentage: 4, count: 114 },
    { stars: 1, percentage: 2, count: 57 },
  ];

  const totalReviews = ratings.reduce((sum, r) => sum + r.count, 0);
  const averageRating = (
    ratings.reduce((sum, r) => sum + (r.stars * r.count), 0) / totalReviews
  ).toFixed(1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Rating Distribution</h3>
          <p className="text-sm text-gray-600">Customer feedback breakdown</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-4xl font-bold text-gray-900">{averageRating}</span>
            <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
          </div>
          <p className="text-sm text-gray-600">{totalReviews.toLocaleString()} reviews</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {ratings.map((rating) => (
          <RatingBar key={rating.stars} {...rating} />
        ))}
      </div>
    </div>
  );
}
