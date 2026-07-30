"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface InventoryCardProps {
  stock?: number;
  onStockChange?: (val: number) => void;
}

export default function InventoryCard({
  stock = 0,
  onStockChange,
}: InventoryCardProps) {
  const [trackInventory, setTrackInventory] = useState(true);
  const [continueSelling, setContinueSelling] = useState(false);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Inventory</h2>

      <div className="space-y-6">
        {/* Track Inventory Checkbox */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            checked={trackInventory}
            onChange={(e) => setTrackInventory(e.target.checked)}
            className="mt-1"
          />
          <div>
            <label className="text-sm font-medium text-gray-900">
              Track inventory
            </label>
            <p className="text-xs text-gray-600 mt-1">
              Automatically track stock levels when orders are placed
            </p>
          </div>
        </div>

        {/* Stock Quantity */}
        {trackInventory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity <span className="text-red-600">*</span>
              </label>
              <Input
                type="number"
                value={stock}
                onChange={(e) => onStockChange?.(parseInt(e.target.value, 10) || 0)}
                placeholder="0"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Stock Threshold
              </label>
              <Input
                type="number"
                placeholder="10"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get notified when stock is low
              </p>
            </div>
          </div>
        )}

        {/* Continue Selling */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            checked={continueSelling}
            onChange={(e) => setContinueSelling(e.target.checked)}
            className="mt-1"
          />
          <div>
            <label className="text-sm font-medium text-gray-900">
              Continue selling when out of stock
            </label>
            <p className="text-xs text-gray-600 mt-1">
              Allow customers to purchase even when stock reaches zero
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
