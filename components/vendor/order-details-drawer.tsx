"use client";

import { useState } from "react";
import { X, Copy, Download, Printer, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderTimeline } from "./order-timeline";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { Order } from "./orders-table";

interface OrderDetailsDrawerProps {
  order: Order | null;
  onClose: () => void;
  onStatusChange?: (newStatus: string) => void;
}

export function OrderDetailsDrawer({ order, onClose, onStatusChange }: OrderDetailsDrawerProps) {
  const [updating, setUpdating] = useState(false);

  if (!order) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleUpdateStatus = (status: string) => {
    if (onStatusChange) {
      setUpdating(true);
      onStatusChange(status);
      setUpdating(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in-0"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[600px] bg-white shadow-2xl z-50 animate-in slide-in-from-right-0 duration-300">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              <p className="text-sm text-gray-600 mt-0.5">{order.orderNumber}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-200 rounded-lg"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Order Information */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">Order Status</span>
                  <OrderStatusBadge status={order.orderStatus} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">Payment Status</span>
                  <Badge className="bg-emerald-100 text-emerald-700 font-bold uppercase text-xs">
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">Order Date</span>
                  <span className="text-sm text-gray-900 font-bold">{order.orderDate}</span>
                </div>
              </div>

              {/* Status Update Quick Action Controls */}
              {onStatusChange && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Update Order Status</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={order.orderStatus === "processing" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateStatus("processing")}
                      className={`rounded-xl text-xs font-bold ${order.orderStatus === "processing" ? "bg-amber-600 text-white" : ""}`}
                    >
                      Processing
                    </Button>
                    <Button
                      variant={order.orderStatus === "shipped" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateStatus("shipped")}
                      className={`rounded-xl text-xs font-bold ${order.orderStatus === "shipped" ? "bg-blue-600 text-white" : ""}`}
                    >
                      Shipped
                    </Button>
                    <Button
                      variant={order.orderStatus === "delivered" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateStatus("delivered")}
                      className={`rounded-xl text-xs font-bold ${order.orderStatus === "delivered" ? "bg-emerald-600 text-white" : ""}`}
                    >
                      Delivered
                    </Button>
                  </div>
                </div>
              )}

              {/* Customer Information */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Customer Information</h3>
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-base">
                      {order.customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{order.customer.name}</div>
                      <div className="text-xs text-gray-500">{order.customer.email}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Order Items ({order.products.length})</h3>
                <div className="space-y-3">
                  {order.products.map((product, idx) => (
                    <div key={idx} className="flex gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-200">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-xs text-gray-400 font-bold">
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{product.name}</h4>
                        <p className="text-xs font-mono text-gray-500 mt-0.5">SKU: {product.sku || "N/A"}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-bold text-gray-600">Qty: {product.quantity}</span>
                          <span className="text-sm font-extrabold text-gray-900">
                            ${((product.price || 0) * product.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-4 bg-gray-50 rounded-2xl p-4 space-y-2 border border-gray-200">
                  <div className="flex justify-between text-xs font-semibold text-gray-600">
                    <span>Line Items Total</span>
                    <span className="text-gray-900 font-bold">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between">
                    <span className="font-extrabold text-gray-900">Order Total</span>
                    <span className="font-extrabold text-lg text-emerald-600">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Fulfillment Timeline</h3>
                <OrderTimeline status={order.orderStatus} />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Button variant="outline" className="w-full rounded-xl" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
