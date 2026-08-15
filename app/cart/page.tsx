"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { EmptyCart } from "@/components/cart/empty-cart";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, Store, Package } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const [cartData, setCartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadCart() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCartData(data);
      }
    } catch (err) {
      console.error("Failed to load cart:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCartData(updated);
      }
    } catch (err) {
      console.error("Failed to update cart quantity:", err);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const updated = await res.json();
        setCartData(updated);
      }
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
    }
  };

  const handleClear = async () => {
    try {
      const res = await fetch("/api/cart", { method: "DELETE" });
      if (res.ok) {
        const updated = await res.json();
        setCartData(updated);
      }
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <EmptyCart />
        <Footer />
      </div>
    );
  }

  const subtotal = cartData.subtotal || 0;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pb-20 lg:pb-12">
        {/* Cart Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6">
            <div className="flex items-center justify-between flex-wrap gap-2.5">
              <div>
                <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  Shopping Cart
                </h1>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {cartData.itemCount} {cartData.itemCount === 1 ? "Item" : "Items"} in your cart
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleClear} className="text-red-600 border-red-200 hover:bg-red-50 font-bold text-xs h-8 sm:h-9 px-2.5 rounded-xl">
                  Clear Cart
                </Button>
                <Link href="/products">
                  <Button variant="outline" size="sm" className="gap-1.5 font-bold text-xs h-8 sm:h-9 px-2.5 rounded-xl">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Continue</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-2.5 sm:space-y-4">
              {cartData.items.map((item: any) => {
                const imgUrl = item.product.image || "";
                const isDiscounted = item.product.isDiscounted && item.product.originalPrice > item.product.price;

                return (
                  <div key={item.id} className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-2.5 sm:p-5 flex gap-3 sm:gap-5 items-center shadow-2xs">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-50 flex items-center justify-center">
                      {imgUrl ? (
                        <img src={imgUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/product/${item.product.id}`} className="min-w-0 flex-1">
                          <h3 className="font-extrabold text-gray-900 text-xs sm:text-base hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                            {item.product.name}
                          </h3>
                        </Link>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                        <Store className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[140px] sm:max-w-[200px]">{item.product.storeName}</span>
                      </p>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-1.5 flex-wrap pt-0.5">
                        <span className="text-emerald-700 font-black text-xs sm:text-base">
                          GH₵{item.product.price.toFixed(2)}
                        </span>
                        {isDiscounted && (
                          <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                            GH₵{item.product.originalPrice.toFixed(2)}
                          </span>
                        )}
                        {isDiscounted && item.product.discountPercent > 0 && (
                          <span className="text-[8px] sm:text-[10px] font-extrabold bg-red-500 text-white px-1.5 py-0.2 rounded-full">
                            -{item.product.discountPercent}%
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-0.5">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 hover:bg-white rounded disabled:opacity-30 transition-colors"
                          >
                            <Minus className="h-3 w-3 text-gray-600" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white rounded transition-colors"
                          >
                            <Plus className="h-3 w-3 text-gray-600" />
                          </button>
                        </div>

                        <span className="text-xs font-black text-gray-900">
                          GH₵{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary (Desktop Sideboard & Mobile Card) */}
            <div>
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-4 lg:sticky lg:top-24 shadow-2xs">
                <h2 className="text-base sm:text-xl font-extrabold text-gray-900 border-b pb-3">Order Summary</h2>

                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">GH₵{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="font-bold text-gray-900">
                      {shipping === 0 ? "Free" : `GH₵${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-3 flex justify-between items-center text-base sm:text-lg font-black text-gray-900">
                  <span>Total</span>
                  <span className="text-emerald-600">GH₵{total.toFixed(2)}</span>
                </div>

                <Link href="/checkout" className="block">
                  <Button size="lg" className="w-full gradient-primary text-white font-black text-xs sm:text-sm gap-2 h-10 sm:h-12 rounded-xl shadow-xs">
                    <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Mobile Checkout Bottom Bar */}
      <div className="fixed bottom-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-2.5 flex items-center justify-between shadow-lg lg:hidden">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-semibold uppercase">Total ({cartData.itemCount} items)</span>
          <span className="text-sm font-black text-emerald-600">GH₵{total.toFixed(2)}</span>
        </div>
        <Link href="/checkout" className="flex-1 ml-4">
          <Button className="w-full gradient-primary text-white font-extrabold text-xs h-9 rounded-xl shadow-xs gap-1.5">
            <ShoppingBag className="h-4 w-4" />
            <span>Checkout Now</span>
          </Button>
        </Link>
      </div>

      <Footer />
    </div>
  );
}
