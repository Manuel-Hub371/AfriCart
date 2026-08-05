"use client";

import { ProductCard } from "./product-card";

interface ProductGridProps {
  products?: any[];
  totalProducts?: number;
  showCount?: boolean;
}

export function ProductGrid({ products = [], totalProducts = 0, showCount = true }: ProductGridProps) {
  return (
    <div className="space-y-6">
      {showCount && (
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{products.length}</span> of{" "}
          <span className="font-semibold text-gray-900">{totalProducts || products.length}</span> products
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            brand={product.brand}
            storeName={product.store?.name || "AfriCart Store"}
            verified={true}
            rating={product.rating || 5.0}
            reviews={product.numReviews || 0}
            // Effective (campaign-adjusted) price from API
            price={product.price}
            // Original base price for strikethrough
            originalPrice={product.originalPrice ?? product.compareAtPrice ?? undefined}
            // Campaign pricing fields — all from backend, never recomputed on frontend
            isDiscounted={product.isDiscounted ?? false}
            discountPercent={product.discountPercent ?? 0}
            amountSaved={product.amountSaved ?? 0}
            campaignBadge={product.campaignBadge}
            campaignColor={product.campaignColor}
            campaignName={product.campaignName}
            image={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"}
            inStock={product.stock > 0}
            imagesCount={Array.isArray(product.images) ? product.images.length : 1}
            isBestSeller={product.isBestSeller ?? false}
          />
        ))}
      </div>
    </div>
  );
}
