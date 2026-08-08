"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface PricingCardProps {
  price?: number | string;
  onPriceChange?: (val: number) => void;
}

export default function PricingCard({
  price = "",
  onPriceChange,
}: PricingCardProps) {
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
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
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
          <p className="text-xs text-gray-500 mt-1">
            Standard retail selling price for your product.
          </p>
        </div>
      </div>
    </Card>
  );
}
