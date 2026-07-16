import { StoreCard } from "./store-card";

// Sample store data
const stores = [
  {
    id: "1",
    name: "Tech World",
    banner: "bg-gradient-to-r from-blue-100 to-blue-200",
    logo: "bg-gradient-to-br from-blue-500 to-blue-600",
    verified: true,
    rating: 4.8,
    products: 340,
    followers: 12500,
    category: "Electronics",
    location: "New York, USA",
  },
  {
    id: "2",
    name: "Fashion Hub",
    banner: "bg-gradient-to-r from-pink-100 to-pink-200",
    logo: "bg-gradient-to-br from-pink-500 to-pink-600",
    verified: true,
    rating: 4.7,
    products: 890,
    followers: 18200,
    category: "Fashion",
    location: "London, UK",
  },
  {
    id: "3",
    name: "Home Essentials",
    banner: "bg-gradient-to-r from-orange-100 to-orange-200",
    logo: "bg-gradient-to-br from-orange-500 to-orange-600",
    verified: true,
    rating: 4.9,
    products: 567,
    followers: 9800,
    category: "Home & Living",
    location: "Accra, Ghana",
  },
  {
    id: "4",
    name: "Beauty Plus",
    banner: "bg-gradient-to-r from-green-100 to-green-200",
    logo: "bg-gradient-to-br from-green-500 to-green-600",
    verified: false,
    rating: 4.6,
    products: 234,
    followers: 5600,
    category: "Beauty & Health",
    location: "Lagos, Nigeria",
  },
  {
    id: "5",
    name: "Sports Arena",
    banner: "bg-gradient-to-r from-green-100 to-green-200",
    logo: "bg-gradient-to-br from-green-500 to-green-600",
    verified: true,
    rating: 4.8,
    products: 456,
    followers: 11200,
    category: "Sports & Fitness",
    location: "Nairobi, Kenya",
  },
  {
    id: "6",
    name: "Book Haven",
    banner: "bg-gradient-to-r from-indigo-100 to-indigo-200",
    logo: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    verified: true,
    rating: 4.9,
    products: 1200,
    followers: 15800,
    category: "Books & Education",
    location: "Toronto, Canada",
  },
  {
    id: "7",
    name: "Auto Parts Pro",
    banner: "bg-gradient-to-r from-gray-100 to-gray-200",
    logo: "bg-gradient-to-br from-gray-600 to-gray-700",
    verified: true,
    rating: 4.7,
    products: 678,
    followers: 7400,
    category: "Automotive",
    location: "Dubai, UAE",
  },
  {
    id: "8",
    name: "Fresh Market",
    banner: "bg-gradient-to-r from-red-100 to-red-200",
    logo: "bg-gradient-to-br from-red-500 to-red-600",
    verified: false,
    rating: 4.5,
    products: 145,
    followers: 3200,
    category: "Food & Groceries",
    location: "Paris, France",
  },
];

export function StoreGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stores.map((store) => (
        <StoreCard key={store.id} {...store} />
      ))}
    </div>
  );
}
