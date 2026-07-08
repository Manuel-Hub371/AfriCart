"use client";

import { ProductCard } from "@/components/products/product-card";

const bestSellers = [
  {
    id: "bs1",
    name: "Apple AirPods Pro with MagSafe Charging Case",
    storeName: "Apple Store",
    rating: 4.9,
    reviews: 1523,
    price: 249.99,
    image: "bg-gradient-to-br from-gray-100 to-gray-200",
  },
  {
    id: "bs2",
    name: "Samsung Galaxy Buds Pro - Wireless Earbuds",
    storeName: "Samsung Official",
    rating: 4.7,
    reviews: 987,
    price: 199.99,
    originalPrice: 229.99,
    discount: 13,
    image: "bg-gradient-to-br from-indigo-100 to-indigo-200",
  },
  {
    id: "bs3",
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    storeName: "Sony Store",
    rating: 4.9,
    reviews: 2341,
    price: 399.99,
    image: "bg-gradient-to-br from-slate-100 to-slate-200",
  },
  {
    id: "bs4",
    name: "Kindle Paperwhite - 8GB Waterproof E-reader",
    storeName: "Amazon Devices",
    rating: 4.8,
    reviews: 3456,
    price: 139.99,
    originalPrice: 159.99,
    discount: 13,
    image: "bg-gradient-to-br from-amber-100 to-amber-200",
  },
];

export function BestSellers() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Best Sellers
          </h2>
          <p className="text-lg text-gray-600">
            The most loved products by our customers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
