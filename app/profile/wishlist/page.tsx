"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";

const wishlistItems = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    image: "bg-gradient-to-br from-blue-400 to-blue-500",
    price: 120,
    originalPrice: 150,
    rating: 4.8,
    reviews: 245,
    vendor: "Tech World",
    inStock: true,
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    image: "bg-gradient-to-br from-purple-400 to-purple-500",
    price: 200,
    originalPrice: 250,
    rating: 4.6,
    reviews: 189,
    vendor: "Fashion Hub",
    inStock: true,
  },
  {
    id: "3",
    name: "Designer Sneakers",
    image: "bg-gradient-to-br from-pink-400 to-pink-500",
    price: 100,
    originalPrice: 120,
    rating: 4.9,
    reviews: 532,
    vendor: "Shoe Palace",
    inStock: false,
  },
  {
    id: "4",
    name: "Leather Backpack",
    image: "bg-gradient-to-br from-orange-400 to-orange-500",
    price: 85,
    rating: 4.7,
    reviews: 324,
    vendor: "Bag Store",
    inStock: true,
  },
];

export default function WishlistPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [items, setItems] = useState(wishlistItems);

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600">{items.length} items saved</p>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link href={`/product/${item.id}`}>
                    <div className={`h-56 ${item.image} cursor-pointer`} />
                  </Link>
                  <div className="p-4">
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 hover:text-emerald-600 cursor-pointer line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">{item.vendor}</p>

                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{item.rating}</span>
                      <span className="text-sm text-gray-600">
                        ({item.reviews})
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-xl font-bold text-emerald-600">
                        ${item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ${item.originalPrice}
                        </span>
                      )}
                    </div>

                    {!item.inStock && (
                      <p className="text-sm text-red-600 mb-3 font-medium">
                        Out of Stock
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 gap-2"
                        disabled={!item.inStock}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemove(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Star className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Save items you love for easy access later
              </p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
