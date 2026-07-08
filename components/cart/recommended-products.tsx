"use client";

import { ProductCard } from "@/components/products/product-card";

const recommendedProducts = [
  {
    id: "r1",
    name: "Wireless Mouse",
    storeName: "Tech Accessories",
    verified: true,
    rating: 4.7,
    reviews: 234,
    price: 24.99,
    originalPrice: 34.99,
    discount: 29,
    image: "bg-gradient-to-br from-gray-100 to-gray-200",
    inStock: true,
    images: 3,
  },
  {
    id: "r2",
    name: "USB-C Cable 2m",
    storeName: "Cable World",
    verified: false,
    rating: 4.5,
    reviews: 189,
    price: 12.99,
    image: "bg-gradient-to-br from-blue-100 to-blue-200",
    inStock: true,
    images: 2,
  },
  {
    id: "r3",
    name: "Phone Stand Holder",
    storeName: "Mobile Gear",
    verified: true,
    rating: 4.8,
    reviews: 456,
    price: 19.99,
    originalPrice: 29.99,
    discount: 33,
    image: "bg-gradient-to-br from-green-100 to-green-200",
    inStock: true,
    images: 4,
  },
  {
    id: "r4",
    name: "Screen Protector",
    storeName: "Protect Plus",
    verified: true,
    rating: 4.6,
    reviews: 678,
    price: 9.99,
    image: "bg-gradient-to-br from-purple-100 to-purple-200",
    inStock: true,
    images: 2,
  },
];

export function RecommendedProducts() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Customers Also Bought
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
