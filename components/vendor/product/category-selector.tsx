"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

interface CategorySelectorProps {
  category?: string;
  vendorCategories?: string[];
  onCategoryChange?: (category: string) => void;
}

export default function CategorySelector({
  category = "",
  vendorCategories = [],
  onCategoryChange,
}: CategorySelectorProps) {
  const isSingleCategory = vendorCategories.length === 1;

  // Auto-select single category if vendor only has 1 authorized category
  useEffect(() => {
    if (isSingleCategory && vendorCategories[0] && category !== vendorCategories[0]) {
      onCategoryChange?.(vendorCategories[0]);
    }
  }, [isSingleCategory, vendorCategories, category, onCategoryChange]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Category</h2>

      <div className="space-y-4">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Category <span className="text-red-600">*</span>
          </label>

          {isSingleCategory ? (
            <div className="flex items-center justify-between px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-800 font-medium">
              <span>{vendorCategories[0]}</span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                <Lock className="w-3 h-3 text-emerald-600" /> Locked to Store
              </span>
            </div>
          ) : (
            <select
              value={category}
              onChange={(e) => onCategoryChange?.(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
            >
              <option value="">Select authorized category</option>
              {vendorCategories.map((catName) => (
                <option key={catName} value={catName}>
                  {catName}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Selected Path */}
        {category && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-gray-500">Selected Product Category:</span>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 border border-emerald-200">
              {category}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}
