"use client";

import { X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActiveFiltersProps {
  query?: string;
  selectedCategories: string[];
  categoryNamesMap: Record<string, string>;
  rating?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  onRemoveCategory: (catSlug: string) => void;
  onRemoveRating: () => void;
  onRemovePrice: () => void;
  onRemoveQuery: () => void;
  onRemoveSort: () => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  query,
  selectedCategories,
  categoryNamesMap,
  rating,
  minPrice,
  maxPrice,
  sortBy,
  onRemoveCategory,
  onRemoveRating,
  onRemovePrice,
  onRemoveQuery,
  onRemoveSort,
  onClearAll,
}: ActiveFiltersProps) {
  const hasActivePrice = minPrice !== undefined || maxPrice !== undefined;
  const hasActiveSort = sortBy && sortBy !== "newest";
  const hasFilters =
    Boolean(query) ||
    selectedCategories.length > 0 ||
    Boolean(rating) ||
    hasActivePrice ||
    hasActiveSort;

  if (!hasFilters) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-gray-700 uppercase tracking-wider mr-1">
          Active Filters:
        </span>

        {/* Search Query Pill */}
        {query && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
            Search: &quot;{query}&quot;
            <button
              onClick={onRemoveQuery}
              className="hover:bg-emerald-200 text-emerald-900 rounded-full p-0.5 transition-colors"
              title="Remove Search"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {/* Category Pills */}
        {selectedCategories.map((catSlug) => {
          const displayName = categoryNamesMap[catSlug] || catSlug;
          return (
            <span
              key={catSlug}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold"
            >
              {displayName}
              <button
                onClick={() => onRemoveCategory(catSlug)}
                className="hover:bg-emerald-200 text-emerald-900 rounded-full p-0.5 transition-colors"
                title={`Remove ${displayName}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          );
        })}

        {/* Rating Pill */}
        {rating && rating > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-semibold">
            {rating}★ &amp; up
            <button
              onClick={onRemoveRating}
              className="hover:bg-amber-200 text-amber-900 rounded-full p-0.5 transition-colors"
              title="Remove Rating Filter"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {/* Price Range Pill */}
        {hasActivePrice && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 font-semibold">
            Price: {minPrice !== undefined ? `GH₵${minPrice}` : "GH₵0"} - {maxPrice !== undefined ? `GH₵${maxPrice}` : "Any"}
            <button
              onClick={onRemovePrice}
              className="hover:bg-blue-200 text-blue-900 rounded-full p-0.5 transition-colors"
              title="Remove Price Filter"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {/* Sort Pill */}
        {hasActiveSort && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200 font-semibold">
            Sort: {sortBy === "best_sellers" ? "Best Sellers" : sortBy === "rating" ? "Top Rated" : sortBy === "price_asc" ? "Price: Low to High" : sortBy === "price_desc" ? "Price: High to Low" : sortBy}
            <button
              onClick={onRemoveSort}
              className="hover:bg-purple-200 text-purple-900 rounded-full p-0.5 transition-colors"
              title="Reset Sort"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 font-bold gap-1 px-3 py-1.5 h-auto rounded-xl"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Clear All
      </Button>
    </div>
  );
}
