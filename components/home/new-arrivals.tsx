"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/product-card";

export function NewArrivals({ initialProducts }: { initialProducts?: any[] }) {
  const [products, setProducts] = useState<any[]>(initialProducts || []);
  const [isLoading, setIsLoading] = useState(!initialProducts || initialProducts.length === 0);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) return;
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
  }, [initialProducts]);

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-10 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
            New <span className="text-gradient">Arrivals</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Check out the latest products added to our marketplace
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border p-2 space-y-2 animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
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
                originalPrice={product.originalPrice}
                isDiscounted={product.isDiscounted}
                discountPercent={product.discountPercent}
                amountSaved={product.amountSaved}
                campaignBadge={product.campaignBadge}
                campaignColor={product.campaignColor}
                campaignName={product.campaignName}
                image={product.images}
                inStock={product.stock > 0}
                imagesCount={Array.isArray(product.images) ? product.images.length : 1}
                isBestSeller={product.isBestSeller}
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
