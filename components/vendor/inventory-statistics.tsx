"use client";

import { 
  Package, 
  AlertTriangle, 
  XCircle, 
  DollarSign
} from "lucide-react";

interface InventoryStatsProps {
  totalProducts?: number;
  totalStockUnits?: number;
  lowStockCount?: number;
  outOfStockCount?: number;
  totalValue?: number;
}

export function InventoryStatistics({
  totalProducts = 0,
  totalStockUnits = 0,
  lowStockCount = 0,
  outOfStockCount = 0,
  totalValue = 0,
}: InventoryStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Products</p>
            <h3 className="text-3xl font-extrabold text-gray-900">{totalProducts}</h3>
            <p className="text-xs text-gray-400 mt-1">Catalog items</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Package className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Stock Units</p>
            <h3 className="text-3xl font-extrabold text-gray-900">{totalStockUnits.toLocaleString()}</h3>
            <p className="text-xs text-gray-400 mt-1">Available inventory</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Package className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Low Stock Items</p>
            <h3 className="text-3xl font-extrabold text-amber-600">{lowStockCount}</h3>
            <p className="text-xs text-gray-400 mt-1">Stock ≤ 10 units</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Inventory Valuation</p>
            <h3 className="text-3xl font-extrabold text-emerald-600">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            <p className="text-xs text-gray-400 mt-1">Total asset value</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
