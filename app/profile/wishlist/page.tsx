"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { extractCoverImage, getCategoryFallbackImage } from "@/lib/image-utils";

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

        <main className="flex-1 p-3 sm:p-6 lg:p-8 space-y-3 sm:space-y-6">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
              My Wishlist
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{items.length} items saved</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-56 bg-white rounded-xl border p-2.5 animate-pulse"></div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
              {items.map((item) => {
                const coverImage = extractCoverImage(item.product.images || item.product.image, item.product.name, item.product.categoryName);
                const imgUrl = coverImage || getCategoryFallbackImage(item.product.name, item.product.categoryName);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <Link href={`/product/${item.product.id}`}>
                        <img
                          src={imgUrl}
                          alt={item.product.name}
                          className="h-32 sm:h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.currentTarget;
                            const fallback = getCategoryFallbackImage(item.product.name, item.product.categoryName);
                            if (target.src !== fallback) {
                              target.src = fallback;
                            }
                          }}
                        />
                      </Link>
                      <div className="p-2 sm:p-4 space-y-1">
                        <Link href={`/product/${item.product.id}`}>
                          <h3 className="font-bold text-gray-900 text-xs sm:text-sm hover:text-emerald-600 line-clamp-2 leading-tight">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-[10px] text-gray-500 truncate">Store: {item.product.storeName}</p>

                        <div className="flex items-center gap-0.5 text-[10px] sm:text-xs">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-gray-800">{item.product.rating || 4.8}</span>
                        </div>

                        <div className="pt-0.5">
                          <span className="text-xs sm:text-base font-black text-emerald-700">
                            GH₵{Number(item.product.price).toFixed(2)}
                          </span>
                        </div>

                        {item.product.stock <= 0 && (
                          <p className="text-[10px] text-red-600 font-extrabold">
                            Out of Stock
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-2 sm:p-4 pt-0 flex gap-1.5">
                      <Button
                        size="sm"
                        className="flex-1 gap-1 h-7 sm:h-9 text-[10px] sm:text-xs font-bold gradient-primary text-white rounded-lg sm:rounded-xl"
                        disabled={item.product.stock <= 0}
                        onClick={() => handleAddToCart(item.product.id)}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 sm:h-9 sm:w-9 p-0 rounded-lg sm:rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleRemove(item.id)}
                        title="Remove from wishlist"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 sm:py-16 bg-white rounded-2xl border border-dashed border-gray-200 p-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-full mb-3">
                <Star className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="text-base sm:text-xl font-extrabold text-gray-900 mb-1">
                Your wishlist is empty
              </h3>
              <p className="text-xs text-gray-500 mb-4 max-w-xs mx-auto">
                Save items you love while shopping to easily find them later.
              </p>
              <Link href="/products">
                <Button className="gradient-primary text-white font-bold text-xs h-8 px-4 rounded-xl shadow-2xs">
                  Browse Products
                </Button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
