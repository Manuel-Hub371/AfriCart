import { ProductCard } from "@/components/products/product-card";

const newProducts = [
  {
    id: "na1",
    name: "Mechanical Gaming Keyboard - RGB Backlit",
    storeName: "Gaming Gear",
    rating: 4.8,
    reviews: 89,
    price: 129.99,
    originalPrice: 159.99,
    discount: 19,
    image: "bg-gradient-to-br from-cyan-100 to-cyan-200",
  },
  {
    id: "na2",
    name: "Portable Bluetooth Speaker - Waterproof IPX7",
    storeName: "Audio Hub",
    rating: 4.6,
    reviews: 45,
    price: 69.99,
    image: "bg-gradient-to-br from-emerald-100 to-emerald-200",
  },
  {
    id: "na3",
    name: "Premium Leather Wallet with RFID Protection",
    storeName: "Luxury Items",
    rating: 4.7,
    reviews: 67,
    price: 49.99,
    originalPrice: 79.99,
    discount: 38,
    image: "bg-gradient-to-br from-brown-100 to-brown-200",
  },
  {
    id: "na4",
    name: "USB-C Hub Multiport Adapter - 7 in 1",
    storeName: "Tech Accessories",
    rating: 4.5,
    reviews: 34,
    price: 39.99,
    image: "bg-gradient-to-br from-zinc-100 to-zinc-200",
  },
  {
    id: "na5",
    name: "Wireless Charging Pad - Fast Charge 15W",
    storeName: "Charge Zone",
    rating: 4.8,
    reviews: 112,
    price: 29.99,
    originalPrice: 44.99,
    discount: 33,
    image: "bg-gradient-to-br from-violet-100 to-violet-200",
  },
  {
    id: "na6",
    name: "Smart Home Security Camera - 1080p HD",
    storeName: "Smart Home Pro",
    rating: 4.9,
    reviews: 156,
    price: 89.99,
    image: "bg-gradient-to-br from-sky-100 to-sky-200",
  },
  {
    id: "na7",
    name: "Fitness Resistance Bands Set - 5 Levels",
    storeName: "Fitness World",
    rating: 4.6,
    reviews: 78,
    price: 24.99,
    image: "bg-gradient-to-br from-lime-100 to-lime-200",
  },
  {
    id: "na8",
    name: "Travel Backpack - Anti-Theft with USB Port",
    storeName: "Travel Gear",
    rating: 4.7,
    reviews: 203,
    price: 59.99,
    originalPrice: 89.99,
    discount: 33,
    image: "bg-gradient-to-br from-rose-100 to-rose-200",
  },
];

export function NewArrivals() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            New Arrivals
          </h2>
          <p className="text-lg text-gray-600">
            Check out the latest products added to our marketplace
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
