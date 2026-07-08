import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Users, Package } from "lucide-react";
import Link from "next/link";

const stores = [
  {
    id: "1",
    name: "TechStore",
    logo: "bg-gradient-to-br from-blue-500 to-blue-600",
    banner: "bg-gradient-to-r from-blue-100 to-blue-200",
    rating: 4.9,
    followers: "125K",
    products: 1543,
  },
  {
    id: "2",
    name: "Fashion Hub",
    logo: "bg-gradient-to-br from-pink-500 to-pink-600",
    banner: "bg-gradient-to-r from-pink-100 to-pink-200",
    rating: 4.7,
    followers: "98K",
    products: 2341,
  },
  {
    id: "3",
    name: "Gadget World",
    logo: "bg-gradient-to-br from-purple-500 to-purple-600",
    banner: "bg-gradient-to-r from-purple-100 to-purple-200",
    rating: 4.8,
    followers: "156K",
    products: 987,
  },
  {
    id: "4",
    name: "Beauty Plus",
    logo: "bg-gradient-to-br from-green-500 to-green-600",
    banner: "bg-gradient-to-r from-green-100 to-green-200",
    rating: 4.6,
    followers: "78K",
    products: 654,
  },
];

export function PopularStores() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Stores
          </h2>
          <p className="text-lg text-gray-600">
            Shop from our trusted and verified sellers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((store) => (
            <Card
              key={store.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Banner */}
              <div className={`h-24 ${store.banner}`}></div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Logo */}
                  <div
                    className={`w-16 h-16 ${store.logo} rounded-lg flex items-center justify-center text-white font-bold text-2xl -mt-12 border-4 border-white shadow-md`}
                  >
                    {store.name.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <Link href={`/store/${store.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 hover:text-primary transition-colors">
                        {store.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{store.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{store.followers} followers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>{store.products} products</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Link href={`/store/${store.id}`}>
                  <Button className="w-full mt-4" variant="outline">
                    Visit Store
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
