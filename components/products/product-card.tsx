"use client";

import { useState, useEffect } from "react";
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

  const getFallbackImage = (productName?: string, brandName?: string): string => {
    const text = `${productName || ""} ${brandName || ""}`.toLowerCase();
    if (text.includes("phone") || text.includes("smart") || text.includes("mobile") || text.includes("tech") || text.includes("electronic") || text.includes("gadget") || text.includes("laptop") || text.includes("camera")) {
      return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80";
    }
    if (text.includes("fashion") || text.includes("cloth") || text.includes("wear") || text.includes("apparel") || text.includes("shirt") || text.includes("shoe") || text.includes("dress")) {
      return "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80";
    }
    if (text.includes("home") || text.includes("living") || text.includes("chair") || text.includes("furniture") || text.includes("decor") || text.includes("lamp") || text.includes("bed")) {
      return "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80";
    }
    if (text.includes("beauty") || text.includes("care") || text.includes("skin") || text.includes("hair") || text.includes("cosmetic") || text.includes("perfume")) {
      return "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80";
    }
    if (text.includes("food") || text.includes("grocery") || text.includes("drink") || text.includes("snack") || text.includes("beverage")) {
      return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80";
    }
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
  };

  // Extract primary image URL safely with fallback support
  const getPrimaryImage = (): string => {
    let url = "";
    if (Array.isArray(image) && image.length > 0 && typeof image[0] === "string") {
      url = image[0];
    } else if (typeof image === "string" && image.trim()) {
      if (image.startsWith("[") && image.endsWith("]")) {
        try {
          const parsed = JSON.parse(image);
          if (Array.isArray(parsed) && parsed[0]) url = parsed[0];
        } catch {
          url = image;
        }
      } else {
        url = image;
      }
    }

    if (!url || url.includes("example.com") || url.includes("placeholder.com") || (!url.startsWith("http") && !url.startsWith("/"))) {
      return getFallbackImage(name, brand);
    }

    return url;
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
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full bg-white border border-gray-200 rounded-2xl">
      <div>
        <Link href={`/product/${id}`}>
          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImgSrc(getFallbackImage(name, brand))}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                <Package className="w-10 h-10 stroke-[1.5]" />
              </div>
            )}

            {/* Top-Left: Marketing Campaign Badges & Discount — all from API */}
            <div className="absolute top-2 left-2 flex flex-col items-start gap-1 z-10 max-w-[70%]">
              {isBestSeller && (
                <span className="text-[9px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2 py-0.5 rounded-full shadow-md">
                  🔥 Best Seller
                </span>
              )}
              {campaignTag && (
                <span
                  className="text-[9px] font-extrabold uppercase tracking-wide text-white px-2 py-0.5 rounded-full shadow-sm truncate max-w-full"
                  style={{ backgroundColor: tagColor }}
                >
                  {campaignTag}
                </span>
              )}
              {isDiscounted && discountPercent > 0 && (
                <Badge className="bg-orange-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full shadow-xs gap-1">
                  <Zap className="h-2.5 w-2.5" />
                  -{discountPercent}%
                </Badge>
              )}
              {!inStock && (
                <Badge variant="destructive" className="text-[9px] px-2 py-0.5 rounded-full">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Image count indicator */}
            {displayImageCount > 1 && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                <Images className="h-2.5 w-2.5" />
                <span>{displayImageCount}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                type="button"
                onClick={handleWishlist}
                className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-emerald-600 hover:text-white text-gray-700 transition-colors"
                title="Add to Wishlist"
              >
                <Heart className="h-3.5 w-3.5" />
              </button>
              <Link href={`/product/${id}`}>
                <button
                  type="button"
                  className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-emerald-600 hover:text-white text-gray-700 transition-colors"
                  title="View Product"
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          </div>
        </Link>

        <div className="p-3 space-y-1.5">
          <div>
            {brand && (
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 block mb-0.5">
                {brand}
              </span>
            )}
            <Link href={`/product/${id}`}>
              <h3 className="font-bold text-gray-900 line-clamp-2 hover:text-emerald-600 transition-colors text-sm leading-snug">
                {name}
              </h3>
            </Link>
            {storeName && (
              <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                <span className="truncate max-w-[140px]">{storeName}</span>
                {verified && (
                  <CheckCircle className="h-3 w-3 text-emerald-600 shrink-0" />
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900">{rating || "5.0"}</span>
            </div>
            <span className="text-gray-400">({reviews || 0})</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 pt-0.5 flex-wrap">
            <span className="text-base font-extrabold text-gray-900">
              GH₵{Number(price).toFixed(2)}
            </span>
            {isDiscounted && originalPrice && originalPrice > price && (
              <span className="text-[11px] text-gray-400 line-through">
                GH₵{Number(originalPrice).toFixed(2)}
              </span>
            )}
            {isDiscounted && amountSaved > 0 && (
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                Save GH₵{Number(amountSaved).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 pt-0">
        {inStock ? (
          <Button
            className="w-full h-8 text-xs font-bold gap-1.5 gradient-primary text-white shadow-xs hover:shadow transition-all rounded-xl"
            size="sm"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </Button>
        ) : (
          <Button className="w-full h-8 text-xs font-bold rounded-xl" size="sm" variant="outline" disabled>
            Out of Stock
          </Button>
        )}
      </div>
    </Card>
  );
}
