import { ShoppingCart, Store, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingCart className="h-16 w-16 text-gray-400" />
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Your Cart is Empty
      </h2>

      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Discover products from thousands of trusted stores and start shopping!
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/products">
          <Button size="lg" className="gap-2">
            <Package className="h-5 w-5" />
            Browse Products
          </Button>
        </Link>
        <Link href="/stores">
          <Button size="lg" variant="outline" className="gap-2">
            <Store className="h-5 w-5" />
            Explore Stores
          </Button>
        </Link>
      </div>

      {/* Popular Categories */}
      <div className="mt-12 w-full max-w-2xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Popular Categories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Electronics", "Fashion", "Home & Living", "Beauty"].map(
            (category) => (
              <Link
                key={category}
                href={`/products?category=${category.toLowerCase()}`}
              >
                <div className="p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all cursor-pointer">
                  <p className="font-medium text-gray-900">{category}</p>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
