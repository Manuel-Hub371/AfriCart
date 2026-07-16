"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import StatCard from "@/components/profile/stat-card";
import OrderCard from "@/components/profile/order-card";
import { ShoppingBag, Heart, Star, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data
const recentOrders = [
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
];

const recommendedProducts = [
  {
    id: "1",
    name: "Wireless Mouse",
    image: "bg-gradient-to-br from-gray-400 to-gray-500",
    price: 29.99,
    rating: 4.5,
  },
  {
    id: "2",
    name: "USB-C Cable",
    image: "bg-gradient-to-br from-blue-400 to-cyan-400",
    price: 12.99,
    rating: 4.8,
  },
  {
    id: "3",
    name: "Phone Stand",
    image: "bg-gradient-to-br from-green-400 to-pink-400",
    price: 19.99,
    rating: 4.6,
  },
  {
    id: "4",
    name: "Laptop Sleeve",
    image: "bg-gradient-to-br from-green-400 to-emerald-400",
    price: 24.99,
    rating: 4.7,
  },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, Manuel 
            </h1>
            <p className="text-gray-600">
              Manage your orders and account information
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={ShoppingBag}
              label="Total Orders"
              value={12}
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
            />
            <StatCard
              icon={Heart}
              label="Wishlist Items"
              value={8}
              iconColor="text-pink-600"
              iconBg="bg-pink-100"
            />
            <StatCard
              icon={Star}
              label="Reviews"
              value={15}
              iconColor="text-amber-600"
              iconBg="bg-amber-100"
            />
            <StatCard
              icon={Award}
              label="Reward Points"
              value="2,500"
              iconColor="text-emerald-600"
              iconBg="bg-emerald-100"
            />
          </div>

          {/* Recent Orders */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Orders
              </h2>
              <Link href="/profile/orders">
                <Button variant="outline" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recentOrders.map((order) => (
                <OrderCard key={order.orderId} order={order} />
              ))}
            </div>
          </div>

          {/* Recommended Products */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recommended for You
              </h2>
              <Link href="/products">
                <Button variant="outline" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className={`h-48 ${product.image}`} />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-emerald-600">
                        ${product.price}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm text-gray-600">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                    <Button className="w-full" size="sm">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
