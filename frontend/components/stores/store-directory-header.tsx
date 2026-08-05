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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-4 shadow-lg">
            <Store className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Discover Trusted Marketplace Stores
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Explore verified merchants, regional brands, and independent stores on AfriCart.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search stores, brands, or categories..."
                className="pl-12 pr-28 h-14 text-base rounded-2xl border-gray-200"
              />
              <Button 
                size="lg" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
              >
                Search
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-600 flex-wrap pt-4">
            <div>
              <span className="font-extrabold text-2xl text-gray-900 block">{stats.totalStores}</span>
              <span className="text-xs font-semibold text-gray-500 uppercase">Active Stores</span>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div>
              <span className="font-extrabold text-2xl text-emerald-600 block">{stats.totalProducts}</span>
              <span className="text-xs font-semibold text-gray-500 uppercase font-semibold">Catalog Items</span>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div>
              <span className="font-extrabold text-2xl text-gray-900 block">{stats.satisfactionRate}%</span>
              <span className="text-xs font-semibold text-gray-500 uppercase">Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
