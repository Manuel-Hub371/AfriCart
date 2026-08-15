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

        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-3 sm:space-y-6">
          <Link href="/profile/orders">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 h-8 px-2.5 rounded-xl">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Orders
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-gray-200 pb-3 sm:pb-6">
            <div>
              <h1 className="text-lg sm:text-3xl font-black text-gray-900 tracking-tight">
                Order #{order.id.slice(0, 8).toUpperCase()}...
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full">
                Status: {order.status}
              </Badge>
              <Badge className="bg-blue-50 text-blue-800 border-blue-200 font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full">
                Payment: {order.paymentStatus}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
            {/* Left: Items List */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-6">
              <div className="bg-white rounded-xl sm:rounded-3xl border border-gray-200 p-3.5 sm:p-6 shadow-2xs space-y-3">
                <h2 className="text-sm sm:text-lg font-black text-gray-900 flex items-center gap-1.5 border-b border-gray-100 pb-2.5">
                  <Package className="h-4 w-4 text-emerald-600" />
                  Order Items ({order.orderItems.length})
                </h2>

                <div className="divide-y divide-gray-100">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="py-2.5 sm:py-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                            <Package className="h-5 w-5" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-extrabold text-gray-900 text-xs sm:text-base line-clamp-1">
                            {item.productName}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-gray-500 font-semibold">Store: {item.storeName}</p>
                          <span className="text-[10px] text-gray-400 font-medium">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs sm:text-base font-black text-emerald-700 block">
                          GH₵{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <p className="text-[10px] text-gray-400">GH₵{item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Summary, Payment & Address */}
            <div className="space-y-3 sm:space-y-6">
              {/* Summary */}
              <div className="bg-white rounded-xl sm:rounded-3xl border border-gray-200 p-3.5 sm:p-6 shadow-2xs space-y-3">
                <h3 className="font-black text-gray-900 text-xs sm:text-base border-b border-gray-100 pb-2">Order Summary</h3>
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="font-bold">Total Amount</span>
                    <span className="font-black text-emerald-700 text-sm sm:text-lg">
                      GH₵{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl sm:rounded-3xl border border-gray-200 p-3.5 sm:p-6 shadow-2xs space-y-2">
                <div className="flex items-center gap-1.5 text-gray-900 font-extrabold text-xs sm:text-sm">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  <span>Payment Information</span>
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  {order.paymentMethod || "Standard Payment"}
                </p>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl sm:rounded-3xl border border-gray-200 p-3.5 sm:p-6 shadow-2xs space-y-2">
                <div className="flex items-center gap-1.5 text-gray-900 font-extrabold text-xs sm:text-sm">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span>Shipping Destination</span>
                </div>
                {addr.fullName || addr.name ? (
                  <div className="text-xs text-gray-600 space-y-0.5 font-medium">
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
