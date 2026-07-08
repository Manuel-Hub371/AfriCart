"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Share2, ShoppingCart, Zap, Minus, Plus } from "lucide-react";

interface PurchaseActionsProps {
  inStock: boolean;
  maxQuantity: number;
}

export function PurchaseActions({ inStock, maxQuantity }: PurchaseActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(maxQuantity, prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quantity:</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-6 py-2 font-semibold text-lg">{quantity}</span>
            <button
              onClick={increaseQuantity}
              disabled={quantity >= maxQuantity}
              className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm text-gray-600">
            {maxQuantity} available
          </span>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 gap-2"
          disabled={!inStock}
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </Button>
        <Button
          size="lg"
          className="flex-1 gap-2 bg-orange-600 hover:bg-orange-700"
          disabled={!inStock}
        >
          <Zap className="h-5 w-5" />
          Buy Now
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => setWishlisted(!wishlisted)}
        >
          <Heart className={`h-5 w-5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
          Wishlist
        </Button>
        <Button variant="outline" className="flex-1 gap-2">
          <Share2 className="h-5 w-5" />
          Share
        </Button>
      </div>
    </div>
  );
}
