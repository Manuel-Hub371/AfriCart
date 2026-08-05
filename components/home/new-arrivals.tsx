"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/product-card";

export function NewArrivals() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNewArrivals() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/products?limit=8");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Failed to load new arrivals:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadNewArrivals();
  }, []);

  return (
    <section className="py-16 bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            New <span className="text-gradient">Arrivals</span>
          </h2>
          <p className="text-gray-600 text-base">
            Check out the latest products added to our marketplace
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border p-4 space-y-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
                brand={product.brand}
                storeName={product.store?.name || "AfriCart Vendor"}
                verified={true}
                rating={product.rating || 5}
                reviews={product.numReviews || 0}
                price={product.price}
                originalPrice={product.compareAtPrice || undefined}
                discount={product.compareAtPrice && product.compareAtPrice > product.price ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : undefined}
                image={product.images}
                inStock={product.stock > 0}
                imagesCount={Array.isArray(product.images) ? product.images.length : 1}
                campaigns={product.campaigns}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No products available yet.
          </div>
        )}
      </div>
    </section>
  );
}
