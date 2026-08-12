"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Star, RotateCcw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FilterSidebarProps {
  categories: any[];
  selectedCategories: string[];
  onCategoryToggle: (catSlug: string) => void;
  selectedRating?: number;
  onRatingSelect: (rating: number | undefined) => void;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange: (min?: number, max?: number) => void;
  onClearAll: () => void;
}

export function FilterSidebar({
  categories,
  selectedCategories,
  onCategoryToggle,
  selectedRating,
  onRatingSelect,
  minPrice,
  maxPrice,
  onPriceChange,
  onClearAll,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    rating: true,
  });

  const [minInput, setMinInput] = useState<string>(minPrice !== undefined ? String(minPrice) : "");
  const [maxInput, setMaxInput] = useState<string>(maxPrice !== undefined ? String(maxPrice) : "");

  useEffect(() => {
    setMinInput(minPrice !== undefined ? String(minPrice) : "");
  }, [minPrice]);

  useEffect(() => {
    setMaxInput(maxPrice !== undefined ? String(maxPrice) : "");
  }, [maxPrice]);

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const handleApplyPrice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const minVal = minInput.trim() !== "" ? parseFloat(minInput) : undefined;
    const maxVal = maxInput.trim() !== "" ? parseFloat(maxInput) : undefined;
    onPriceChange(minVal, maxVal);
  };

  const RATING_OPTIONS = [
    { label: "4.0 & up", stars: 4 },
    { label: "3.0 & up", stars: 3 },
    { label: "2.0 & up", stars: 2 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 font-bold gap-1 px-2.5 py-1.5 h-auto rounded-xl transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Clear All
        </Button>
      </div>

      {/* Categories */}
      <div className="border-b border-gray-100 pb-5">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full text-left py-1"
        >
          <h3 className="font-bold text-gray-900 text-sm tracking-wide">Categories</h3>
          {openSections.category ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {openSections.category && (
          <div className="space-y-2 mt-3 max-h-72 overflow-y-auto pr-1">
            {categories.map((cat) => {
              const catSlug = cat.slug || cat.id || cat.name.toLowerCase();
              const isChecked = selectedCategories.includes(catSlug);
              return (
                <label
                  key={cat.id || catSlug}
                  className="flex items-center justify-between group cursor-pointer text-xs font-medium text-gray-700 hover:text-emerald-700 select-none py-1 px-1.5 rounded-lg hover:bg-emerald-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onCategoryToggle(catSlug)}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className={isChecked ? "font-bold text-emerald-900" : ""}>
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono group-hover:text-emerald-600">
                    ({cat.productCount || 0})
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="border-b border-gray-100 pb-5">
        <button
          onClick={() => toggleSection("rating")}
          className="flex items-center justify-between w-full text-left py-1"
        >
          <h3 className="font-bold text-gray-900 text-sm tracking-wide">Customer Rating</h3>
          {openSections.rating ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {openSections.rating && (
          <div className="space-y-2 mt-3">
            {RATING_OPTIONS.map((opt) => {
              const isSelected = selectedRating === opt.stars;
              return (
                <button
                  key={opt.stars}
                  onClick={() => onRatingSelect(isSelected ? undefined : opt.stars)}
                  className={`w-full flex items-center justify-between text-xs py-2 px-3 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-xs"
                      : "border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50/30"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < opt.stars ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{opt.label}</span>
                  </div>
                  {isSelected && <span className="text-[10px] text-amber-700 uppercase font-bold">Selected</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="pb-2">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left py-1"
        >
          <h3 className="font-bold text-gray-900 text-sm tracking-wide">Price Range (GH₵)</h3>
          {openSections.price ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {openSections.price && (
          <form onSubmit={handleApplyPrice} className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Min Price</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">GH₵</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minInput}
                    onChange={(e) => setMinInput(e.target.value)}
                    className="pl-9 h-9 text-xs font-medium rounded-xl border-gray-200"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Max Price</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">GH₵</span>
                  <Input
                    type="number"
                    placeholder="Any"
                    value={maxInput}
                    onChange={(e) => setMaxInput(e.target.value)}
                    className="pl-9 h-9 text-xs font-medium rounded-xl border-gray-200"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: "Under GH₵100", min: undefined, max: 100 },
                { label: "GH₵100–500", min: 100, max: 500 },
                { label: "GH₵500+", min: 500, max: undefined },
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMinInput(preset.min !== undefined ? String(preset.min) : "");
                    setMaxInput(preset.max !== undefined ? String(preset.max) : "");
                    onPriceChange(preset.min, preset.max);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 text-[11px] font-semibold text-gray-700 hover:text-emerald-800 border border-transparent hover:border-emerald-200 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Apply Price Filter
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
