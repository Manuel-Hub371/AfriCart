import { ShoppingCart, Store, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-20 px-3 text-center max-w-lg mx-auto">
      <div className="w-20 h-20 sm:w-32 sm:h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
        <ShoppingCart className="h-10 w-10 sm:h-16 sm:w-16 text-emerald-600" />
      </div>

      <h2 className="text-xl sm:text-3xl font-black text-gray-900 mb-1.5 tracking-tight">
        Your Cart is Empty
      </h2>

      <p className="text-xs sm:text-base text-gray-600 mb-6 max-w-sm leading-relaxed">
        Discover products from thousands of trusted stores and start shopping!
      </p>

      <div className="flex gap-2.5 flex-wrap justify-center w-full">
        <Link href="/products" className="flex-1 sm:flex-none">
          <Button size="sm" className="w-full gap-1.5 h-9 sm:h-11 font-bold text-xs sm:text-sm rounded-xl gradient-primary text-white shadow-xs">
            <Package className="h-4 w-4" />
            <span>Browse Products</span>
          </Button>
        </Link>
        <Link href="/stores" className="flex-1 sm:flex-none">
          <Button size="sm" variant="outline" className="w-full gap-1.5 h-9 sm:h-11 font-bold text-xs sm:text-sm rounded-xl">
            <Store className="h-4 w-4" />
            <span>Explore Stores</span>
          </Button>
        </Link>
      </div>

      {/* Popular Categories */}
      <div className="mt-8 w-full">
        <h3 className="text-xs sm:text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
          Popular Categories
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {["Electronics", "Fashion", "Home & Living", "Beauty"].map(
            (category) => (
              <Link
                key={category}
                href={`/products?category=${category.toLowerCase()}`}
              >
                <div className="p-2.5 border border-gray-200 rounded-xl hover:border-emerald-500 hover:shadow-2xs transition-all cursor-pointer bg-white">
                  <p className="font-bold text-xs text-gray-900">{category}</p>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
