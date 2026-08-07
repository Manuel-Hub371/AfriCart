"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { EmptyCart } from "@/components/cart/empty-cart";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, Store } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Cart Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Shopping Cart
              </h1>
              <p className="text-gray-600">
                {cartData.itemCount} {cartData.itemCount === 1 ? "Item" : "Items"} in your cart
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClear} className="text-red-600 border-red-200 hover:bg-red-50">
                Clear Cart
              </Button>
              <Link href="/products">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartData.items.map((item: any) => {
              const imgUrl = item.product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80";
              const isDiscounted = item.product.isDiscounted && item.product.originalPrice > item.product.price;

              return (
                <div key={item.id} className="bg-white rounded-2xl border p-6 flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-50">
                    <img src={imgUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                    <Link href={`/product/${item.product.id}`}>
                      <h3 className="font-bold text-gray-900 text-lg hover:text-emerald-600 transition-colors truncate">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                      <Store className="h-3.5 w-3.5 text-gray-400" />
                      Store: {item.product.storeName}
                    </p>

                    {/* Campaign Pricing Breakdown */}
                    <div className="flex items-baseline justify-center sm:justify-start gap-2 pt-1">
                      <span className="text-emerald-700 font-extrabold text-lg">
                        GH₵{item.product.price.toFixed(2)}
                      </span>
                      {isDiscounted && (
                        <span className="text-xs text-gray-400 line-through">
                          GH₵{item.product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      {isDiscounted && item.product.discountPercent > 0 && (
                        <span className="text-[10px] font-extrabold bg-red-600 text-white px-2 py-0.5 rounded-full">
                          -{item.product.discountPercent}% OFF
                        </span>
                      )}
                    </div>
                    {isDiscounted && item.product.discountAmount > 0 && (
                      <p className="text-xs font-semibold text-emerald-600">
                        Save GH₵{(item.product.discountAmount * item.quantity).toFixed(2)} with campaign offer
                      </p>
                    )}
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-xl bg-gray-50 p-1">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 hover:bg-white rounded-lg disabled:opacity-30 transition-colors"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-white rounded-lg transition-colors"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl border p-6 space-y-6 lg:sticky lg:top-24 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Order Summary</h2>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">GH₵{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? "Free" : `GH₵${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between items-center text-lg font-bold text-gray-900">
                <span>Total</span>
                <span className="text-emerald-600">GH₵{total.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="block">
                <Button size="lg" className="w-full gradient-primary text-white gap-2 h-12 rounded-xl shadow-lg">
                  <ShoppingBag className="h-5 w-5" />
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
