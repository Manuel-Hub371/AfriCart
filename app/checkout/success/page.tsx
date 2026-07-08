"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Package, Truck, MessageCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const vendorOrders = [
    {
      vendorId: "1",
      vendorName: "Tech World",
      status: "Processing",
      estimatedDelivery: "July 12 - July 15",
      products: 2,
    },
    {
      vendorId: "2",
      vendorName: "Fashion House",
      status: "Preparing Shipment",
      estimatedDelivery: "July 13 - July 16",
      products: 1,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-emerald-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been placed successfully.
          </p>

          {/* Order Number */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-emerald-600">#{orderId}</p>
          </div>

          {/* Order Details */}
          <div className="text-left mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">
              Order Tracking Preview
            </h2>
            <div className="space-y-3">
              {vendorOrders.map((vendor) => (
                <div
                  key={vendor.vendorId}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {vendor.vendorName}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{vendor.products} item(s)</p>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          <span>Estimated: {vendor.estimatedDelivery}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {vendor.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-left">
                <p className="text-sm text-blue-800">
                  A confirmation email with your order details has been sent to
                  your email address. You can track your orders in the{" "}
                  <Link href="/orders" className="underline font-medium">
                    My Orders
                  </Link>{" "}
                  section.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              variant="outline"
              className="flex-1"
            >
              <Link href={`/orders/${orderId}`}>
                <Package className="h-5 w-5 mr-2" />
                View Order
              </Link>
            </Button>
            <Button
              asChild
              className="flex-1"
            >
              <Link href="/">
                <Home className="h-5 w-5 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>

          {/* Auto Redirect */}
          <p className="text-sm text-gray-500 mt-6">
            Redirecting to homepage in {countdown} seconds...
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact our{" "}
            <Link href="/support" className="text-emerald-600 hover:underline">
              customer support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
