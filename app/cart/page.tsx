"use client";

import { useState } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { VendorCartSection } from "@/components/cart/vendor-cart-section";
import { CartSummary } from "@/components/cart/cart-summary";
import { CouponInput } from "@/components/cart/coupon-input";
import { RecommendedProducts } from "@/components/cart/recommended-products";
import { EmptyCart } from "@/components/cart/empty-cart";
import { Button } from "@/components/ui/button";
import { ShoppingBag, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  // Mock cart data - group by vendor
  const [cartVendors, setCartVendors] = useState([
    {
      vendorId: "1",
      vendorName: "Tech World",
      vendorLogo: "bg-gradient-to-br from-blue-500 to-blue-600",
      verified: true,
      rating: 4.9,
      shippingInfo: {
        cost: 0,
        estimatedDelivery: "July 12 - July 15",
      },
      items: [
        {
          id: "item-1",
          productId: "1",
          name: "Premium Wireless Headphones with Active Noise Cancellation",
          image: "bg-gradient-to-br from-blue-100 to-blue-200",
          price: 89.99,
          originalPrice: 129.99,
          quantity: 1,
          maxQuantity: 10,
          variants: [
            { name: "Color", value: "Black" },
            { name: "Model", value: "Pro" },
          ],
          inStock: true,
        },
        {
          id: "item-2",
          productId: "2",
          name: "Smart Watch with Fitness Tracker",
          image: "bg-gradient-to-br from-purple-100 to-purple-200",
          price: 149.99,
          quantity: 2,
          maxQuantity: 5,
          variants: [{ name: "Color", value: "Silver" }],
          inStock: true,
        },
      ],
    },
    {
      vendorId: "2",
      vendorName: "Fashion Hub",
      vendorLogo: "bg-gradient-to-br from-pink-500 to-pink-600",
      verified: true,
      rating: 4.7,
      shippingInfo: {
        cost: 5.99,
        estimatedDelivery: "July 14 - July 18",
      },
      items: [
        {
          id: "item-3",
          productId: "3",
          name: "Premium Cotton T-Shirt - Multiple Colors",
          image: "bg-gradient-to-br from-pink-100 to-pink-200",
          price: 24.99,
          originalPrice: 39.99,
          quantity: 3,
          maxQuantity: 20,
          variants: [
            { name: "Color", value: "White" },
            { name: "Size", value: "L" },
          ],
          inStock: true,
        },
      ],
    },
  ]);

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setCartVendors((prev) =>
      prev.map((vendor) => ({
        ...vendor,
        items: vendor.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      }))
    );
  };

  const handleRemove = (itemId: string) => {
    setCartVendors((prev) =>
      prev
        .map((vendor) => ({
          ...vendor,
          items: vendor.items.filter((item) => item.id !== itemId),
        }))
        .filter((vendor) => vendor.items.length > 0)
    );
  };

  // Calculate totals
  const subtotal = cartVendors.reduce(
    (total, vendor) =>
      total +
      vendor.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    0
  );
  const shipping = cartVendors.reduce((total, vendor) => total + vendor.shippingInfo.cost, 0);
  const discount = 20;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal + shipping - discount + tax;

  const totalItems = cartVendors.reduce(
    (count, vendor) => count + vendor.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  );
  const totalVendors = cartVendors.length;

  // Check if cart is empty
  if (cartVendors.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <EmptyCart />
        <Footer />
      </div>
    );
  }

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
                {totalItems} {totalItems === 1 ? "Item" : "Items"} from{" "}
                {totalVendors} {totalVendors === 1 ? "Store" : "Stores"}
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Multi-Vendor Notice */}
      {totalVendors > 1 && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-blue-900">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">
                Your order contains items from multiple stores. Products may
                arrive separately with different delivery dates.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartVendors.map((vendor) => (
              <VendorCartSection
                key={vendor.vendorId}
                {...vendor}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}

            {/* Coupon Section */}
            <CouponInput />
          </div>

          {/* Order Summary */}
          <div>
            <div className="lg:sticky lg:top-24">
              <CartSummary
                subtotal={subtotal}
                shipping={shipping}
                discount={discount}
                tax={tax}
                total={total}
              />
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-12">
          <RecommendedProducts />
        </div>
      </div>

      {/* Mobile Sticky Checkout Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600">Total:</span>
          <span className="text-2xl font-bold text-primary">
            ${total.toFixed(2)}
          </span>
        </div>
        <Link href="/checkout">
          <Button size="lg" className="w-full gap-2">
            <ShoppingBag className="h-5 w-5" />
            Proceed to Checkout
          </Button>
        </Link>
      </div>

      {/* Add padding for mobile sticky bar */}
      <div className="lg:hidden h-32"></div>

      <Footer />
    </div>
  );
}
