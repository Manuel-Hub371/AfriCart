"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Eye, CheckCircle, Images, Zap, Package } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  brand?: string;
  storeName: string;
  verified?: boolean;
  rating: number;
  reviews: number;

  /** Effective (campaign-adjusted) selling price — from API */
  price: number;
  /** Base product price (used for strikethrough when discounted) — from API */
  originalPrice?: number;

  // Campaign pricing fields from API — never computed on the frontend
  isDiscounted?: boolean;
  discountPercent?: number;
  amountSaved?: number;
  campaignBadge?: string | null;
  campaignColor?: string | null;
  campaignName?: string | null;

  image?: string | string[];
  inStock?: boolean;
  imagesCount?: number;
  isBestSeller?: boolean;
}



export function ProductCard({
  id,
  name,
  brand,
  storeName,
  verified = false,
  rating,
  reviews,
  price,
  originalPrice,
  isDiscounted = false,
  discountPercent = 0,
  amountSaved = 0,
  campaignBadge,
  campaignColor,
  campaignName,
  image,
  inStock = true,
  imagesCount,
  isBestSeller = false,
}: ProductCardProps) {
  const displayImageCount = imagesCount ?? 1;

  // Campaign tag to show (badge text takes priority, then campaign name)
  const campaignTag = campaignBadge || campaignName;
  const tagColor = campaignColor || "#EF4444";

  // Extract primary image URL safely
  const getPrimaryImage = (): string => {
    if (Array.isArray(image) && image.length > 0 && typeof image[0] === "string") {
      return image[0];
    }
    if (typeof image === "string" && image.trim()) {
      if (image.startsWith("[") && image.endsWith("]")) {
        try {
          const parsed = JSON.parse(image);
          if (Array.isArray(parsed) && parsed[0]) return parsed[0];
        } catch {
          // invalid JSON, use raw
        }
      }
      if (image.startsWith("http") || image.startsWith("/")) {
        return image;
      }
    }
    return "";
  };

  const [imgSrc, setImgSrc] = useState<string>(getPrimaryImage());

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full bg-white border border-gray-200">
      <div>
        <Link href={`/product/${id}`}>
          <div className="relative aspect-square bg-gray-100 overflow-hidden">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImgSrc("")}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                <Package className="w-12 h-12 stroke-[1.5]" />
              </div>
            )}

            {/* Top-Left: Marketing Campaign Badges & Discount — all from API */}
            <div className="absolute top-2 left-2 flex flex-col items-start gap-1 z-10 max-w-[70%]">
              {isBestSeller && (
                <span className="text-[10px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2.5 py-0.5 rounded-full shadow-md">
                  🔥 Best Seller
                </span>
              )}
              {campaignTag && (
                <span
                  className="text-[10px] font-extrabold uppercase tracking-wide text-white px-2.5 py-0.5 rounded-full shadow-sm truncate max-w-full"
                  style={{ backgroundColor: tagColor }}
                >
                  {campaignTag}
                </span>
              )}
              {isDiscounted && discountPercent > 0 && (
                <Badge className="bg-orange-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-xs gap-1">
                  <Zap className="h-2.5 w-2.5" />
                  -{discountPercent}%
                </Badge>
              )}
              {!inStock && (
                <Badge variant="destructive" className="text-[10px] px-2 py-0.5 rounded-full">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Image count indicator */}
            {displayImageCount > 1 && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                <Images className="h-3 w-3" />
                <span>{displayImageCount}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                type="button"
                onClick={handleWishlist}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-emerald-600 hover:text-white text-gray-700 transition-colors"
                title="Add to Wishlist"
              >
                <Heart className="h-4 w-4" />
              </button>
              <Link href={`/product/${id}`}>
                <button
                  type="button"
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-emerald-600 hover:text-white text-gray-700 transition-colors"
                  title="View Product"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </Link>

        <div className="p-4 space-y-2">
          <div>
            {brand && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-0.5">
                {brand}
              </span>
            )}
            <Link href={`/product/${id}`}>
              <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-emerald-600 transition-colors mb-1 text-base">
                {name}
              </h3>
            </Link>
            {storeName && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>{storeName}</span>
                {verified && (
                  <CheckCircle className="h-3 w-3 text-emerald-600" />
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-gray-900">{rating || "5.0"}</span>
            </div>
            <span className="text-gray-400">({reviews || 0} reviews)</span>
          </div>

          {/* Pricing — from API, no frontend calculations */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-extrabold text-gray-900">
              GH₵{Number(price).toFixed(2)}
            </span>
            {isDiscounted && originalPrice && originalPrice > price && (
              <span className="text-xs text-gray-400 line-through">
                GH₵{Number(originalPrice).toFixed(2)}
              </span>
            )}
            {isDiscounted && amountSaved > 0 && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                Save GH₵{Number(amountSaved).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        {inStock ? (
          <Button
            className="w-full gap-2 gradient-primary text-white shadow-sm hover:shadow transition-all"
            size="sm"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        ) : (
          <Button className="w-full" size="sm" variant="outline" disabled>
            Out of Stock
          </Button>
        )}
      </div>
    </Card>
  );
}
