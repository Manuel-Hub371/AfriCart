"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/product-card";

interface RelatedProductsProps {
  currentProductId?: string;
  category?: string;
  storeId?: string;
  storeName?: string;
}

export function RelatedProducts({ currentProductId, category, storeId, storeName }: RelatedProductsProps) {
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [storeProducts, setStoreProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setIsLoading(true);
        const [catRes, storeRes] = await Promise.all([
          fetch(`/api/products?category=${encodeURIComponent(category || "")}&limit=8`),
          storeId ? fetch(`/api/products?storeId=${encodeURIComponent(storeId)}&limit=8`) : Promise.resolve(null),
        ]);

        if (catRes.ok) {
          const data = await catRes.json();
          const filtered = (data.products || []).filter((p: any) => p.id !== currentProductId).slice(0, 4);
          setCategoryProducts(filtered);
        }

        if (storeRes && storeRes.ok) {
          const data = await storeRes.json();
          const filtered = (data.products || []).filter((p: any) => p.id !== currentProductId).slice(0, 4);
          setStoreProducts(filtered);
        }
      } catch (err) {
        console.error("Failed to load recommendations:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRecommendations();
  }, [currentProductId, category, storeId]);

  if (!isLoading && categoryProducts.length === 0 && storeProducts.length === 0) return null;

  return (
    <div className="space-y-6 sm:space-y-12 pt-6 sm:pt-12 border-t border-gray-200">
      {/* Similar Products Section */}
      {categoryProducts.length > 0 && (
        <div className="space-y-3 sm:space-y-6">
          <div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Customers Also Bought
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5">
              Top rated products in {category || "the same category"}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl border p-2.5 space-y-2 animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-lg" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  brand={product.brand}
                  storeName={product.store?.name || "AfriCart Store"}
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
          )}
        </div>
      )}

      {/* More Products from Same Merchant */}
      {storeProducts.length > 0 && (
        <div className="space-y-3 sm:space-y-6">
          <div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              More from {storeName || "this merchant"}
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5">
              Explore other items sold by {storeName || "this store"}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {storeProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand}
                storeName={product.store?.name || storeName || "AfriCart Store"}
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
        </div>
      )}
    </div>
  );
}
