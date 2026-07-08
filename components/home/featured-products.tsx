"use client";

import { ProductCard } from "@/components/products/product-card";

const products = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones with Noise Cancellation",
    storeName: "TechStore",
    rating: 4.8,
    reviews: 256,
    price: 89.99,
    originalPrice: 129.99,
    discount: 31,
    image: "bg-gradient-to-br from-blue-100 to-blue-200",
  },
  {
    id: "2",
    name: "Premium Cotton T-Shirt - Multiple Colors Available",
    storeName: "Fashion Hub",
    rating: 4.6,
    reviews: 189,
    price: 24.99,
    originalPrice: 39.99,
    discount: 38,
    image: "bg-gradient-to-br from-pink-100 to-pink-200",
  },
  {
    id: "3",
    name: "Smart Watch with Fitness Tracker and Heart Rate Monitor",
    storeName: "Gadget World",
    rating: 4.9,
    reviews: 412,
    price: 149.99,
    image: "bg-gradient-to-br from-purple-100 to-purple-200",
  },
  {
    id: "4",
    name: "Organic Face Cream with Vitamin C and Hyaluronic Acid",
    storeName: "Beauty Plus",
    rating: 4.7,
    reviews: 324,
    price: 34.99,
    originalPrice: 49.99,
    discount: 30,
    image: "bg-gradient-to-br from-green-100 to-green-200",
  },
  {
    id: "5",
    name: "Yoga Mat - Non-Slip Exercise Mat with Carrying Strap",
    storeName: "Fitness Pro",
    rating: 4.5,
    reviews: 156,
    price: 29.99,
    image: "bg-gradient-to-br from-orange-100 to-orange-200",
  },
  {
    id: "6",
    name: "Stainless Steel Water Bottle - Insulated 32oz",
    storeName: "Eco Store",
    rating: 4.8,
    reviews: 289,
    price: 19.99,
    originalPrice: 29.99,
    discount: 33,
    image: "bg-gradient-to-br from-teal-100 to-teal-200",
  },
  {
    id: "7",
    name: "LED Desk Lamp with USB Charging Port and Touch Control",
    storeName: "Home Essentials",
    rating: 4.6,
    reviews: 178,
    price: 39.99,
    image: "bg-gradient-to-br from-yellow-100 to-yellow-200",
  },
  {
    id: "8",
    name: "Professional Chef Knife Set - 8 Piece Kitchen Knife Set",
    storeName: "Kitchen Pro",
    rating: 4.9,
    reviews: 445,
    price: 79.99,
    originalPrice: 119.99,
    discount: 33,
    image: "bg-gradient-to-br from-red-100 to-red-200",
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600">
            Discover our handpicked selection of amazing products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
