"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Store, Sparkles, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const [stats, setStats] = useState<{ totalProducts: number; totalStores: number; totalCustomers: number }>({
    totalProducts: 0,
    totalStores: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/marketplace/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // ignore
      }
    }
    loadStats();
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-16">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-10 items-center">
          {/* Left: Content */}
          <div className="space-y-4 sm:space-y-6 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 border border-green-200 shadow-xs">
              <Sparkles className="h-3 w-3 text-green-600" />
              <span className="text-[11px] sm:text-xs font-semibold text-green-700">
                {stats.totalCustomers > 0 ? `Trusted by ${stats.totalCustomers}+ registered shoppers` : "Multi-Vendor Marketplace"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Discover{" "}
              <span className="text-gradient">Everything</span>
              <br />You Need
            </h1>
            
            <p className="text-xs sm:text-base md:text-lg text-gray-600 leading-normal sm:leading-relaxed max-w-lg">
              Shop from verified regional sellers, explore thousands of products, and enjoy a seamless shopping experience with fast delivery.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 sm:gap-6 pt-1 sm:pt-2">
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  <TrendingUp className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-green-600" />
                  <span className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalProducts}</span>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500">Active Products</p>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  <Store className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-green-600" />
                  <span className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalStores}</span>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500">Verified Stores</p>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  <Zap className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-green-600" />
                  <span className="text-lg sm:text-2xl font-bold text-gray-900">24/7</span>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500">Fulfillment</p>
              </div>
            </div>

            <div className="flex flex-row gap-3 pt-1">
              <Link href="/products" className="flex-1 sm:flex-initial">
                <Button size="sm" className="w-full sm:w-auto gradient-primary text-white shadow-md hover:shadow-lg transition-all duration-300 h-10 sm:h-11 px-5 text-xs sm:text-sm rounded-xl font-bold">
                  <ShoppingBag className="h-4 w-4 mr-1.5" />
                  Shop Now
                </Button>
              </Link>
              <Link href="/stores" className="flex-1 sm:flex-initial">
                <Button size="sm" variant="outline" className="w-full sm:w-auto border border-green-200 hover:border-green-300 hover:bg-green-50 h-10 sm:h-11 px-5 text-xs sm:text-sm rounded-xl transition-all duration-300 font-bold">
                  <Store className="h-4 w-4 mr-1.5" />
                  Explore Stores
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Product Showcase Visual */}
          <div className="relative lg:pl-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 animate-slide-up">
                <div className="group bg-white p-5 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 card-hover cursor-pointer">
                  <div className="w-full h-36 bg-gradient-to-br from-green-100 via-green-200 to-green-300 rounded-2xl mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-green-500/20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                </div>
                <div className="group bg-white p-5 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 card-hover cursor-pointer">
                  <div className="w-full h-36 bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300 rounded-2xl mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-emerald-500/20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="group bg-white p-5 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 card-hover cursor-pointer">
                  <div className="w-full h-36 bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 rounded-2xl mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-pink-500/20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                </div>
                <div className="group bg-white p-5 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 card-hover cursor-pointer">
                  <div className="w-full h-36 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 rounded-2xl mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-amber-500/20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
