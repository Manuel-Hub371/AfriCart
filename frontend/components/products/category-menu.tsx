"use client";

import { Smartphone, Shirt, Home, Sparkles, Dumbbell, BookOpen, ShoppingBasket, Car } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const categories = [
  { id: "all", name: "All Products", icon: ShoppingBasket, count: 10542 },
  { id: "electronics", name: "Electronics", icon: Smartphone, count: 2543 },
  { id: "fashion", name: "Fashion", icon: Shirt, count: 3234 },
  { id: "home", name: "Home & Living", icon: Home, count: 1789 },
  { id: "beauty", name: "Beauty", icon: Sparkles, count: 1567 },
  { id: "sports", name: "Sports", icon: Dumbbell, count: 956 },
  { id: "books", name: "Books", icon: BookOpen, count: 1876 },
  { id: "automotive", name: "Automotive", icon: Car, count: 577 },
];

export function CategoryMenu() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="bg-white border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{category.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {category.count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
