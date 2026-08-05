"use client";

import { Select } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

export function SortDropdown() {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-gray-500" />
      <Select defaultValue="featured">
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
        <option value="best-selling">Best Selling</option>
        <option value="highest-rated">Highest Rated</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </Select>
    </div>
  );
}
