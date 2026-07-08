import { ProductCard } from "./product-card";

// Sample product data
const products = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones with Active Noise Cancellation",
    storeName: "TechStore",
    verified: true,
    rating: 4.8,
    reviews: 256,
    price: 89.99,
    originalPrice: 129.99,
    discount: 31,
    image: "bg-gradient-to-br from-blue-100 to-blue-200",
    inStock: true,
    images: 4,
  },
  {
    id: "2",
    name: "Premium Cotton T-Shirt - Multiple Colors Available",
    storeName: "Fashion Hub",
    verified: true,
    rating: 4.6,
    reviews: 189,
    price: 24.99,
    originalPrice: 39.99,
    discount: 38,
    image: "bg-gradient-to-br from-pink-100 to-pink-200",
    inStock: true,
    images: 6,
  },
  {
    id: "3",
    name: "Smart Watch with Fitness Tracker and Heart Rate Monitor",
    storeName: "Gadget World",
    verified: true,
    rating: 4.9,
    reviews: 412,
    price: 149.99,
    image: "bg-gradient-to-br from-purple-100 to-purple-200",
    inStock: true,
    images: 5,
  },
  {
    id: "4",
    name: "Organic Face Cream with Vitamin C and Hyaluronic Acid",
    storeName: "Beauty Plus",
    verified: true,
    rating: 4.7,
    reviews: 324,
    price: 34.99,
    originalPrice: 49.99,
    discount: 30,
    image: "bg-gradient-to-br from-green-100 to-green-200",
    inStock: false,
    images: 3,
  },
  {
    id: "5",
    name: "Yoga Mat - Non-Slip Exercise Mat with Carrying Strap",
    storeName: "Fitness Pro",
    verified: false,
    rating: 4.5,
    reviews: 156,
    price: 29.99,
    image: "bg-gradient-to-br from-orange-100 to-orange-200",
    inStock: true,
    images: 4,
  },
  {
    id: "6",
    name: "Stainless Steel Water Bottle - Insulated 32oz",
    storeName: "Eco Store",
    verified: true,
    rating: 4.8,
    reviews: 289,
    price: 19.99,
    originalPrice: 29.99,
    discount: 33,
    image: "bg-gradient-to-br from-teal-100 to-teal-200",
    inStock: true,
    images: 5,
  },
  {
    id: "7",
    name: "LED Desk Lamp with USB Charging Port and Touch Control",
    storeName: "Home Essentials",
    verified: true,
    rating: 4.6,
    reviews: 178,
    price: 39.99,
    image: "bg-gradient-to-br from-yellow-100 to-yellow-200",
    inStock: true,
    images: 6,
  },
  {
    id: "8",
    name: "Professional Chef Knife Set - 8 Piece Kitchen Knife Set",
    storeName: "Kitchen Pro",
    verified: true,
    rating: 4.9,
    reviews: 445,
    price: 79.99,
    originalPrice: 119.99,
    discount: 33,
    image: "bg-gradient-to-br from-red-100 to-red-200",
    inStock: true,
    images: 8,
  },
];

interface ProductGridProps {
  showCount?: boolean;
}

export function ProductGrid({ showCount = true }: ProductGridProps) {
  return (
    <div className="space-y-6">
      {showCount && (
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{products.length}</span> of{" "}
          <span className="font-semibold text-gray-900">10,542</span> products
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
