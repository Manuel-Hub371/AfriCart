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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-4">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs">
            <div>
              <h1 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                My Orders
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Track status and view details of your purchases
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search by order ID or item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs rounded-lg bg-gray-50 border-gray-200 focus-within:border-emerald-500"
              />
            </div>
          </div>

          {/* Status Filter Tab Pills */}
          <div className="bg-white p-2 rounded-xl border border-gray-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: "All Orders" },
              { id: "processing", label: "Processing" },
              { id: "shipped", label: "Shipped" },
              { id: "delivered", label: "Delivered" },
              { id: "cancelled", label: "Cancelled" },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 bg-white rounded-xl border border-gray-200/80 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="text-center py-10 bg-white rounded-xl border border-red-100 p-6">
              <p className="text-red-600 text-xs font-medium mb-3">{error}</p>
              <Button onClick={fetchOrders} variant="outline" size="sm" className="h-8 text-xs font-bold rounded-lg">
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredOrders.length === 0 && (
            <div className="text-center py-14 bg-white rounded-xl border border-dashed border-gray-200 p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-xl mb-3 text-emerald-600">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-900 mb-1">
                No orders found
              </h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
                {searchQuery || activeTab !== "all"
                  ? "No orders match your filter criteria."
                  : "You haven't placed any orders yet."}
              </p>
              <Link href="/products">
                <Button size="sm" className="gradient-primary text-white font-bold text-xs h-8 px-4 rounded-lg">
                  Browse Products
                </Button>
              </Link>
            </div>
          )}

          {/* Orders Grid */}
          {!loading && !error && filteredOrders.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
