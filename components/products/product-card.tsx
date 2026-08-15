"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Eye, CheckCircle, Images, Zap, Package } from "lucide-react";
import Link from "next/link";
import { extractCoverImage, getCategoryFallbackImage } from "@/lib/image-utils";

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

  // Extract primary cover image URL safely with fallback support
  const getPrimaryImage = (): string => {
    const extracted = extractCoverImage(image, name, brand);
    return extracted || getCategoryFallbackImage(name, brand);
  };

  const [imgSrc, setImgSrc] = useState<string>(getPrimaryImage());

  useEffect(() => {
    setImgSrc(getPrimaryImage());
  }, [image, name, brand]);

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
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl">
      <div>
        <Link href={`/product/${id}`}>
          <div className="relative aspect-square sm:aspect-[4/3] bg-gray-100 overflow-hidden">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImgSrc(getCategoryFallbackImage(name, brand))}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                <Package className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.5]" />
              </div>
            )}

            {/* Top-Left: Marketing Campaign Badges & Discount */}
            <div className="absolute top-1 left-1 sm:top-2 sm:left-2 flex flex-col items-start gap-0.5 sm:gap-1 z-10 max-w-[80%]">
              {isBestSeller && (
                <span className="text-[7px] sm:text-[9px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-amber-500 to-orange-600 text-white px-1.5 sm:px-2 py-0.5 rounded-full shadow-md">
                  🔥 Best
                </span>
              )}
              {campaignTag && (
                <span
                  className="text-[7px] sm:text-[9px] font-extrabold uppercase tracking-wide text-white px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm truncate max-w-full"
                  style={{ backgroundColor: tagColor }}
                >
                  {campaignTag}
                </span>
              )}
              {isDiscounted && discountPercent > 0 && (
                <Badge className="bg-orange-500 text-white font-extrabold text-[7px] sm:text-[9px] px-1 sm:px-2 py-0.5 rounded-full shadow-xs gap-0.5">
                  <Zap className="h-2 sm:h-2.5 w-2 sm:w-2.5" />
                  -{discountPercent}%
                </Badge>
              )}
              {!inStock && (
                <Badge variant="destructive" className="text-[7px] sm:text-[9px] px-1 sm:px-2 py-0.5 rounded-full">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Image count indicator */}
            {displayImageCount > 1 && (
              <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 flex items-center gap-1 bg-black/60 text-white text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded">
                <Images className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                <span>{displayImageCount}</span>
              </div>
            )}

            {/* Wishlist / View Actions */}
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 flex flex-col gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
              <button
                type="button"
                onClick={handleWishlist}
                className="p-1 sm:p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-emerald-600 hover:text-white text-gray-700 transition-colors"
                title="Add to Wishlist"
              >
                <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            </div>
          </div>
        </Link>

        <div className="p-2 sm:p-3 space-y-1 sm:space-y-1.5">
          <div>
            {brand && (
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-0.5 truncate">
                {brand}
              </span>
            )}
            <Link href={`/product/${id}`}>
              <h3 className="font-bold text-gray-900 line-clamp-2 hover:text-emerald-600 transition-colors text-xs sm:text-sm leading-tight sm:leading-snug">
                {name}
              </h3>
            </Link>
            {storeName && (
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500 mt-0.5">
                <span className="truncate max-w-[120px] sm:max-w-[150px]">{storeName}</span>
                {verified && (
                  <CheckCircle className="h-3 w-3 text-emerald-600 shrink-0" />
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-[10px] sm:text-[11px]">
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900">{rating || "5.0"}</span>
            </div>
            <span className="text-gray-400">({reviews || 0})</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-1 sm:gap-1.5 pt-0.5 flex-wrap">
            <span className="text-sm sm:text-base font-black text-emerald-700">
              GH₵{Number(price).toFixed(2)}
            </span>
            {isDiscounted && originalPrice && originalPrice > price && (
              <span className="text-[10px] sm:text-[11px] text-gray-400 line-through font-semibold">
                GH₵{Number(originalPrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-2 sm:p-3 pt-0">
        {inStock ? (
          <Button
            className="w-full h-8 sm:h-9 text-xs font-bold gap-1 gradient-primary text-white shadow-2xs hover:shadow transition-all rounded-xl px-2 sm:px-3"
            size="sm"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Add to Cart</span>
          </Button>
        ) : (
          <Button className="w-full h-8 sm:h-9 text-xs font-bold rounded-xl px-2" size="sm" variant="outline" disabled>
            Out of Stock
          </Button>
        )}
      </div>
    </Card>
  );
}
