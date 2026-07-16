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

const categories = [
  { 
    name: "Electronics", 
    icon: Smartphone, 
    count: "12,543", 
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50"
  },
  { 
    name: "Fashion", 
    icon: Shirt, 
    count: "8,234", 
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-50 to-rose-50"
  },
  { 
    name: "Home & Living", 
    icon: Home, 
    count: "6,789", 
    gradient: "from-orange-500 to-amber-500",
    bgGradient: "from-orange-50 to-amber-50"
  },
  { 
    name: "Beauty", 
    icon: Sparkles, 
    count: "4,567", 
    gradient: "from-green-500 to-pink-500",
    bgGradient: "from-green-50 to-pink-50"
  },
  { 
    name: "Sports", 
    icon: Dumbbell, 
    count: "3,456", 
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50"
  },
  { 
    name: "Books", 
    icon: BookOpen, 
    count: "9,876", 
    gradient: "from-emerald-500 to-green-500",
    bgGradient: "from-emerald-50 to-green-50"
  },
  { 
    name: "Groceries", 
    icon: ShoppingBasket, 
    count: "5,432", 
    gradient: "from-red-500 to-orange-500",
    bgGradient: "from-red-50 to-orange-50"
  },
  { 
    name: "Automotive", 
    icon: Car, 
    count: "2,345", 
    gradient: "from-gray-600 to-slate-600",
    bgGradient: "from-gray-50 to-slate-50"
  },
];

export function FeaturedCategories() {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-green-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
              Browse Categories
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Shop by <span className="text-gradient">Category</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of products across different categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link key={category.name} href={`/category/${category.name.toLowerCase()}`}>
                <Card className="group relative overflow-hidden bg-white border-2 border-gray-100 hover:border-green-200 p-6 card-hover cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  <div className="relative flex flex-col items-center text-center space-y-4">
                    <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.gradient} blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-green-700 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.count} items
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
