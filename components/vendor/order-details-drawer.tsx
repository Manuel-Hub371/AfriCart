"use client";

import { X, Copy, Download, Printer, MessageCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, OrderStatus } from "./order-status-badge";
import { OrderTimeline } from "./order-timeline";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { Order } from "./orders-table";

interface OrderDetailsDrawerProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailsDrawer({ order, onClose }: OrderDetailsDrawerProps) {
  if (!order) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
              className="h-8 w-8 p-0 hover:bg-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Order Information */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Order Status</span>
                  <OrderStatusBadge status={order.orderStatus} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Payment Status</span>
                  <Badge className="bg-emerald-100 text-emerald-700">Paid</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Payment Method</span>
                  <span className="text-sm text-gray-900">Credit Card</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Order Date</span>
                  <span className="text-sm text-gray-900">{order.orderDate}</span>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
                      {order.customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{order.customer.name}</div>
                      <div className="text-sm text-gray-600">{order.customer.email}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Customer
                  </Button>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Shipping Address</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900 leading-relaxed">
                    John Doe<br />
                    123 Main Street, Apt 4B<br />
                    New York, NY 10001<br />
                    United States<br />
                    +1 (555) 123-4567
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-0 h-auto"
                    onClick={() => copyToClipboard("123 Main Street, Apt 4B, New York, NY 10001")}
                  >
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    Copy Address
                  </Button>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {order.products.map((product, idx) => (
                    <div key={idx} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{product.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">SKU: PRD-{idx + 1}001</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600">Qty: {product.quantity}</span>
                          <span className="text-sm font-semibold text-gray-900">
                            ${(89.99 * product.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-4 bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${(order.totalAmount * 0.9).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">${(order.totalAmount * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">${(order.totalAmount * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-gray-900">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Shipping Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping Method</span>
                    <span className="text-gray-900 font-medium">Standard Shipping</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Courier</span>
                    <span className="text-gray-900 font-medium">FedEx</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tracking Number</span>
                    <button
                      onClick={() => copyToClipboard("1Z999AA10123456784")}
                      className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                    >
                      1Z999AA10123456784
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Expected Delivery</span>
                    <span className="text-gray-900 font-medium">{order.expectedDelivery}</span>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Printer className="h-4 w-4 mr-2" />
                      Print Label
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Timeline</h3>
                <OrderTimeline status={order.orderStatus} />
              </div>

              {/* Invoice */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Invoice</h3>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Close
              </Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                Update Status
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
