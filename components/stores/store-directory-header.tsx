"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Store } from "lucide-react";

export function StoreDirectoryHeader() {
  const [stats, setStats] = useState<{ totalStores: number; totalProducts: number; satisfactionRate: number }>({
    totalStores: 0,
    totalProducts: 0,
    satisfactionRate: 99,
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
    <div className="bg-gradient-to-br from-emerald-50/50 via-white to-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-14">
        <div className="text-center space-y-2.5 sm:space-y-5">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-emerald-600 rounded-xl sm:rounded-2xl shadow-xs">
            <Store className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
          </div>
          
          <h1 className="text-xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Discover Trusted Marketplace Stores
          </h1>
          
          <p className="text-xs sm:text-base md:text-xl text-gray-600 max-w-xl mx-auto leading-relaxed">
            Explore verified merchants, regional brands, and independent stores on AfriCart.
          </p>

          <div className="max-w-md mx-auto pt-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-3.5 w-3.5 sm:h-5 sm:w-5 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search stores, brands, or categories..."
                className="pl-8 sm:pl-12 pr-20 sm:pr-28 h-9 sm:h-12 text-xs sm:text-base rounded-xl sm:rounded-2xl border-gray-200 shadow-2xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              <Button 
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg sm:rounded-xl h-7 sm:h-10 text-[10px] sm:text-sm font-bold px-2.5 sm:px-4"
              >
                Search
              </Button>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 sm:gap-10 pt-3 border-t border-gray-100 max-w-md mx-auto">
            <div>
              <p className="text-base sm:text-2xl font-black text-gray-900">{stats.totalStores || "50+"}</p>
              <p className="text-[9px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider">Stores</p>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div>
              <p className="text-base sm:text-2xl font-black text-gray-900">{stats.totalProducts || "1,200+"}</p>
              <p className="text-[9px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider">Products</p>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div>
              <p className="text-base sm:text-2xl font-black text-emerald-600">{stats.satisfactionRate}%</p>
              <p className="text-[9px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
