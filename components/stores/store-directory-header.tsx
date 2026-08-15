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
    <div className="bg-gradient-to-br from-primary-50 to-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-16">
        <div className="text-center space-y-3 sm:space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-emerald-600 rounded-2xl mb-1 sm:mb-4 shadow-md">
            <Store className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Discover Trusted Marketplace Stores
          </h1>
          
          <p className="text-xs sm:text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
            Explore verified merchants, regional brands, and independent stores on AfriCart.
          </p>

          <div className="max-w-xl mx-auto pt-1">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <Input
                type="text"
                placeholder="Search stores, brands, or categories..."
                className="pl-9 sm:pl-12 pr-20 sm:pr-28 h-10 sm:h-14 text-xs sm:text-base rounded-xl sm:rounded-2xl border-gray-200"
              />
              <Button 
                size="sm"
                className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg sm:rounded-xl h-7 sm:h-10 text-xs sm:text-sm font-bold"
              >
                Search
              </Button>
            </div>
          </div>

          <div className="flex justify-center items-center gap-6 sm:gap-12 pt-4 border-t border-gray-100 max-w-lg mx-auto">
            <div>
              <p className="text-lg sm:text-2xl font-black text-gray-900">{stats.totalStores || "50+"}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Verified Stores</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-black text-gray-900">{stats.totalProducts || "1,200+"}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Products</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-black text-emerald-600">{stats.satisfactionRate}%</p>
              <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
