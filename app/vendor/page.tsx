"use client";

import { useState, useEffect } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import DashboardCard from "@/components/vendor/dashboard-card";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
  PACKED: "bg-indigo-100 text-indigo-700 border-indigo-200",
  SHIPPED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

export default function VendorDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/vendor/dashboard");
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        }
      } catch (err) {
        console.error("Failed to fetch vendor dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const stats = dashboardData?.stats || {};
  const recentOrders = dashboardData?.recentOrders || [];
  const lowStockProducts = dashboardData?.lowStockProducts || [];
  const store = dashboardData?.store || {};

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
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                Welcome back, {store.name || user?.firstName || "Vendor"} 👋
              </h1>
              <p className="text-gray-600 text-sm">
                Here is a live summary of your store metrics and operations today.
              </p>
            </div>
            {store.slug && (
              <Link href={`/stores/${store.slug}`} target="_blank">
                <Button variant="outline" className="rounded-xl border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                  View Live Storefront →
                </Button>
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="py-24 text-center">
              <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-500 font-medium text-sm">Loading live store metrics...</p>
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardCard
                  icon={DollarSign}
                  label="Total Revenue"
                  value={`GH₵${(stats.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  iconColor="text-emerald-600"
                  iconBg="bg-emerald-100"
                />
                <DashboardCard
                  icon={ShoppingBag}
                  label="Total Orders"
                  value={stats.totalOrders || 0}
                  iconColor="text-blue-600"
                  iconBg="bg-blue-100"
                />
                <DashboardCard
                  icon={Package}
                  label="Active Products"
                  value={stats.totalProducts || 0}
                  iconColor="text-green-600"
                  iconBg="bg-green-100"
                />
                <DashboardCard
                  icon={Users}
                  label="Unique Customers"
                  value={stats.totalCustomers || 0}
                  iconColor="text-orange-600"
                  iconBg="bg-orange-100"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                      <p className="text-xs text-gray-500">Latest transactions from your store</p>
                    </div>
                    <Link href="/vendor/orders">
                      <Button variant="outline" size="sm" className="rounded-xl border-gray-300">
                        View All
                      </Button>
                    </Link>
                  </div>

                  {recentOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-xs uppercase text-gray-400 font-bold tracking-wider">
                            <th className="text-left py-3 px-4">Order ID</th>
                            <th className="text-left py-3 px-4">Customer</th>
                            <th className="text-left py-3 px-4">Item Summary</th>
                            <th className="text-left py-3 px-4">Amount</th>
                            <th className="text-left py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order: any) => (
                            <tr key={order.fullId} className="border-b last:border-0 hover:bg-gray-50/50">
                              <td className="py-3.5 px-4 text-sm font-bold text-gray-900">
                                #{order.id}
                              </td>
                              <td className="py-3.5 px-4 text-sm text-gray-600">
                                {order.customer}
                              </td>
                              <td className="py-3.5 px-4 text-sm text-gray-600 max-w-xs truncate">
                                {order.product}
                              </td>
                              <td className="py-3.5 px-4 text-sm font-bold text-gray-900">
                                GH₵{order.amount.toFixed(2)}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-500 text-sm">
                      No orders received yet. Once customers purchase from your store, orders will appear here.
                    </div>
                  )}
                </div>

                {/* Alerts & Quick Stats Sidebar */}
                <div className="space-y-6">
                  {/* Quick Metrics */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
                    <h3 className="text-lg font-extrabold text-gray-900 border-b pb-3">
                      Performance Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Today&apos;s Sales</span>
                        <span className="font-bold text-emerald-600">GH₵{(stats.todaySales || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Monthly Sales</span>
                        <span className="font-bold text-gray-900">GH₵{(stats.monthlyRevenue || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Pending Orders</span>
                        <span className="font-bold text-amber-600">{stats.pendingOrders || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Average Store Rating</span>
                        <span className="font-bold text-amber-500">★ {stats.avgRating || "5.0"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Low Stock Alert */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <h3 className="text-lg font-bold text-gray-900">
                        Low Stock Alerts
                      </h3>
                    </div>
                    {lowStockProducts.length > 0 ? (
                      <div className="space-y-3">
                        {lowStockProducts.map((prod: any) => (
                          <div
                            key={prod.id}
                            className="flex items-center justify-between p-3 bg-amber-50/60 border border-amber-100 rounded-xl"
                          >
                            <div className="max-w-[150px] truncate">
                              <p className="text-sm font-bold text-gray-900 truncate">
                                {prod.name}
                              </p>
                              <p className="text-xs text-gray-500">{prod.sku}</p>
                            </div>
                            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                              {prod.stock} left
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-xs text-gray-500">
                        <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                        All products have healthy inventory levels!
                      </div>
                    )}
                    <Link href="/vendor/inventory">
                      <Button variant="outline" className="w-full mt-4 rounded-xl border-gray-300">
                        Manage Inventory
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
