"use client";

import { useState, useEffect, useMemo } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { 
  Truck, 
  Package, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Download,
  Loader2 
} from "lucide-react";

export default function VendorShippingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFulfillment() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/vendor/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Failed to load vendor orders for shipping:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFulfillment();
  }, []);

  const shippedOrders = useMemo(() => {
    return orders.filter((o) => o.status === "SHIPPED" || o.status === "DELIVERED");
  }, [orders]);

  const pendingShipments = useMemo(() => {
    return orders.filter((o) => o.status === "PENDING" || o.status === "PROCESSING" || o.status === "PACKED");
  }, [orders]);

  const handleExport = () => {
    if (orders.length === 0) return;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Order ID,Customer,Total Amount,Status,Date"]
        .concat(
          orders.map(
            (o) => `"${o.id}","${o.customerName || "Customer"}",${o.totalAmount},"${o.status}","${new Date(o.createdAt).toLocaleDateString()}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vendor_shipments_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <VendorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <VendorTopbar
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumbs={[
            { label: "Dashboard", href: "/vendor" },
            { label: "Shipping" },
          ]}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                  Shipping &amp; Fulfillment
                </h1>
                <p className="text-gray-600 text-sm">
                  Track store dispatch, order shipments, delivery status, and fulfillment metrics.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={orders.length === 0}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50 rounded-xl"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="py-24 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
                <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mx-auto mb-3" />
                <p className="text-gray-500 font-medium text-sm">Loading fulfillment data...</p>
              </div>
            ) : (
              <>
                {/* Fulfillment KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Awaiting Dispatch</span>
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <Clock className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-amber-600">{pendingShipments.length}</h3>
                    <p className="text-xs text-gray-400 mt-1">Pending or processing orders</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">In-Transit &amp; Shipped</span>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Truck className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-blue-600">
                      {orders.filter((o) => o.status === "SHIPPED").length}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">En route to customers</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Delivered Orders</span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-emerald-600">
                      {orders.filter((o) => o.status === "DELIVERED").length}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Completed door deliveries</p>
                  </div>
                </div>

                {/* Active Shipments Table */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Shipment Fulfillment Log</h2>
                      <p className="text-xs text-gray-500">Real customer orders requiring or undergoing delivery</p>
                    </div>
                  </div>

                  {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-xs uppercase text-gray-400 font-bold tracking-wider">
                            <th className="text-left py-3 px-6">Order Ref</th>
                            <th className="text-left py-3 px-6">Customer</th>
                            <th className="text-left py-3 px-6">Destination Address</th>
                            <th className="text-left py-3 px-6">Fulfillment Status</th>
                            <th className="text-left py-3 px-6">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((o) => (
                            <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50/50">
                              <td className="py-4 px-6 text-sm font-bold text-gray-900">
                                #{o.id.slice(0, 8).toUpperCase()}
                              </td>
                              <td className="py-4 px-6 text-sm text-gray-600">
                                {o.customerName || o.customerEmail || "Customer"}
                              </td>
                              <td className="py-4 px-6 text-sm text-gray-600 flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                                <span className="truncate max-w-xs font-medium">
                                  {typeof o.shippingAddress === "object"
                                    ? `${o.shippingAddress?.address || "Address"}, ${o.shippingAddress?.city || "Accra"}`
                                    : "Standard Doorstep Delivery"}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <span
                                  className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                                    o.status === "DELIVERED"
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : o.status === "SHIPPED"
                                      ? "bg-blue-100 text-blue-700 border-blue-200"
                                      : "bg-amber-100 text-amber-700 border-amber-200"
                                  }`}
                                >
                                  {o.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-sm text-gray-500">
                                {new Date(o.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-16 text-center text-gray-500 text-sm">
                      <Truck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      No active store shipments yet. Once customers order from your store, delivery logs will appear here.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
