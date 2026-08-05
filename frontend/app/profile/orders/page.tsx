"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import OrderCard from "@/components/profile/order-card";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Map API OrderDTO -> OrderCard expected prop structure
function toUIOrder(order: any) {
  const firstItem = order.orderItems?.[0];
  const vendorName = firstItem?.storeName || "AfriCart Store";

  let status: "Delivered" | "Shipped" | "Processing" | "Cancelled" = "Processing";
  if (order.status === "DELIVERED") status = "Delivered";
  else if (order.status === "SHIPPED") status = "Shipped";
  else if (order.status === "CANCELLED") status = "Cancelled";
  else status = "Processing";

  return {
    orderId: order.id.slice(0, 8).toUpperCase(),
    fullId: order.id,
    date: new Date(order.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    vendor: { name: vendorName, verified: true },
    products: (order.orderItems || []).map((item: any) => ({
      name: item.productName,
      image: item.productImage || "",
      quantity: item.quantity,
    })),
    total: Number(order.totalAmount || 0),
    status,
  };
}

export default function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to load orders");
      }
      const data = await res.json();
      setOrders((data.orders || []).map(toUIOrder));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === "all" ||
      order.status.toLowerCase() === activeTab.toLowerCase();

    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.products.some((p: any) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Orders
              </h1>
              <p className="text-gray-600">
                Track and manage your order history
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-64 bg-white"
              />
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-2 mb-6">
            {[
              { id: "all", label: "All Orders" },
              { id: "processing", label: "Processing" },
              { id: "shipped", label: "Shipped" },
              { id: "delivered", label: "Delivered" },
              { id: "cancelled", label: "Cancelled" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-emerald-50 text-emerald-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-white rounded-xl border animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="text-center py-12 bg-white rounded-xl border border-red-100 p-6">
              <p className="text-red-600 font-medium mb-3">{error}</p>
              <Button onClick={fetchOrders} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredOrders.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-4">
                <Package className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No orders found
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                {searchQuery || activeTab !== "all"
                  ? "No orders matched your search criteria."
                  : "When you place an order, it will appear here."}
              </p>
              <Link href="/products">
                <Button className="gradient-primary text-white">
                  Start Shopping
                </Button>
              </Link>
            </div>
          )}

          {/* Orders List Grid */}
          {!loading && !error && filteredOrders.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredOrders.map((order) => (
                <OrderCard key={order.fullId} order={order} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
