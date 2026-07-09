"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PricingCard() {
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [costPrice, setCostPrice] = useState("");

  const calculateDiscount = () => {
    if (price && comparePrice) {
      const discount =
        ((parseFloat(comparePrice) - parseFloat(price)) /
          parseFloat(comparePrice)) *
        100;
      return discount > 0 ? discount.toFixed(0) : "0";
    }
    return "0";
  };

  const calculateProfit = () => {
    if (price && costPrice) {
      const profit = parseFloat(price) - parseFloat(costPrice);
      return profit > 0 ? profit.toFixed(2) : "0.00";
    }
    return "0.00";
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
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="pl-8"
              step="0.01"
              min="0"
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
              value={comparePrice}
              onChange={(e) => setComparePrice(e.target.value)}
              placeholder="0.00"
              className="pl-8"
              step="0.01"
              min="0"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Original price (optional, shows discount)
          </p>
        </div>

        {/* Cost Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cost Price (Private)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              $
            </span>
            <Input
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              placeholder="0.00"
              className="pl-8"
              step="0.01"
              min="0"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Your cost (not visible to customers)
          </p>
        </div>

        {/* Calculations */}
        {(price || comparePrice || costPrice) && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            {price && comparePrice && parseFloat(comparePrice) > parseFloat(price) && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Discount</span>
                <span className="text-sm font-semibold text-green-600">
                  {calculateDiscount()}% OFF
                </span>
              </div>
            )}
            {price && costPrice && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profit Margin</span>
                  <span className="text-sm font-semibold text-emerald-600">
                    ${calculateProfit()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profit %</span>
                  <span className="text-sm font-semibold text-emerald-600">
                    {costPrice && price
                      ? (
                          ((parseFloat(price) - parseFloat(costPrice)) /
                            parseFloat(costPrice)) *
                          100
                        ).toFixed(1)
                      : "0"}
                    %
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tax Class */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tax Class
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Standard Rate</option>
            <option>Reduced Rate</option>
            <option>Zero Rate</option>
            <option>Exempt</option>
          </select>
        </div>
      </div>
    </Card>
  );
}
