"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ProductStatusBadge } from "./product-status-badge";
import { InventoryIndicator } from "./inventory-indicator";
import { ProductActionsMenu } from "./product-actions-menu";
import { Star, Eye, ShoppingCart, DollarSign } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand?: string;
  price: number;
  stock: number;
  status: "published" | "draft" | "scheduled" | "archived" | "out-of-stock" | "low-stock";
  rating: number;
  sales: number;
  views: number;
  revenue: number;
  image: string;
  lastUpdated: string;
}

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onAction: (action: string, productId: string) => void;
}

export function ProductCard({ product, isSelected, onSelect, onAction }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 border ${
        isSelected ? "border-emerald-500 shadow-xl ring-2 ring-emerald-200" : "border-gray-200 hover:shadow-lg hover:border-gray-300"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <div
          className={`transition-opacity ${
            isSelected || isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Checkbox
            checked={isSelected}
            onChange={(e) => onSelect(product.id)}
            className="bg-white border-2 border-gray-300 shadow-sm"
          />
        </div>
      </div>

      {/* Actions Menu */}
      <div className="absolute top-3 right-3 z-10">
        <div
          className={`transition-opacity ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="bg-white rounded-lg shadow-md">
            <ProductActionsMenu productId={product.id} onAction={onAction} />
          </div>
        </div>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
        {/* Status Badge Overlay */}
        <div className="absolute bottom-3 left-3">
          <ProductStatusBadge status={product.status} />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Name & Category */}
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{product.sku}</span>
            <span>•</span>
            <span>{product.category}</span>
          </div>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>
          </div>
          <InventoryIndicator stock={product.stock} />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(product.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <Eye className="h-3 w-3" />
            </div>
            <p className="text-xs font-semibold text-gray-900">{product.views}</p>
            <p className="text-xs text-gray-500">Views</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <ShoppingCart className="h-3 w-3" />
            </div>
            <p className="text-xs font-semibold text-gray-900">{product.sales}</p>
            <p className="text-xs text-gray-500">Sales</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <DollarSign className="h-3 w-3" />
            </div>
            <p className="text-xs font-semibold text-gray-900">
              ${(product.revenue / 1000).toFixed(1)}k
            </p>
            <p className="text-xs text-gray-500">Revenue</p>
          </div>
        </div>

        {/* Last Updated */}
        <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
          Updated {product.lastUpdated}
        </p>
      </div>
    </Card>
  );
}
