import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Package, Users, CheckCircle, MapPin, Heart } from "lucide-react";
import Link from "next/link";

interface StoreCardProps {
  id: string;
  name: string;
  banner: string;
  logo: string;
  verified: boolean;
  rating: number;
  products: number;
  followers: number;
  category: string;
  location: string;
}

export function StoreCard({
  id,
  name,
  banner,
  logo,
  verified,
  rating,
  products,
  followers,
  category,
  location,
}: StoreCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Banner */}
      <Link href={`/store/${id}`}>
        <div className={`h-24 ${banner} relative`}>
          <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white">
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 relative">
        {/* Logo */}
        <Avatar className="h-16 w-16 absolute -top-8 left-4 border-4 border-white shadow-md">
          <div className={`w-full h-full ${logo} flex items-center justify-center text-white text-xl font-bold`}>
            {name.charAt(0)}
          </div>
        </Avatar>

        <div className="pt-10 space-y-3">
          {/* Store Name */}
          <div>
            <Link href={`/store/${id}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="text-lg font-bold text-gray-900 hover:text-primary transition-colors line-clamp-1">
                  {name}
                </h3>
                {verified && (
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                )}
              </div>
            </Link>
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="h-3.5 w-3.5" />
              <span className="font-semibold text-gray-900">
                {products >= 1000 ? `${(products / 1000).toFixed(1)}K` : products}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span className="font-semibold text-gray-900">
                {followers >= 1000 ? `${(followers / 1000).toFixed(0)}K` : followers}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>

          {/* Action */}
          <Link href={`/store/${id}`} className="block">
            <Button className="w-full" size="sm">
              Visit Store
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
