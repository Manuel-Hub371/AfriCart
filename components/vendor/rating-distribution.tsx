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
        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
        <span className="text-sm font-medium text-gray-700">{stars} Star{stars !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-amber-400 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-700 w-12 text-right">{percentage}%</span>
      <span className="text-xs text-gray-500 w-16 text-right">({count})</span>
    </div>
  );
}

interface RatingDistributionProps {
  ratingsData?: { stars: number; percentage: number; count: number }[];
}

export function RatingDistribution({ ratingsData }: RatingDistributionProps) {
  const defaultRatings = [
    { stars: 5, percentage: 85, count: 17 },
    { stars: 4, percentage: 10, count: 2 },
    { stars: 3, percentage: 5, count: 1 },
    { stars: 2, percentage: 0, count: 0 },
    { stars: 1, percentage: 0, count: 0 },
  ];

  const ratings = ratingsData || defaultRatings;

  const totalReviews = ratings.reduce((sum, r) => sum + r.count, 0);
  const averageRating = totalReviews > 0
    ? (ratings.reduce((sum, r) => sum + (r.stars * r.count), 0) / totalReviews).toFixed(1)
    : "5.0";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Rating Distribution</h3>
          <p className="text-sm text-gray-500">Customer feedback breakdown</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1 justify-end">
            <span className="text-4xl font-extrabold text-gray-900">{averageRating}</span>
            <Star className="h-7 w-7 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-sm text-gray-500 font-medium">{totalReviews} verified reviews</p>
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
