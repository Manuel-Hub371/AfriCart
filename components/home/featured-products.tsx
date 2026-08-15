"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/product-card";

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/products?limit=8");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFeaturedProducts();
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
              ⭐ Trending Now
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Featured <span className="text-gradient">Products</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of amazing products from verified sellers
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl border p-2 space-y-2 animate-pulse">
                <div className="h-28 sm:h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand}
                storeName={product.store?.name || "Store"}
                verified={true}
                rating={product.rating}
                reviews={product.numReviews}
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
