"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BadgeCheck, Eye, Package } from "lucide-react";
import Link from "next/link";
import { extractCoverImage, getCategoryFallbackImage } from "@/lib/image-utils";

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
    <Card className="p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-2xs space-y-2.5">
      <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <h3 className="font-extrabold text-gray-900 text-xs sm:text-sm">
              Order #{order.orderId}
            </h3>
            <Badge className={`${statusInfo.color} text-[9px] sm:text-xs px-2 py-0.2 font-extrabold rounded-full`}>
              {order.status}
            </Badge>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium">{order.date}</p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-gray-400 font-semibold uppercase block">Total</span>
          <span className="text-xs sm:text-lg font-black text-emerald-700">
            GH₵{order.total.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500">
        <span className="font-semibold">Vendor:</span>
        <span className="font-bold text-gray-800">{order.vendor.name}</span>
        {order.vendor.verified && (
          <BadgeCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
        )}
      </div>

      <div className="space-y-2 pt-0.5">
        {order.products.map((product, index) => {
          const coverImage = extractCoverImage((product as any).images || product.image, product.name);
          const imgSrc = coverImage || getCategoryFallbackImage(product.name);

          return (
            <div key={index} className="flex items-center gap-2.5 bg-gray-50/60 p-1.5 rounded-lg border border-gray-100">
              <img
                src={imgSrc}
                alt={product.name}
                className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md flex-shrink-0 border border-gray-200"
                onError={(e) => {
                  const target = e.currentTarget;
                  const fallback = getCategoryFallbackImage(product.name);
                  if (target.src !== fallback) {
                    target.src = fallback;
                  }
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-gray-900 truncate">
                  {product.name}
                </p>
                <p className="text-[10px] text-gray-500 font-medium">Qty: {product.quantity}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-1">
        <Link href={`/profile/orders/${targetId}`} className="block">
          <Button variant="outline" size="sm" className="w-full gap-1.5 font-bold text-xs h-8 sm:h-9 rounded-xl border-gray-200 hover:bg-gray-50">
            <Eye className="h-3.5 w-3.5 text-emerald-600" />
            <span>View Order Details</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}
