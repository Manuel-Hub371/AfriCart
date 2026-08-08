"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadWishlist() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (itemIdOrProductId: string) => {
    try {
      const res = await fetch(`/api/wishlist/${itemIdOrProductId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const updated = await res.json();
        setItems(updated);
      }
    } catch (err) {
      console.error("Failed to remove item from wishlist:", err);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      // Optionally remove from wishlist after adding to cart
      await handleRemove(productId);
    } catch (err) {
      console.error("Failed to add wishlist item to cart:", err);
    }
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

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-white rounded-lg border p-4 animate-pulse"></div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link href={`/product/${item.product.id}`}>
                    <div className="h-48 bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center font-bold text-emerald-800 text-2xl cursor-pointer">
                      {item.product.name[0]}
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/product/${item.product.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 hover:text-emerald-600 cursor-pointer line-clamp-2">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-500 mb-2">Store: {item.product.storeName}</p>

                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{item.product.rating || 4.8}</span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-xl font-bold text-emerald-600">
                        ${item.product.price}
                      </span>
                    </div>

                    {item.product.stock <= 0 && (
                      <p className="text-xs text-red-600 mb-3 font-medium">
                        Out of Stock
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 gap-2"
                        disabled={item.product.stock <= 0}
                        onClick={() => handleAddToCart(item.product.id)}
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
            <div className="text-center py-16 bg-white rounded-2xl border">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-4">
                <Star className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Save items you love while shopping to easily find them later.
              </p>
              <Link href="/products">
                <Button className="gradient-primary text-white">Browse Products</Button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
