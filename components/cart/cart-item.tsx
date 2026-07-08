"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, X, Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CartItemProps {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  maxQuantity: number;
  variants?: { name: string; value: string }[];
  inStock: boolean;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({
  id,
  productId,
  name,
  image,
  price,
  originalPrice,
  quantity,
  maxQuantity,
  variants,
  inStock,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const [qty, setQty] = useState(quantity);

  const handleDecrease = () => {
    if (qty > 1) {
      const newQty = qty - 1;
      setQty(newQty);
      onQuantityChange(id, newQty);
    }
  };

  const handleIncrease = () => {
    if (qty < maxQuantity) {
      const newQty = qty + 1;
      setQty(newQty);
      onQuantityChange(id, newQty);
    }
  };

  const itemTotal = price * qty;
  const savings = originalPrice ? (originalPrice - price) * qty : 0;

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
      {/* Product Image */}
      <Link href={`/product/${productId}`} className="flex-shrink-0">
        <div className={`w-24 h-24 md:w-32 md:h-32 rounded-lg ${image}`}></div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Link href={`/product/${productId}`}>
              <h3 className="font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2">
                {name}
              </h3>
            </Link>

            {/* Variants */}
            {variants && variants.length > 0 && (
              <div className="mt-2 space-y-1">
                {variants.map((variant, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    {variant.name}: <span className="font-medium">{variant.value}</span>
                  </p>
                ))}
              </div>
            )}

            {/* Stock Status */}
            <div className="mt-2">
              {inStock ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(id)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Price & Quantity */}
        <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={handleDecrease}
              disabled={qty <= 1}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
              {qty}
            </span>
            <button
              onClick={handleIncrease}
              disabled={qty >= maxQuantity || !inStock}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">
              ${itemTotal.toFixed(2)}
            </div>
            {originalPrice && (
              <div className="text-sm">
                <span className="text-gray-500 line-through">
                  ${(originalPrice * qty).toFixed(2)}
                </span>
                <span className="text-green-600 ml-2">
                  Save ${savings.toFixed(2)}
                </span>
              </div>
            )}
            <div className="text-sm text-gray-600">
              ${price.toFixed(2)} each
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <Button variant="ghost" size="sm" className="gap-2">
            <Heart className="h-4 w-4" />
            Move to Wishlist
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Bookmark className="h-4 w-4" />
            Save for Later
          </Button>
        </div>
      </div>
    </div>
  );
}
