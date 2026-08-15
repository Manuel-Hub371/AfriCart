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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {categories.map((category) => {
              const slug = category.slug || category.name.toLowerCase();
              const Icon = iconMap[slug] || Smartphone;
              return (
                <Link key={category.id} href={`/products?category=${slug}`}>
                  <Card className="group relative overflow-hidden bg-white border-2 border-gray-100 hover:border-green-200 p-6 card-hover cursor-pointer">
                    <div className="relative flex flex-col items-center text-center space-y-4">
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-green-700 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {category.productCount || 0} items
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No categories found.</div>
        )}
      </div>
    </section>
  );
}
