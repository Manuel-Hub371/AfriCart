"use client";

import { Select } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

export function StoreSort() {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-gray-500" />
      <Select defaultValue="featured">
        <option value="featured">Featured</option>
        <option value="popular">Most Popular</option>
        <option value="highest-rated">Highest Rated</option>
        <option value="most-products">Most Products</option>
        <option value="newest">Newest Stores</option>
      </Select>
    </div>
  );
}
