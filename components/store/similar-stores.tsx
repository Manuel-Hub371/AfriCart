import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle } from "lucide-react";
import Link from "next/link";

const similarStores = [
  {
    id: "1",
    name: "Fashion Hub",
    category: "Fashion & Apparel",
    rating: 4.7,
    verified: true,
    logoColor: "bg-gradient-to-br from-pink-500 to-pink-600",
  },
  {
    id: "2",
    name: "Electronics Pro",
    category: "Electronics",
    rating: 4.9,
    verified: true,
    logoColor: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
  {
    id: "3",
    name: "Home Store",
    category: "Home & Living",
    rating: 4.6,
    verified: true,
    logoColor: "bg-gradient-to-br from-orange-500 to-orange-600",
  },
  {
    id: "4",
    name: "Beauty Plus",
    category: "Beauty & Health",
    rating: 4.8,
    verified: false,
    logoColor: "bg-gradient-to-br from-green-500 to-green-600",
  },
];

export function SimilarStores() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Similar Stores</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {similarStores.map((store) => (
          <Card key={store.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-20 w-20">
                <div className={`w-full h-full ${store.logoColor} flex items-center justify-center text-white text-2xl font-bold`}>
                  {store.name.charAt(0)}
                </div>
              </Avatar>
              
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-center gap-1">
                  <h3 className="font-semibold text-gray-900">{store.name}</h3>
                  {store.verified && (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  )}
                </div>
                
                <Badge variant="secondary" className="text-xs">
                  {store.category}
                </Badge>
                
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{store.rating}</span>
                </div>
              </div>
              
              <Link href={`/store/${store.id}`} className="w-full">
                <Button variant="outline" className="w-full" size="sm">
                  Visit Store
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
