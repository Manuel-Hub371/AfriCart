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
  LogOut,
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
  const { user, logout } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleProfileLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
      setIsLoggingOut(false);
    }
  };

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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-gray-200/80 shadow-2xs">
            <div>
              <h1 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Overview of your recent orders, saved wishlist items, and account activity
              </p>
            </div>

            {/* Quick Action Navigation Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link href="/profile/orders">
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-bold rounded-lg border-gray-200 hover:bg-gray-50">
                  <ShoppingBag className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                  <span>Orders</span>
                </Button>
              </Link>
              <Link href="/profile/messages">
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-bold rounded-lg border-gray-200 hover:bg-gray-50">
                  <span>Messages</span>
                </Button>
              </Link>
              <Link href="/profile/wishlist">
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-bold rounded-lg border-gray-200 hover:bg-gray-50">
                  <Heart className="h-3.5 w-3.5 mr-1 text-pink-600" />
                  <span>Wishlist</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
              <button
                onClick={fetchDashboard}
                className="ml-auto text-xs font-bold underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-white rounded-xl border border-gray-200/80 animate-pulse"
                />
              ))
            ) : (
              <>
                <StatCard
                  icon={ShoppingBag}
                  label="Total Orders"
                  value={data?.stats.totalOrders ?? 0}
                  iconColor="text-blue-600"
                  iconBg="bg-blue-50/80"
                />
                <StatCard
                  icon={Heart}
                  label="Wishlist"
                  value={data?.stats.wishlistCount ?? 0}
                  iconColor="text-pink-600"
                  iconBg="bg-pink-50/80"
                />
                <StatCard
                  icon={Star}
                  label="Reviews"
                  value={data?.stats.reviewCount ?? 0}
                  iconColor="text-amber-600"
                  iconBg="bg-amber-50/80"
                />
                <StatCard
                  icon={DollarSign}
                  label="Total Spent"
                  value={`GH₵${(data?.stats.totalSpend ?? 0).toFixed(0)}`}
                  iconColor="text-emerald-600"
                  iconBg="bg-emerald-50/80"
                />
              </>
            )}
          </div>

          {/* Recent Orders Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Recent Orders</h2>
                <p className="text-xs text-gray-500 font-medium">Track your active and past purchases</p>
              </div>
              <Link href="/profile/orders">
                <Button variant="outline" size="sm" className="gap-1 text-xs font-bold h-8 px-3 rounded-lg border-gray-200 hover:bg-gray-50">
                  <span>View All Orders</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-32 bg-white rounded-xl border border-gray-200/80 animate-pulse" />
                ))}
              </div>
            ) : !data?.recentOrders.length ? (
              <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-200 p-6">
                <ShoppingBag className="h-9 w-9 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-900 font-bold text-xs sm:text-sm">No orders yet</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Your placed orders will appear here once you make a purchase.
                </p>
                <Link href="/products" className="mt-3 inline-block">
                  <Button size="sm" className="gradient-primary text-white font-bold text-xs h-8 px-4 rounded-lg shadow-2xs">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {data.recentOrders.map((order) => (
                  <OrderCard key={order.fullId} order={order} />
                ))}
              </div>
            )}
          </div>

          {/* Recommended Products Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Recommended for You</h2>
                <p className="text-xs text-gray-500 font-medium">Curated picks based on popular marketplace trends</p>
              </div>
              <Link href="/products">
                <Button variant="outline" size="sm" className="gap-1 text-xs font-bold h-8 px-3 rounded-lg border-gray-200 hover:bg-gray-50">
                  <span>Explore Catalog</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-52 bg-white rounded-xl border border-gray-200/80 animate-pulse" />
                ))}
              </div>
            ) : !data?.featuredProducts.length ? (
              <div className="text-center py-6 bg-white rounded-xl border border-gray-200/80 p-4">
                <p className="text-gray-400 text-xs">No products available right now</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {data.featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl border border-gray-200/80 overflow-hidden hover:border-gray-300 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <Link href={`/product/${product.id}`}>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-32 sm:h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-32 sm:h-40 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xl">
                            {product.name[0]}
                          </div>
                        )}
                      </Link>
                      <div className="p-3 space-y-1">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-bold text-gray-900 text-xs truncate hover:text-emerald-600">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-extrabold text-emerald-700">
                            GH₵{product.price.toFixed(2)}
                          </span>
                          {product.rating > 0 && (
                            <div className="flex items-center gap-0.5 text-[10px]">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="font-bold text-gray-700">
                                {product.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        {product.stock <= 0 && (
                          <p className="text-[10px] text-red-500 font-bold">Out of Stock</p>
                        )}
                      </div>
                    </div>

                    <div className="p-3 pt-0">
                      <Button
                        className="w-full gap-1 h-8 text-[11px] font-bold gradient-primary text-white rounded-lg"
                        size="sm"
                        disabled={product.stock <= 0 || addingToCart === product.id}
                        onClick={() => handleAddToCart(product.id)}
                      >
                        {addingToCart === product.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <ShoppingCart className="h-3.5 w-3.5" />
                        )}
                        <span>{addingToCart === product.id ? "Adding..." : "Add to Cart"}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Security & Sign Out Footer Strip */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                <LogOut className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Account Security</h3>
                <p className="text-[11px] text-gray-500 font-medium">Logged in as {user?.email || "Customer"}</p>
              </div>
            </div>

            <Button
              variant="outline"
              disabled={isLoggingOut}
              onClick={handleProfileLogout}
              className="w-full sm:w-auto h-8 px-4 rounded-lg font-bold text-xs text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Logging Out...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </>
              )}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
