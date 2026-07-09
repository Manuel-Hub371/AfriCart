"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Plus, Minus } from "lucide-react";

const inventory = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    sku: "WH-001",
    stock: 45,
    reserved: 5,
    available: 40,
    lowStockAlert: 10,
    status: "In Stock",
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    sku: "SW-002",
    stock: 28,
    reserved: 3,
    available: 25,
    lowStockAlert: 10,
    status: "In Stock",
  },
  {
    id: "3",
    name: "Wireless Mouse",
    sku: "WM-003",
    stock: 5,
    reserved: 0,
    available: 5,
    lowStockAlert: 10,
    status: "Low Stock",
  },
  {
    id: "4",
    name: "USB-C Cable",
    sku: "UC-004",
    stock: 0,
    reserved: 0,
    available: 0,
    lowStockAlert: 10,
    status: "Out of Stock",
  },
];

const statusColors: Record<string, string> = {
  "In Stock": "bg-green-100 text-green-700",
  "Low Stock": "bg-yellow-100 text-yellow-700",
  "Out of Stock": "bg-red-100 text-red-700",
};

export default function VendorInventoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <VendorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <VendorTopbar
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumbs={[
            { label: "Dashboard", href: "/vendor" },
            { label: "Inventory" },
          ]}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory</h1>
            <p className="text-gray-600">Manage your stock levels</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Total Stock</p>
              <p className="text-2xl font-bold text-gray-900">1,245</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-yellow-600">8</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">6</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Reserved</p>
              <p className="text-2xl font-bold text-blue-600">42</p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input placeholder="Search inventory..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      SKU
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Stock
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Reserved
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Available
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {item.sku}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {item.stock}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {item.reserved}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-emerald-600">
                        {item.available}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[item.status]}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-green-50 rounded">
                            <Plus className="h-4 w-4 text-green-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded">
                            <Minus className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-gray-600">
                Showing 1 to {inventory.length} of 156 products
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
