"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  CheckCircle,
  MapPin,
  CreditCard,
  BadgeCheck,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock order data
  const order = {
    orderId: orderId,
    date: "July 8, 2026",
    status: "Shipped",
    paymentStatus: "Paid",
    paymentMethod: "Visa •••• 4521",
    vendors: [
      {
        vendorId: "1",
        vendorName: "Tech World",
        vendorLogo: "bg-gradient-to-br from-blue-500 to-blue-600",
        verified: true,
        products: [
          {
            id: "1",
            name: "Premium Wireless Headphones",
            image: "bg-gradient-to-br from-blue-400 to-blue-500",
            quantity: 1,
            price: 120,
          },
          {
            id: "2",
            name: "Smart Watch Pro",
            image: "bg-gradient-to-br from-purple-400 to-purple-500",
            quantity: 1,
            price: 200,
          },
        ],
        subtotal: 320,
        shipping: 10,
        shippingStatus: "Shipped",
        trackingNumber: "TRK123456789",
      },
    ],
    shippingAddress: {
      name: "Manuel Darko",
      phone: "+233 XX XXX XXXX",
      address: "Supi WY Eudful Street",
      city: "Agona Swedru",
      region: "Central Region",
      country: "Ghana",
    },
    timeline: [
      {
        status: "Order Placed",
        date: "July 8, 2026 - 10:30 AM",
        completed: true,
      },
      {
        status: "Payment Confirmed",
        date: "July 8, 2026 - 10:32 AM",
        completed: true,
      },
      {
        status: "Processing",
        date: "July 8, 2026 - 11:00 AM",
        completed: true,
      },
      {
        status: "Shipped",
        date: "July 9, 2026 - 2:00 PM",
        completed: true,
      },
      {
        status: "Delivered",
        date: "Expected: July 12-15, 2026",
        completed: false,
      },
    ],
  };

  const subtotal = order.vendors.reduce((sum, v) => sum + v.subtotal, 0);
  const shipping = order.vendors.reduce((sum, v) => sum + v.shipping, 0);
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Link href="/profile/orders">
            <Button variant="ghost" className="gap-2 mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Button>
          </Link>

          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Order #{order.orderId}
                </h1>
                <p className="text-gray-600">Placed on {order.date}</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-blue-100 text-blue-700">
                  {order.status}
                </Badge>
                <Badge className="bg-green-100 text-green-700">
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Timeline */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-6">Order Timeline</h2>
                <div className="space-y-6">
                  {order.timeline.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed
                              ? "bg-emerald-600"
                              : "bg-gray-200"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle className="h-6 w-6 text-white" />
                          ) : (
                            <Package className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        {index < order.timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              step.completed ? "bg-emerald-600" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-6">
                        <h3
                          className={`font-semibold ${
                            step.completed ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {step.status}
                        </h3>
                        <p className="text-sm text-gray-600">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vendor Orders */}
              {order.vendors.map((vendor) => (
                <div key={vendor.vendorId} className="bg-white rounded-lg border p-6">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 ${vendor.vendorLogo} rounded-lg flex items-center justify-center text-white text-xl font-bold`}
                      >
                        {vendor.vendorName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {vendor.vendorName}
                          </h3>
                          {vendor.verified && (
                            <BadgeCheck className="h-4 w-4 text-emerald-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Status: {vendor.shippingStatus}
                        </p>
                      </div>
                    </div>
                    {vendor.trackingNumber && (
                      <Button>Track Package</Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {vendor.products.map((product) => (
                      <div key={product.id} className="flex gap-4">
                        <div
                          className={`w-20 h-20 ${product.image} rounded-lg flex-shrink-0`}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {product.name}
                          </h4>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">
                              Qty: {product.quantity}
                            </span>
                            <span className="font-semibold">
                              ${product.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {vendor.trackingNumber && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        Tracking Number:{" "}
                        <span className="font-medium text-gray-900">
                          {vendor.trackingNumber}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>${shipping}</span>
                  </div>
                  <div className="pt-3 border-t flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-emerald-600">
                      ${total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold">Payment Method</h3>
                </div>
                <p className="text-gray-600">{order.paymentMethod}</p>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold">Shipping Address</h3>
                </div>
                <div className="text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress.name}
                  </p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.region}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
