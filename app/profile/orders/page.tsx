"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import OrderCard from "@/components/profile/order-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const allOrders = [
  {
    orderId: "MK12345",
    date: "July 8, 2026",
    vendor: { name: "Tech World", verified: true },
    products: [
      {
        name: "Premium Wireless Headphones",
        image: "bg-gradient-to-br from-blue-400 to-blue-500",
        quantity: 1,
      },
      {
        name: "Smart Watch Pro",
        image: "bg-gradient-to-br from-green-400 to-green-500",
        quantity: 1,
      },
    ],
    total: 320,
    status: "Delivered" as const,
  },
  {
    orderId: "MK12344",
    date: "July 5, 2026",
    vendor: { name: "Fashion House", verified: true },
    products: [
      {
        name: "Designer Sneakers",
        image: "bg-gradient-to-br from-pink-400 to-pink-500",
        quantity: 2,
      },
    ],
    total: 200,
    status: "Shipped" as const,
  },
  {
    orderId: "MK12343",
    date: "July 2, 2026",
    vendor: { name: "Home Essentials", verified: false },
    products: [
      {
        name: "Kitchen Appliance Set",
        image: "bg-gradient-to-br from-orange-400 to-orange-500",
        quantity: 1,
      },
    ],
    total: 150,
    status: "Processing" as const,
  },
  {
    orderId: "MK12342",
    date: "June 28, 2026",
    vendor: { name: "Book Store", verified: true },
    products: [
      {
        name: "Programming Books Bundle",
        image: "bg-gradient-to-br from-indigo-400 to-indigo-500",
        quantity: 5,
      },
    ],
    total: 89,
    status: "Delivered" as const,
  },
  {
    orderId: "MK12341",
    date: "June 25, 2026",
    vendor: { name: "Sports Shop", verified: true },
    products: [
      {
        name: "Running Shoes",
        image: "bg-gradient-to-br from-red-400 to-red-500",
        quantity: 1,
      },
    ],
    total: 120,
    status: "Cancelled" as const,
  },
];

const filterOptions = [
  { label: "All Orders", value: "all" },
  { label: "Processing", value: "Processing" },
  { label: "Shipped", value: "Shipped" },
  { label: "Delivered", value: "Delivered" },
  { label: "Cancelled", value: "Cancelled" },
];

export default function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = allOrders.filter((order) => {
    const matchesFilter =
      activeFilter === "all" || order.status === activeFilter;
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vendor.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">
              View and manage your order history
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order ID or vendor..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === option.value
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard key={order.orderId} order={order} />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-600">No orders found</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
