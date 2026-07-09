"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function InventoryCard() {
  const [trackInventory, setTrackInventory] = useState(true);
  const [continueSelling, setContinueSelling] = useState(false);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Inventory</h2>

      <div className="space-y-6">
        {/* SKU & Barcode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU (Stock Keeping Unit)
            </label>
            <Input placeholder="e.g., WH-001-BLK" />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to auto-generate
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Barcode (ISBN, UPC, etc.)
            </label>
            <Input placeholder="e.g., 123456789012" />
          </div>
        </div>

        {/* Track Inventory */}
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity <span className="text-red-600">*</span>
                </label>
                <Input type="number" placeholder="0" min="0" />
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

            {/* Warehouse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warehouse Location
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Main Warehouse</option>
                <option>Warehouse A</option>
                <option>Warehouse B</option>
              </select>
            </div>
          </>
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

        {/* Availability Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Availability Status
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
            <option>Pre-Order</option>
            <option>Discontinued</option>
          </select>
        </div>
      </div>
    </Card>
  );
}
