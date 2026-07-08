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
  { name: "Electronics", icon: Smartphone, count: "12,543", color: "text-blue-600" },
  { name: "Fashion", icon: Shirt, count: "8,234", color: "text-pink-600" },
  { name: "Home & Living", icon: Home, count: "6,789", color: "text-orange-600" },
  { name: "Beauty", icon: Sparkles, count: "4,567", color: "text-purple-600" },
  { name: "Sports", icon: Dumbbell, count: "3,456", color: "text-green-600" },
  { name: "Books", icon: BookOpen, count: "9,876", color: "text-indigo-600" },
  { name: "Groceries", icon: ShoppingBasket, count: "5,432", color: "text-red-600" },
  { name: "Automotive", icon: Car, count: "2,345", color: "text-gray-600" },
];

export function FeaturedCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600">
            Explore our wide range of products across different categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.name} href={`/category/${category.name.toLowerCase()}`}>
                <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`p-4 bg-gray-50 rounded-full ${category.color}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {category.count} products
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
