"use client";

import { 
  Star, 
  MessageSquare, 
  CheckCircle,
} from "lucide-react";

interface ReviewStatisticsProps {
  totalReviews?: number;
  avgRating?: number;
  fiveStarCount?: number;
}

export function ReviewStatistics({
  totalReviews = 0,
  avgRating = 5.0,
  fiveStarCount = 0,
}: ReviewStatisticsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Store Reviews</p>
            <h3 className="text-3xl font-extrabold text-gray-900">{totalReviews}</h3>
            <p className="text-xs text-gray-400 mt-1">Verified buyer reviews</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <MessageSquare className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Average Store Rating</p>
            <h3 className="text-3xl font-extrabold text-amber-500">★ {avgRating.toFixed(1)}</h3>
            <p className="text-xs text-gray-400 mt-1">Across all vendor items</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
            <Star className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">5-Star Feedback</p>
            <h3 className="text-3xl font-extrabold text-emerald-600">{fiveStarCount}</h3>
            <p className="text-xs text-gray-400 mt-1">Top-rated purchases</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
