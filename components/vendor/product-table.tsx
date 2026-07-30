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
import { ProductStatusBadge } from "./product-status-badge";
import { InventoryIndicator } from "./inventory-indicator";
import { ProductActionsMenu } from "./product-actions-menu";
import { Star, ArrowUpDown, Eye, ShoppingCart, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "./product-card";

interface ProductTableProps {
  products: Product[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: string) => void;
  onAction: (action: string, productId: string) => void;
  onSort: (column: string) => void;
}

export function ProductTable({
  products,
  selectedIds,
  onSelectAll,
  onSelect,
  onAction,
  onSort,
}: ProductTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    onSort(column);
  };

  const allSelected = products.length > 0 && selectedIds.length === products.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < products.length;

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 border-b-2 border-gray-200">
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="border-gray-300"
                  aria-label="Select all products"
                />
              </TableHead>
              <TableHead className="w-20">Image</TableHead>
              <TableHead className="min-w-[250px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("name")}
                  className="h-8 -ml-3 font-semibold text-gray-700"
                >
                  Product Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("price")}
                  className="h-8 -ml-3 font-semibold text-gray-700"
                >
                  Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("stock")}
                  className="h-8 -ml-3 font-semibold text-gray-700"
                >
                  Stock
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Best Seller</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("sales")}
                  className="h-8 -ml-3 font-semibold text-gray-700"
                >
                  Sales
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                className={`hover:bg-gray-50 transition-colors border-b ${
                  selectedIds.includes(product.id) ? "bg-emerald-50 hover:bg-emerald-50" : ""
                }`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onChange={() => onSelect(product.id)}
                    className="border-gray-300"
                    aria-label={`Select ${product.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div 
                    className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => onAction("view", product.id)}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div 
                    className="font-bold text-gray-900 cursor-pointer hover:text-emerald-600 transition-colors"
                    onClick={() => onAction("view", product.id)}
                  >
                    {product.name}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600 font-mono">{product.sku}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{product.category}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{product.brand || "—"}</span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <InventoryIndicator stock={product.stock} />
                </TableCell>
                <TableCell>
                  <ProductStatusBadge status={product.status} />
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => onAction("toggle-featured", product.id)}
                    className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full transition-all border ${
                      product.isFeatured
                        ? "bg-amber-500 text-white border-amber-500 hover:bg-amber-600"
                        : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200 hover:text-gray-700"
                    }`}
                  >
                    <span>★ {product.isFeatured ? "Featured" : "Regular"}</span>
                  </button>
                </TableCell>
                <TableCell>
                  {product.isBestSeller ? (
                    <span
                      title={`Best Seller Score: ${product.bestSellerScore || 0}`}
                      className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs cursor-default"
                    >
                      🔥 Best Seller
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium px-2">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {product.rating}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-gray-900">{product.sales}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Eye className="h-3 w-3" />
                      <span>{product.views}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <DollarSign className="h-3 w-3" />
                      <span>${(product.revenue / 1000).toFixed(1)}k</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">{product.lastUpdated}</span>
                </TableCell>
                <TableCell>
                  <ProductActionsMenu productId={product.id} onAction={onAction} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
