"use client";

import { ProductCard } from "@/components/products/product-card";

const relatedProducts = [
  {
    id: "1",
    name: "Wireless Earbuds Pro",
    storeName: "Audio Tech",
    verified: true,
    rating: 4.7,
    reviews: 189,
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    image: "bg-gradient-to-br from-blue-100 to-blue-200",
    inStock: true,
    images: 4,
  },
  {
    id: "2",
    name: "Smart Watch Series 5",
    storeName: "Gadget Pro",
    verified: true,
    rating: 4.9,
    reviews: 412,
    price: 149.99,
    image: "bg-gradient-to-br from-purple-100 to-purple-200",
    inStock: true,
    images: 5,
  },
  {
    id: "3",
    name: "Portable Bluetooth Speaker",
    storeName: "Sound World",
    verified: false,
    rating: 4.6,
    reviews: 234,
    price: 49.99,
    originalPrice: 69.99,
    discount: 29,
    image: "bg-gradient-to-br from-green-100 to-green-200",
    inStock: true,
    images: 3,
  },
  {
    id: "4",
    name: "USB-C Fast Charger",
    storeName: "Charge Master",
    verified: true,
    rating: 4.8,
    reviews: 567,
    price: 29.99,
    image: "bg-gradient-to-br from-orange-100 to-orange-200",
    inStock: true,
    images: 2,
  },
];

export function RelatedProducts() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
