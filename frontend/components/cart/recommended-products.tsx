"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/product-card";

export function RecommendedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRecommended() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/products?limit=4");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Failed to load recommended products:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRecommended();
  }, []);

  return (
    <div className="space-y-6 pt-8 border-t">
      <h2 className="text-2xl font-extrabold text-gray-900">
        You May Also Like
      </h2>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border p-4 space-y-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              storeName={product.store?.name || "AfriCart Store"}
              verified={true}
              rating={product.rating || 5}
              reviews={product.numReviews || 0}
              price={product.price}
              originalPrice={product.originalPrice ?? product.compareAtPrice ?? undefined}
              isDiscounted={product.isDiscounted ?? false}
              discountPercent={product.discountPercent ?? 0}
              amountSaved={product.amountSaved ?? 0}
              campaignBadge={product.campaignBadge}
              campaignColor={product.campaignColor}
              campaignName={product.campaignName}
              image={product.images}
              inStock={product.stock > 0}
              imagesCount={Array.isArray(product.images) ? product.images.length : 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
