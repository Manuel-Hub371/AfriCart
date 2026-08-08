"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import StatCard from "@/components/profile/stat-card";
import OrderCard from "@/components/profile/order-card";
import {
  ShoppingBag,
  Heart,
  Star,
  DollarSign,
  ArrowRight,
  Loader2,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";

interface DashboardData {
  stats: {
    totalOrders: number;
    wishlistCount: number;
    reviewCount: number;
    totalSpend: number;
  };
  recentOrders: any[];
  featuredProducts: {
    id: string;
    name: string;
    price: number;
    rating: number;
    image: string;
    stock: number;
  }[];
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/dashboard");
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to load dashboard");
      }
      setData(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleAddToCart = async (productId: string) => {
    setAddingToCart(productId);
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      // Trigger cart refresh via custom event
      window.dispatchEvent(new CustomEvent("cart:updated"));
    } catch {
      // silently fail
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ""}! 👋
            </h1>
            <p className="text-gray-500 text-sm">
              Here&apos;s what&apos;s happening with your account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-4 mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
              <button
                onClick={fetchDashboard}
                className="ml-auto text-xs underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 bg-white rounded-xl border animate-pulse"
                />
              ))
            ) : (
              <>
                <StatCard
                  icon={ShoppingBag}
                  label="Total Orders"
                  value={data?.stats.totalOrders ?? 0}
                  iconColor="text-blue-600"
                  iconBg="bg-blue-100"
                />
                <StatCard
                  icon={Heart}
                  label="Wishlist Items"
                  value={data?.stats.wishlistCount ?? 0}
                  iconColor="text-pink-600"
                  iconBg="bg-pink-100"
                />
                <StatCard
                  icon={Star}
                  label="Reviews Written"
                  value={data?.stats.reviewCount ?? 0}
                  iconColor="text-amber-600"
                  iconBg="bg-amber-100"
                />
                <StatCard
                  icon={DollarSign}
                  label="Total Spent"
                  value={`$${(data?.stats.totalSpend ?? 0).toFixed(2)}`}
                  iconColor="text-emerald-600"
                  iconBg="bg-emerald-100"
                />
              </>
            )}
          </div>

          {/* Recent Orders */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
              <Link href="/profile/orders">
                <Button variant="outline" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-40 bg-white rounded-xl border animate-pulse" />
                ))}
              </div>
            ) : !data?.recentOrders.length ? (
              <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No orders yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Your orders will appear here once you make a purchase.
                </p>
                <Link href="/products" className="mt-4 inline-block">
                  <Button size="sm" className="mt-4">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.recentOrders.map((order) => (
                  <OrderCard key={order.fullId} order={order} />
                ))}
              </div>
            )}
          </div>

          {/* Recommended Products (real — newest active products) */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
              <Link href="/products">
                <Button variant="outline" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-64 bg-white rounded-xl border animate-pulse" />
                ))}
              </div>
            ) : !data?.featuredProducts.length ? (
              <div className="text-center py-10 bg-white rounded-xl border">
                <p className="text-gray-400">No products available right now</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <Link href={`/product/${product.id}`}>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-3xl">
                          {product.name[0]}
                        </div>
                      )}
                    </Link>
                    <div className="p-4">
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 mb-1 truncate hover:text-emerald-600">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold text-emerald-600">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        {product.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs text-gray-600">
                              {product.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      {product.stock <= 0 && (
                        <p className="text-xs text-red-500 mb-2 font-medium">Out of Stock</p>
                      )}
                      <Button
                        className="w-full gap-2"
                        size="sm"
                        disabled={product.stock <= 0 || addingToCart === product.id}
                        onClick={() => handleAddToCart(product.id)}
                      >
                        {addingToCart === product.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ShoppingCart className="h-4 w-4" />
                        )}
                        {addingToCart === product.id ? "Adding..." : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
