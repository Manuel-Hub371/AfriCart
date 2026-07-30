"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategorySelectorProps {
  category?: string;
  onCategoryChange?: (category: string) => void;
}

export default function CategorySelector({
  category = "",
  onCategoryChange,
}: CategorySelectorProps) {
  const [subcategory, setSubcategory] = useState("");

  const categories = [
    {
      name: "Electronics",
      subcategories: ["Phones", "Computers", "Cameras", "Audio"],
    },
    {
      name: "Fashion",
      subcategories: ["Men", "Women", "Kids", "Accessories"],
    },
    {
      name: "Home & Garden",
      subcategories: ["Furniture", "Decor", "Kitchen", "Garden"],
    },
    {
      name: "Beauty",
      subcategories: ["Skincare", "Makeup", "Haircare", "Fragrances"],
    },
    {
      name: "Groceries",
      subcategories: ["Fresh Foods", "Spices", "Snacks", "Beverages"],
    },
    {
      name: "Other",
      subcategories: ["General"],
    },
  ];

  const selectedCategory = categories.find((c) => c.name === category);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Category</h2>

      <div className="space-y-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-600">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => {
              onCategoryChange?.(e.target.value);
              setSubcategory("");
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        {selectedCategory && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory
            </label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            >
              <option value="">Select subcategory</option>
              {selectedCategory.subcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Selected Path */}
        {category && (
          <div className="flex items-center gap-2 pt-2">
            <Badge variant="secondary">{category}</Badge>
            {subcategory && (
              <>
                <span className="text-gray-400">→</span>
                <Badge variant="secondary">{subcategory}</Badge>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
