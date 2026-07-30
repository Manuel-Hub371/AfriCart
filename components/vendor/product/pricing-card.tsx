"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface PricingCardProps {
  price?: number | string;
  onPriceChange?: (val: number) => void;
  compareAtPrice?: number | string;
  onComparePriceChange?: (val: number) => void;
}

export default function PricingCard({
  price = "",
  onPriceChange,
  compareAtPrice = "",
  onComparePriceChange,
}: PricingCardProps) {
  const calculateDiscount = () => {
    const numPrice = typeof price === "number" ? price : parseFloat(price);
    const numCompare = typeof compareAtPrice === "number" ? compareAtPrice : parseFloat(compareAtPrice);
    if (!isNaN(numPrice) && !isNaN(numCompare) && numCompare > numPrice) {
      const discount = ((numCompare - numPrice) / numCompare) * 100;
      return discount > 0 ? discount.toFixed(0) : "0";
    }
    return "0";
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Pricing</h2>

      <div className="space-y-6">
        {/* Selling Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selling Price <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              $
            </span>
            <Input
              type="number"
              value={price}
              onChange={(e) => onPriceChange?.(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="pl-8"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        {/* Compare-at Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compare-at Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              $
            </span>
            <Input
              type="number"
              value={compareAtPrice}
              onChange={(e) => onComparePriceChange?.(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="pl-8"
              step="0.01"
              min="0"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Original price (optional, shows discount badge)
          </p>
        </div>

        {/* Calculations */}
        {Boolean(price && compareAtPrice) && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Discount</span>
              <span className="text-sm font-semibold text-green-600">
                {calculateDiscount()}% OFF
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
