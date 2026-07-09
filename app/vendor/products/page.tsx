"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import Link from "next/link";

const products = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    sku: "WH-001",
    category: "Electronics",
    stock: 45,
    price: 120,
    status: "Active",
    image: "bg-gradient-to-br from-blue-400 to-blue-500",
    createdDate: "June 15, 2026",
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    sku: "SW-002",
    category: "Electronics",
    stock: 28,
    price: 200,
    status: "Active",
    image: "bg-gradient-to-br from-purple-400 to-purple-500",
    createdDate: "June 20, 2026",
  },
  {
    id: "3",
    name: "Wireless Mouse",
    sku: "WM-003",
    category: "Accessories",
    stock: 5,
    price: 30,
    status: "Low Stock",
    image: "bg-gradient-to-br from-gray-400 to-gray-500",
    createdDate: "June 25, 2026",
  },
  {
    id: "4",
    name: "USB-C Cable",
    sku: "UC-004",
    category: "Accessories",
    stock: 0,
    price: 15,
    status: "Out of Stock",
    image: "bg-gradient-to-br from-green-400 to-green-500",
    createdDate: "July 1, 2026",
  },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  "Low Stock": "bg-yellow-100 text-yellow-700",
  "Out of Stock": "bg-red-100 text-red-700",
  Draft: "bg-gray-100 text-gray-700",
};

export default function VendorProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
            { label: "Products" },
          ]}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Products
                </h1>
                <p className="text-gray-600">
                  Manage your product inventory
                </p>
              </div>
              <Link href="/vendor/products/new">
                <Button className="gap-2">
                  <Plus className="h-5 w-5" />
                  Add Product
                </Button>
              </Link>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10"
                />
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
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Import
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg border p-4">
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">142</p>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">8</p>
              </div>
              <div className="bg-white rounded-lg border p-4">
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">6</p>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      SKU
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Stock
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Price
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
                  {products.map((product) => (
                    <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 ${product.image} rounded-lg flex-shrink-0`}
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.createdDate}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {product.sku}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {product.category}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-sm font-medium ${
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock <= 10
                              ? "text-yellow-600"
                              : "text-gray-900"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        ${product.price}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[product.status]}>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Edit className="h-4 w-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Copy className="h-4 w-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Trash2 className="h-4 w-4 text-red-600" />
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
                Showing 1 to {products.length} of 156 products
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
