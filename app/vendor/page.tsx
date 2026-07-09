"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import DashboardCard from "@/components/vendor/dashboard-card";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data
const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    product: "Wireless Headphones",
    amount: 120,
    status: "Pending",
    date: "July 9, 2026",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    product: "Smart Watch Pro",
    amount: 200,
    status: "Processing",
    date: "July 9, 2026",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    product: "Laptop Sleeve",
    amount: 25,
    status: "Shipped",
    date: "July 8, 2026",
  },
  {
    id: "ORD-004",
    customer: "Sarah Wilson",
    product: "USB-C Cable",
    amount: 15,
    status: "Delivered",
    date: "July 8, 2026",
  },
];

const lowStockProducts = [
  { name: "Wireless Mouse", stock: 5, sku: "WM-001" },
  { name: "USB Hub", stock: 3, sku: "UH-002" },
  { name: "Phone Stand", stock: 2, sku: "PS-003" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
};

export default function VendorDashboardPage() {
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
          breadcrumbs={[{ label: "Dashboard" }]}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, Tech World 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your store today
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              icon={DollarSign}
              label="Today's Sales"
              value="$2,450"
              change={{ value: 12.5, type: "increase" }}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-100"
            />
            <DashboardCard
              icon={ShoppingBag}
              label="Orders"
              value={48}
              change={{ value: 8.2, type: "increase" }}
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
            />
            <DashboardCard
              icon={Package}
              label="Products"
              value={156}
              iconColor="text-purple-600"
              iconBg="bg-purple-100"
            />
            <DashboardCard
              icon={Users}
              label="Customers"
              value={842}
              change={{ value: 3.1, type: "decrease" }}
              iconColor="text-orange-600"
              iconBg="bg-orange-100"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Orders
                </h2>
                <Link href="/vendor/orders">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b last:border-0">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {order.customer}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {order.product}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          ${order.amount}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={statusColors[order.status]}>
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Alerts & Low Stock */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Pending Orders
                    </span>
                    <span className="text-lg font-bold text-yellow-600">
                      12
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Processing Orders
                    </span>
                    <span className="text-lg font-bold text-blue-600">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Shipped Today
                    </span>
                    <span className="text-lg font-bold text-purple-600">
                      15
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Monthly Revenue
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      $45,230
                    </span>
                  </div>
                </div>
              </div>

              {/* Low Stock Alert */}
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Low Stock Alert
                  </h3>
                </div>
                <div className="space-y-3">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.sku}
                      className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-600">{product.sku}</p>
                      </div>
                      <span className="text-sm font-bold text-orange-600">
                        {product.stock} left
                      </span>
                    </div>
                  ))}
                </div>
                <Link href="/vendor/inventory">
                  <Button variant="outline" className="w-full mt-4">
                    Manage Inventory
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
