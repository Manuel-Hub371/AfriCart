"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Eye, CheckCircle, Images } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  storeName: string;
  verified?: boolean;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  inStock?: boolean;
  images?: number;
}

export function ProductCard({
  id,
  name,
  storeName,
  verified = false,
  rating,
  reviews,
  price,
  originalPrice,
  discount,
  image,
  inStock = true,
  images = 1,
}: ProductCardProps) {
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    // Quick view functionality can be added here
    console.log("Quick view for product:", id);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    // Wishlist functionality can be added here
    console.log("Add to wishlist:", id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Add to cart functionality can be added here
    console.log("Add to cart:", id);
  };
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      <Link href={`/product/${id}`}>
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <div className={`w-full h-full ${image}`}></div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {discount && (
              <Badge className="bg-orange-500">-{discount}%</Badge>
            )}
            {!inStock && (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          {/* Image count indicator */}
          {images > 1 && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
              <Images className="h-3 w-3" />
              <span>{images}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleWishlist}
              className="p-2 bg-white rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
            >
              <Heart className="h-4 w-4" />
            </button>
            <button 
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <div>
          <Link href={`/product/${id}`}>
            <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-primary transition-colors mb-1">
              {name}
            </h3>
          </Link>
          <Link href={`/store/${storeName.toLowerCase()}`}>
            <div className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors">
              <span>{storeName}</span>
              {verified && (
                <CheckCircle className="h-3 w-3 text-primary" />
              )}
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900">{rating}</span>
          </div>
          <span className="text-sm text-gray-500">({reviews} reviews)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">${price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice}
            </span>
          )}
        </div>

        {inStock ? (
          <Button 
            className="w-full gap-2" 
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
