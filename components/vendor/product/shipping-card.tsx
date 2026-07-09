"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ShippingCard() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Shipping</h2>

      <div className="space-y-6">
        {/* Weight & Dimensions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Package Dimensions
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Weight (kg)
              </label>
              <Input type="number" placeholder="0.0" step="0.01" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Length (cm)
              </label>
              <Input type="number" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Width (cm)
              </label>
              <Input type="number" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Height (cm)
              </label>
              <Input type="number" placeholder="0" />
            </div>
          </div>
        </div>

        {/* Shipping Class */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shipping Class
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Standard Shipping</option>
            <option>Express Shipping</option>
            <option>Heavy Items</option>
            <option>Fragile Items</option>
          </select>
        </div>

        {/* Delivery Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Delivery Days
            </label>
            <Input type="number" placeholder="3" min="1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Delivery Days
            </label>
            <Input type="number" placeholder="7" min="1" />
          </div>
        </div>

        {/* Shipping Cost */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shipping Cost
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              $
            </span>
            <Input
              type="number"
              placeholder="0.00"
              className="pl-8"
              step="0.01"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Leave blank to calculate automatically
          </p>
        </div>

        {/* Shipping Options */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input type="checkbox" className="rounded" />
            <label className="text-sm text-gray-700">
              Free shipping available
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" className="rounded" />
            <label className="text-sm text-gray-700">
              Pickup available
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" className="rounded" />
            <label className="text-sm text-gray-700">
              Local delivery available
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" className="rounded" />
            <label className="text-sm text-gray-700">
              International shipping available
            </label>
          </div>
        </div>
      </div>
    </Card>
  );
}
