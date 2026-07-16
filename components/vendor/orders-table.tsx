"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { OrderStatusBadge, OrderStatus } from "./order-status-badge";
import { Badge } from "@/components/ui/badge";
import { Eye, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  products: Array<{
    name: string;
    image: string;
    quantity: number;
  }>;
  totalAmount: number;
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  orderStatus: OrderStatus;
  shippingStatus: "not-shipped" | "in-transit" | "delivered";
  orderDate: string;
  expectedDelivery: string;
}

interface OrdersTableProps {
  orders: Order[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: string) => void;
  onViewOrder: (order: Order) => void;
  onSort: (column: string) => void;
}

const paymentStatusConfig = {
  paid: { label: "Paid", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  failed: { label: "Failed", className: "bg-red-100 text-red-700 border-red-200" },
  refunded: { label: "Refunded", className: "bg-gray-100 text-gray-700 border-gray-200" },
};

const shippingStatusConfig = {
  "not-shipped": { label: "Not Shipped", className: "bg-gray-100 text-gray-700" },
  "in-transit": { label: "In Transit", className: "bg-blue-100 text-blue-700" },
  "delivered": { label: "Delivered", className: "bg-emerald-100 text-emerald-700" },
};

export function OrdersTable({
  orders,
  selectedIds,
  onSelectAll,
  onSelect,
  onViewOrder,
  onSort,
}: OrdersTableProps) {
  const allSelected = orders.length > 0 && selectedIds.length === orders.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b-2 border-gray-200">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                aria-label="Select all orders"
              />
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              <button
                onClick={() => onSort("orderNumber")}
                className="flex items-center gap-1 hover:text-emerald-600"
              >
                Order #
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
            </TableHead>
            <TableHead className="font-semibold text-gray-900">Customer</TableHead>
            <TableHead className="font-semibold text-gray-900">Products</TableHead>
            <TableHead className="font-semibold text-gray-900">Quantity</TableHead>
            <TableHead className="font-semibold text-gray-900">
              <button
                onClick={() => onSort("amount")}
                className="flex items-center gap-1 hover:text-emerald-600"
              >
                Amount
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
            </TableHead>
            <TableHead className="font-semibold text-gray-900">Payment</TableHead>
            <TableHead className="font-semibold text-gray-900">Order Status</TableHead>
            <TableHead className="font-semibold text-gray-900">Shipping</TableHead>
            <TableHead className="font-semibold text-gray-900">
              <button
                onClick={() => onSort("date")}
                className="flex items-center gap-1 hover:text-emerald-600"
              >
                Order Date
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
            </TableHead>
            <TableHead className="font-semibold text-gray-900">Expected Delivery</TableHead>
            <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const isSelected = selectedIds.includes(order.id);
            const totalQuantity = order.products.reduce((sum, p) => sum + p.quantity, 0);

            return (
              <TableRow
                key={order.id}
                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                  isSelected ? "bg-emerald-50/50" : ""
                }`}
              >
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onSelect(order.id)}
                    aria-label={`Select order ${order.orderNumber}`}
                  />
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {order.orderNumber}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm">
                      {order.customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{order.customer.name}</div>
                      <div className="text-xs text-gray-500">{order.customer.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex -space-x-2">
                    {order.products.slice(0, 3).map((product, idx) => (
                      <div
                        key={idx}
                        className="relative w-8 h-8 rounded-md overflow-hidden border-2 border-white ring-1 ring-gray-200"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {order.products.length > 3 && (
                      <div className="w-8 h-8 rounded-md bg-gray-100 border-2 border-white ring-1 ring-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                        +{order.products.length - 3}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-gray-700">{totalQuantity} items</span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`font-medium border ${paymentStatusConfig[order.paymentStatus].className}`}
                  >
                    {paymentStatusConfig[order.paymentStatus].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.orderStatus} />
                </TableCell>
                <TableCell>
                  <Badge className={shippingStatusConfig[order.shippingStatus].className}>
                    {shippingStatusConfig[order.shippingStatus].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-700">{order.orderDate}</TableCell>
                <TableCell className="text-gray-700">{order.expectedDelivery}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewOrder(order)}
                    className="h-8 w-8 p-0 hover:bg-emerald-50 hover:text-emerald-600"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
