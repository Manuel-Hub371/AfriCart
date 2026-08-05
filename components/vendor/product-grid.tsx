"use client";

import { ProductCard, type Product } from "./product-card";

interface ProductGridProps {
  products: Product[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onAction: (action: string, productId: string) => void;
}

export function ProductGrid({
  products,
  selectedIds,
  onSelect,
  onAction,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={selectedIds.includes(product.id)}
          onSelect={onSelect}
          onAction={onAction}
        />
      ))}
    </div>
  );
}
