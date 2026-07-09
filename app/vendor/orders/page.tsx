"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye, Package, Truck } from "lucide-react";
import Link from "next/link";

const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    products: 2,
    amount: 320,
    status: "Pending",
    paymentStatus: "Paid",
    date: "July 9, 2026",
    time: "10:30 AM",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    products: 1,
    amount: 200,
    status: "Processing",
    paymentStatus: "Paid",
    date: "July 9, 2026",
    time: "09:15 AM",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    products: 3,
    amount: 450,
    status: "Shipped",
    paymentStatus: "Paid",
    date: "July 8, 2026",
    time: "03:20 PM",
  },
  {
    id: "ORD-004",
    customer: "Sarah Wilson",
    products: 1,
    amount: 120,
    status: "Delivered",
    paymentStatus: "Paid",
    date: "July 7, 2026",
    time: "11:45 AM",
  },
  {
    id: "ORD-005",
    customer: "Tom Brown",
    products: 2,
    amount: 250,
    status: "Cancelled",
    paymentStatus: "Refunded",
    date: "July 6, 2026",
    time: "02:30 PM",
  },
];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const paymentColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Refunded: "bg-gray-100 text-gray-700",
};

export default function VendorOrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    "All",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

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
            { label: "Orders" },
          ]}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
            <p className="text-gray-600">Manage and track your orders</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">342</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">12</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600">8</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Shipped</p>
              <p className="text-2xl font-bold text-purple-600">24</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">298</p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input placeholder="Search orders..." className="pl-10" />
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

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === filter
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Products
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Payment
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {order.customer}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {order.products} item(s)
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        ${order.amount}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={paymentColors[order.paymentStatus]}>
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        <div>{order.date}</div>
                        <div className="text-xs text-gray-500">{order.time}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/vendor/orders/${order.id}`}>
                            <button className="p-2 hover:bg-gray-100 rounded">
                              <Eye className="h-4 w-4 text-gray-600" />
                            </button>
                          </Link>
                          {order.status === "Pending" && (
                            <button className="p-2 hover:bg-blue-50 rounded">
                              <Package className="h-4 w-4 text-blue-600" />
                            </button>
                          )}
                          {order.status === "Processing" && (
                            <button className="p-2 hover:bg-purple-50 rounded">
                              <Truck className="h-4 w-4 text-purple-600" />
                            </button>
                          )}
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
                Showing 1 to {orders.length} of 342 orders
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
