"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BadgeCheck, Eye, Package } from "lucide-react";
import Link from "next/link";

interface OrderCardProps {
  order: {
    orderId: string;
    fullId?: string;
    date: string;
    vendor: {
      name: string;
      verified: boolean;
    };
    products: {
      name: string;
      image: string;
      quantity: number;
    }[];
    total: number;
    status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  };
}

const statusConfig = {
  Processing: { color: "bg-blue-100 text-blue-700", icon: Package },
  Shipped: { color: "bg-orange-100 text-orange-700", icon: Package },
  Delivered: { color: "bg-green-100 text-green-700", icon: Package },
  Cancelled: { color: "bg-red-100 text-red-700", icon: Package },
};

export default function OrderCard({ order }: OrderCardProps) {
  const statusInfo = statusConfig[order.status] || statusConfig.Processing;
  const targetId = order.fullId || order.orderId;

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">
              Order #{order.orderId}
            </h3>
            <Badge className={statusInfo.color}>{order.status}</Badge>
          </div>
          <p className="text-sm text-gray-600">{order.date}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-2xl font-bold text-gray-900">
            GH₵{order.total.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 pb-4 border-b">
        <span className="text-sm text-gray-600">Vendor:</span>
        <span className="font-medium text-gray-900">{order.vendor.name}</span>
        {order.vendor.verified && (
          <BadgeCheck className="h-4 w-4 text-emerald-600" />
        )}
      </div>

      <div className="space-y-3 mb-4">
        {order.products.map((product, index) => {
          const isUrl = product.image && (product.image.startsWith("http") || product.image.startsWith("/"));
          return (
            <div key={index} className="flex items-center gap-3">
              {isUrl ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-gray-100"
                />
              ) : (
                <div
                  className={`w-16 h-16 ${
                    product.image || "bg-gradient-to-br from-emerald-100 to-emerald-200"
                  } rounded-lg flex items-center justify-center font-bold text-emerald-800 flex-shrink-0`}
                >
                  {!product.image && product.name ? product.name[0] : ""}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Link href={`/profile/orders/${targetId}`} className="flex-1">
          <Button variant="outline" className="w-full gap-2">
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </Link>
        {order.status === "Shipped" && (
          <Button className="flex-1">Track Order</Button>
        )}
      </div>
    </Card>
  );
}
