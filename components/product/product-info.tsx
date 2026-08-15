"use client";

import { Star, ShieldCheck, Flame, Tag, Sparkles, TrendingUp, CheckCircle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductInfoProps {
  name: string;
  brand?: string | null;
  category?: string | null;
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
    <div className="space-y-2">
      {/* Brand & Badges */}
      <div className="flex items-center gap-1.5 flex-wrap text-[10px] sm:text-xs">
        {brand && (
          <span className="font-extrabold uppercase text-gray-400 tracking-wider">
            Brand: <span className="text-gray-900 font-bold">{brand}</span>
          </span>
        )}

        {category && (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 font-bold text-[10px] sm:text-xs px-2 py-0.2 rounded-md border-gray-200">
            {category}
          </Badge>
        )}

        {/* Dynamic System Best Seller Badge */}
        {isBestSeller && (
          <span className="font-extrabold uppercase text-[9px] sm:text-[10px] tracking-wide bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2 py-0.2 rounded-full shadow-2xs">
            🔥 {bestSellerRank ? `#${bestSellerRank} Best Seller` : "Best Seller"}
          </span>
        )}

        {/* Database Marketing Campaign Badges */}
        {campaigns.map((c) => (
          <span
            key={c.id}
            className="font-extrabold uppercase text-[9px] sm:text-[10px] tracking-wide text-white px-2 py-0.2 rounded-full shadow-2xs"
            style={{ backgroundColor: c.color || "#EF4444" }}
          >
            {c.badge || c.name}
          </span>
        ))}

        {sku && (
          <span className="text-[10px] text-gray-400 font-mono ml-auto">
            SKU: {sku}
          </span>
        )}
      </div>

      {/* Main Title */}
      <h1 className="text-base sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-snug">
        {name}
      </h1>

      {/* Ratings & Sales Social Proof */}
      <div className="flex items-center gap-2 text-[10px] sm:text-xs flex-wrap pt-0.5">
        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
          <Star className="h-3 w-3 text-amber-500 fill-amber-400" />
          <span className="font-black text-gray-900 text-xs">
            {Number(rating).toFixed(1)}
          </span>
          <span className="text-gray-500 font-medium text-[10px]">({reviews} reviews)</span>
        </div>

        {soldCount > 0 && (
          <span className="text-gray-500 font-semibold">
            • <strong className="text-gray-900">{soldCount}</strong> sold
          </span>
        )}

        {verified && (
          <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
            <CheckCircle className="h-3 w-3 text-emerald-600" />
            AfriCart Verified
          </span>
        )}
      </div>
    </div>
  );
}
