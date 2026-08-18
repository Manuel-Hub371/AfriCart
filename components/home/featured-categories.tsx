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
  Pill,
  Baby,
  Gem,
  Grid,
  Laptop,
  Utensils,
  Wrench,
  Trophy,
} from "lucide-react";
import Link from "next/link";

/**
 * Returns the exact vector category icon and color styling matching FontAwesome / Bootstrap icon standards
 */
function getCategoryIcon(slug: string = "", name: string = "") {
  const str = `${slug} ${name}`.toLowerCase();

  if (
    str.includes("electron") ||
    str.includes("gadget") ||
    str.includes("tech") ||
    str.includes("phone") ||
    str.includes("mobile")
  ) {
    return {
      icon: Smartphone,
      bg: "bg-blue-50 text-blue-600 border-blue-100",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white",
    };
  }

  if (
    str.includes("fashion") ||
    str.includes("appeal") ||
    str.includes("cloth") ||
    str.includes("wear") ||
    str.includes("apparel")
  ) {
    return {
      icon: Shirt,
      bg: "bg-purple-50 text-purple-600 border-purple-100",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-600 text-white",
    };
  }

  if (
    str.includes("home") ||
    str.includes("living") ||
    str.includes("furnit") ||
    str.includes("decor") ||
    str.includes("kitchen")
  ) {
    return {
      icon: Home,
      bg: "bg-amber-50 text-amber-600 border-amber-100",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600 text-white",
    };
  }

  if (
    str.includes("beauty") ||
    str.includes("personal") ||
    str.includes("cosmetic") ||
    str.includes("skincare") ||
    str.includes("care")
  ) {
    return {
      icon: Sparkles,
      bg: "bg-pink-50 text-pink-600 border-pink-100",
      iconBg: "bg-gradient-to-br from-pink-500 to-rose-600 text-white",
    };
  }

  if (
    str.includes("food") ||
    str.includes("gorric") ||
    str.includes("grocer") ||
    str.includes("snack") ||
    str.includes("market")
  ) {
    return {
      icon: ShoppingBasket,
      bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
    };
  }

  if (
    str.includes("pharmac") ||
    str.includes("health") ||
    str.includes("medic") ||
    str.includes("wellness")
  ) {
    return {
      icon: Pill,
      bg: "bg-rose-50 text-rose-600 border-rose-100",
      iconBg: "bg-gradient-to-br from-rose-500 to-red-600 text-white",
    };
  }

  if (
    str.includes("auto") ||
    str.includes("car") ||
    str.includes("vehicle") ||
    str.includes("mobile")
  ) {
    return {
      icon: Car,
      bg: "bg-cyan-50 text-cyan-600 border-cyan-100",
      iconBg: "bg-gradient-to-br from-cyan-500 to-blue-600 text-white",
    };
  }

  if (
    str.includes("sport") ||
    str.includes("fit") ||
    str.includes("sort") ||
    str.includes("gym")
  ) {
    return {
      icon: Dumbbell,
      bg: "bg-green-50 text-green-600 border-green-100",
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-600 text-white",
    };
  }

  if (
    str.includes("book") ||
    str.includes("stationer") ||
    str.includes("office") ||
    str.includes("paper")
  ) {
    return {
      icon: BookOpen,
      bg: "bg-amber-50 text-amber-700 border-amber-100",
      iconBg: "bg-gradient-to-br from-amber-600 to-yellow-700 text-white",
    };
  }

  if (str.includes("baby") || str.includes("kid") || str.includes("toy")) {
    return {
      icon: Baby,
      bg: "bg-sky-50 text-sky-600 border-sky-100",
      iconBg: "bg-gradient-to-br from-sky-400 to-blue-500 text-white",
    };
  }

  if (str.includes("jewel") || str.includes("watch") || str.includes("luxur")) {
    return {
      icon: Gem,
      bg: "bg-violet-50 text-violet-600 border-violet-100",
      iconBg: "bg-gradient-to-br from-violet-500 to-purple-600 text-white",
    };
  }

  return {
    icon: Grid,
    bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-600 text-white",
  };
}

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
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs sm:text-sm font-bold">
              Browse Categories
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Shop by <span className="text-gradient">Category</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto font-medium">
            Explore our wide range of authentic African products across different categories
          </p>
        </div>

        {isLoading ? (
          <div className="flex md:grid md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto pb-2 no-scrollbar">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0 w-24 md:w-auto flex flex-col items-center space-y-2 animate-pulse">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gray-200"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <>
            {/* Mobile View (<md): Horizontal Scrollable Pill Cards */}
            <div className="md:hidden flex items-center gap-3.5 overflow-x-auto pb-3 px-1 no-scrollbar scroll-smooth">
              {categories.map((category) => {
                const slug = category.slug || category.name.toLowerCase();
                const { icon: Icon, iconBg } = getCategoryIcon(slug, category.name);
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${slug}`}
                    className="flex-shrink-0 flex flex-col items-center justify-center w-24 group"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200 p-3 mb-1.5 border border-white/40`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-900 text-center line-clamp-1 group-hover:text-emerald-600 transition-colors">
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
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
              {categories.map((category) => {
                const slug = category.slug || category.name.toLowerCase();
                const { icon: Icon, iconBg } = getCategoryIcon(slug, category.name);
                return (
                  <Link key={category.id} href={`/products?category=${slug}`}>
                    <Card className="group relative overflow-hidden bg-white border border-gray-200/80 hover:border-emerald-300 p-5 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer rounded-2xl">
                      <div className="relative flex flex-col items-center text-center space-y-3">
                        <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-gray-900 text-xs sm:text-sm mb-0.5 group-hover:text-emerald-700 transition-colors line-clamp-1">
                            {category.name}
                          </h3>
                          <p className="text-[11px] text-gray-400 font-medium">
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
          <div className="text-center py-8 text-xs text-gray-500 font-medium">No categories found.</div>
        )}
      </div>
    </section>
  );
}
