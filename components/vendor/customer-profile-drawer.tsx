"use client";

import { X, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, MessageCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerStatusBadge } from "./customer-status-badge";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { Customer } from "./customers-table";
import { useState } from "react";

interface CustomerProfileDrawerProps {
  customer: Customer | null;
  onClose: () => void;
}

export function CustomerProfileDrawer({ customer, onClose }: CustomerProfileDrawerProps) {
  const [notes, setNotes] = useState("");

  if (!customer) return null;

  const recentOrders = (customer as any).recentOrders || [];
  const favoriteProducts = (customer as any).favoriteProducts || [];
  const reviews = (customer as any).reviews || [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in-0"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[700px] bg-white shadow-2xl z-50 animate-in slide-in-from-right-0 duration-300">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xl">
                {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
                <p className="text-sm text-gray-600">Customer since {customer.registrationDate}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-emerald-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-emerald-700 mb-1">
                    <ShoppingBag className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase">Total Orders</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{customer.totalOrders}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-purple-700 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase">Total Spend</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">GH₵{customer.lifetimeSpend.toFixed(2)}</div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{customer.city}, {customer.country}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Last Purchase: {customer.lastPurchase}</span>
                  </div>
                </div>
              </div>

              {/* Purchase Summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Purchase Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Average Order Value</span>
                    <span className="font-semibold text-gray-900">GH₵{customer.averageOrderValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Customer Status</span>
                    <CustomerStatusBadge status={customer.status} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Favorite Category</span>
                    <span className="font-medium text-gray-900">Electronics</span>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Orders</h3>
                {recentOrders.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No recent order history.</p>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order: any) => (
                      <div key={order.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{order.id}</div>
                            <div className="text-xs text-gray-500">{order.date}</div>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700">
                            {order.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-700 mb-2">
                          {(order.products || []).join(", ")}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          ${order.total ? Number(order.total).toFixed(2) : "0.00"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Favorite Products */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Favorite Products</h3>
                {favoriteProducts.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No purchase history yet.</p>
                ) : (
                  <div className="space-y-3">
                    {favoriteProducts.map((product: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                          {product.image && (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                          <div className="text-xs text-gray-500">
                            Purchased {product.purchaseCount} times
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Customer Notes */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Private Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add private notes about this customer..."
                  className="w-full h-24 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  These notes are private and only visible to you.
                </p>
              </div>

              {/* Customer Reviews */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer Reviews</h3>
                {reviews.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No reviews submitted yet.</p>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((review: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < review.rating ? "text-yellow-400" : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{review.review}</p>
                      <p className="text-xs text-gray-500">Product: {review.product}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                View Orders
              </Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                Save Notes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
