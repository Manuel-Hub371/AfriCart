"use client";

import { Mail, Phone, MapPin, Calendar, ShoppingBag, Package } from "lucide-react";
import Image from "next/image";

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  memberSince: string;
  totalOrders: number;
  totalSpent: string;
  lastPurchase: string;
}

interface Order {
  id: string;
  status: string;
  amount: string;
  date: string;
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: string;
  stock: string;
}

interface CustomerPanelProps {
  customer: CustomerInfo;
  orders: Order[];
  products: Product[];
}

export function CustomerPanel({ customer, orders, products }: CustomerPanelProps) {
  return (
    <div className="w-80 border-l border-gray-200 bg-white flex flex-col h-full">
      {/* Customer Profile - Fixed */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-semibold mb-3 shadow-lg">
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {customer.name}
          </h3>
          <p className="text-sm text-emerald-600 font-medium">Customer</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-gray-700 truncate">{customer.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-gray-700">{customer.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-gray-700">{customer.location}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-gray-700">Since {customer.memberSince}</span>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Purchase Statistics */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-emerald-600" />
            Purchase History
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
              <p className="text-2xl font-bold text-emerald-600">{customer.totalOrders}</p>
              <p className="text-xs text-gray-700 mt-1 font-medium">Orders</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <p className="text-2xl font-bold text-blue-600">{customer.totalSpent}</p>
              <p className="text-xs text-gray-700 mt-1 font-medium">Spent</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              Last purchase: <span className="font-semibold text-gray-900">{customer.lastPurchase}</span>
            </p>
          </div>
        </div>

        {/* Related Orders */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-blue-600" />
            Related Orders
          </h4>
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 hover:shadow-sm transition-all cursor-pointer border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">{order.id}</span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{order.date}</span>
                  <span className="font-bold text-emerald-600">{order.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        <div className="p-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="h-4 w-4 text-purple-600" />
            Related Products
          </h4>
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 hover:shadow-sm transition-all cursor-pointer border border-gray-100"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex-shrink-0 overflow-hidden shadow-sm">
                  <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-emerald-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate mb-1.5">
                    {product.name}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-600">{product.price}</span>
                    <span className={`px-2 py-0.5 rounded-full font-medium ${
                      product.stock === "In Stock"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}>
                      {product.stock}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
