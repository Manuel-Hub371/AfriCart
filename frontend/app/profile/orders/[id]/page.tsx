"use client";

import { useEffect, useState, use } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  CheckCircle,
  MapPin,
  CreditCard,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Clock,
  Truck,
} from "lucide-react";
import Link from "next/link";

interface OrderDetail {
  id: string;
  status: string;
  paymentStatus: string;
  paymentMethod?: string | null;
  totalAmount: number;
  createdAt: string;
  shippingAddress?: any;
  orderItems: Array<{
    id: string;
    productName: string;
    productImage?: string | null;
    quantity: number;
    price: number;
    storeName: string;
  }>;
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load order details");
        }
        const data = await res.json();
        setOrder(data.order);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex-1 p-12 text-center">
            <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex-1 p-12 max-w-md mx-auto text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <h2 className="text-xl font-extrabold text-gray-900">Order Not Found</h2>
            <p className="text-sm text-gray-600">{error || "Unable to locate order information."}</p>
            <Link href="/profile/orders">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Back to Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Parse shipping address
  const addr = typeof order.shippingAddress === "string"
    ? JSON.parse(order.shippingAddress)
    : order.shippingAddress || {};

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Link href="/profile/orders">
            <Button variant="ghost" className="gap-2 mb-6 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Button>
          </Link>

          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
                Order #{order.id.slice(0, 8)}...
              </h1>
              <p className="text-sm text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-extrabold px-3 py-1">
                Status: {order.status}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-extrabold px-3 py-1">
                Payment: {order.paymentStatus}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Items List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2 border-b pb-4">
                  <Package className="h-5 w-5 text-emerald-600" />
                  Order Items ({order.orderItems.length})
                </h2>

                <div className="divide-y divide-gray-100">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded-xl border flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">
                            <Package className="h-6 w-6" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
                            {item.productName}
                          </h3>
                          <p className="text-xs text-gray-500 font-semibold">Store: {item.storeName}</p>
                          <span className="text-xs text-gray-400 font-medium">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-400">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Summary, Payment & Address */}
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
                <h3 className="font-extrabold text-gray-900 text-base border-b pb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Amount</span>
                    <span className="font-extrabold text-emerald-700 text-lg">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-extrabold text-sm">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  Payment Information
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  {order.paymentMethod || "Standard Payment"}
                </p>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-extrabold text-sm">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  Shipping Destination
                </div>
                {addr.fullName || addr.name ? (
                  <div className="text-xs text-gray-600 space-y-1 font-medium">
                    <p className="font-bold text-gray-900">{addr.fullName || addr.name}</p>
                    {addr.phoneNumber && <p>{addr.phoneNumber}</p>}
                    <p>{addr.streetAddress || addr.address}</p>
                    <p>{addr.city}, {addr.region}</p>
                    <p>{addr.country}</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">Standard delivery location</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
