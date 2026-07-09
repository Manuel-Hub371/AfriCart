"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CategorySelector() {
  const [category, setCategory] = useState("");
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
              setCategory(e.target.value);
              setSubcategory("");
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

        {/* Product Collection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Collection
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>No collection</option>
            <option>Summer Collection</option>
            <option>New Arrivals</option>
            <option>Best Sellers</option>
          </select>
        </div>

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
