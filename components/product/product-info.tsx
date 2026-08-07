"use client";

import { Star, ShieldCheck, Flame, Tag, Sparkles, TrendingUp, CheckCircle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductInfoProps {
  name: string;
  brand?: string | null;
  category?: string | null;
  subcategory?: string | null;
  sku?: string | null;
  rating?: number;
  reviews?: number;
  soldCount?: number;
  status?: string;
  badges?: string[];
  campaigns?: any[];
  verified?: boolean;
  isBestSeller?: boolean;
  bestSellerRank?: number | null;
}

export function ProductInfo({
  name,
  brand,
  category,
  subcategory,
  sku,
  rating = 5.0,
  reviews = 0,
  soldCount = 0,
  status = "ACTIVE",
  badges = [],
  campaigns = [],
  verified = true,
  isBestSeller = false,
  bestSellerRank,
}: ProductInfoProps) {
  const badgeColorMap: Record<string, string> = {
    BEST_SELLER: "bg-emerald-100 text-emerald-800 border-emerald-200",
    NEW_ARRIVAL: "bg-blue-100 text-blue-800 border-blue-200",
    TRENDING: "bg-purple-100 text-purple-800 border-purple-200",
    LIMITED_STOCK: "bg-red-100 text-red-800 border-red-200",
    FLASH_SALE: "bg-orange-100 text-orange-800 border-orange-200",
    FEATURED: "bg-amber-100 text-amber-800 border-amber-200",
    VERIFIED: "bg-teal-100 text-teal-800 border-teal-200",
  };

  return (
    <div className="space-y-3">
      {/* Brand & Badges */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        {brand && (
          <span className="font-extrabold uppercase text-gray-500 tracking-wider">
            Brand: <span className="text-gray-900 font-bold">{brand}</span>
          </span>
        )}

        {category && (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 font-bold">
            {category} {subcategory ? `> ${subcategory}` : ""}
          </Badge>
        )}

        {/* Dynamic System Best Seller Badge */}
        {isBestSeller && (
          <span className="font-extrabold uppercase text-[10px] tracking-wide bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
            🔥 {bestSellerRank ? `#${bestSellerRank} Best Seller` : "Best Seller"} {category ? `in ${category}` : ""}
          </span>
        )}

        {/* Database Marketing Campaign Badges */}
        {campaigns.map((c) => (
          <span
            key={c.id}
            className="font-extrabold uppercase text-[10px] tracking-wide text-white px-2.5 py-0.5 rounded-full shadow-xs"
            style={{ backgroundColor: c.color || "#EF4444" }}
          >
            {c.badge || c.name}
          </span>
        ))}

        {sku && (
          <span className="text-[11px] text-gray-400 font-mono ml-auto">
            SKU: {sku}
          </span>
        )}
      </div>

      {/* Main Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
        {name}
      </h1>

      {/* Ratings & Sales Social Proof */}
      <div className="flex items-center gap-4 text-xs flex-wrap pt-1">
        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
          <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
          <span className="font-extrabold text-gray-900 text-sm">
            {Number(rating).toFixed(1)}
          </span>
          <span className="text-gray-500 font-medium">({reviews} customer reviews)</span>
        </div>

        {soldCount > 0 && (
          <div className="flex items-center gap-1 text-gray-600 font-semibold bg-gray-100 px-3 py-1 rounded-xl">
            <Package className="h-3.5 w-3.5 text-gray-500" />
            <span>{soldCount} units sold</span>
          </div>
        )}

        {verified && (
          <div className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Verified Authentic Product
          </div>
        )}
      </div>
    </div>
  );
}
