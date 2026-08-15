"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  BookOpen,
  ShoppingBasket,
  Car,
} from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, any> = {
  electronics: Smartphone,
  fashion: Shirt,
  home: Home,
  beauty: Sparkles,
  sports: Dumbbell,
  books: BookOpen,
  groceries: ShoppingBasket,
  automotive: Car,
};

export function FeaturedCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCategories();
  }, []);

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white to-green-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block mb-2 sm:mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs sm:text-sm font-semibold">
              Browse Categories
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Shop by <span className="text-gradient">Category</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
            Explore our wide range of products across different categories
          </p>
        </div>

        {isLoading ? (
          <div className="flex md:grid md:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto pb-2 no-scrollbar">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex-shrink-0 w-20 md:w-auto flex flex-col items-center space-y-2 animate-pulse">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gray-200"></div>
                <div className="h-3 w-14 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <>
            {/* Mobile View (<md): Horizontal Swipeable Circles Bar */}
            <div className="md:hidden flex items-center gap-3.5 overflow-x-auto pb-3 px-1 no-scrollbar scroll-smooth">
              {categories.map((category) => {
                const slug = category.slug || category.name.toLowerCase();
                const Icon = iconMap[slug] || Smartphone;
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${slug}`}
                    className="flex-shrink-0 flex flex-col items-center justify-center w-20 group"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200 p-3 mb-1.5 border border-emerald-400/30">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-800 text-center line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {category.name}
                    </span>
                    <span className="text-[9px] text-gray-400 font-medium">
                      {category.productCount || 0} items
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop View (>=md): Rich Category Cards */}
            <div className="hidden md:grid md:grid-cols-4 gap-5 md:gap-6">
              {categories.map((category) => {
                const slug = category.slug || category.name.toLowerCase();
                const Icon = iconMap[slug] || Smartphone;
                return (
                  <Link key={category.id} href={`/products?category=${slug}`}>
                    <Card className="group relative overflow-hidden bg-white border-2 border-gray-100 hover:border-green-200 p-6 card-hover cursor-pointer rounded-2xl">
                      <div className="relative flex flex-col items-center text-center space-y-3">
                        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm mb-0.5 group-hover:text-green-700 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {category.productCount || 0} items
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-xs text-gray-500">No categories found.</div>
        )}
      </div>
    </section>
  );
}
