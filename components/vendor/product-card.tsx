"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductStatusBadge } from "./product-status-badge";
import { InventoryIndicator } from "./inventory-indicator";
import { ProductActionsMenu } from "./product-actions-menu";
import { Star, Eye, ShoppingCart, DollarSign, Package } from "lucide-react";

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
  isFeatured?: boolean;
  isBestSeller?: boolean;
  bestSellerScore?: number;
}

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onAction: (action: string, productId: string) => void;
}

export function ProductCard({ product, isSelected, onSelect, onAction }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image || "");

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
            onChange={() => onSelect(product.id)}
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
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgSrc("")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
            <Package className="w-12 h-12 stroke-[1.5]" />
          </div>
        )}
        {/* Status Badge Overlay */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 flex-wrap">
          <ProductStatusBadge status={product.status} />
          {product.isFeatured && (
            <span className="text-[10px] font-extrabold uppercase bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-xs">
              ★ Featured
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Name & Category */}
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>
          <div className="text-sm text-gray-500 font-medium">
            {product.category}
          </div>
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between">
          <p className="text-xl font-extrabold text-gray-900">
            GH₵{Number(product.price).toFixed(2)}
          </p>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-gray-700">{product.rating || 5.0}</span>
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
