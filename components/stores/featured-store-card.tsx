import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Package, Users, CheckCircle } from "lucide-react";
import Link from "next/link";

interface FeaturedStoreCardProps {
  id: string;
  name: string;
  banner: string;
  logo: string;
  verified: boolean;
  rating: number;
  products: number;
  followers: number;
  category: string;
}

export function FeaturedStoreCard({
  id,
  name,
  banner,
  logo,
  verified,
  rating,
  products,
  followers,
  category,
}: FeaturedStoreCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      {/* Banner */}
      <div className={`h-32 ${banner}`}></div>

      {/* Content */}
      <div className="p-6 relative">
        {/* Logo */}
        <Avatar className="h-20 w-20 absolute -top-10 left-6 border-4 border-white shadow-lg">
          <div className={`w-full h-full ${logo} flex items-center justify-center text-white text-2xl font-bold`}>
            {name.charAt(0)}
          </div>
        </Avatar>

        <div className="pt-12 space-y-4">
          {/* Store Name */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900">{name}</h3>
              {verified && (
                <CheckCircle className="h-5 w-5 text-primary" />
              )}
            </div>
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          </div>

          {/* Stats */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{rating}</span>
              <span>Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="font-semibold text-gray-900">
                {products >= 1000 ? `${(products / 1000).toFixed(1)}K` : products}
              </span>
              <span>Products</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-semibold text-gray-900">
                {followers >= 1000 ? `${(followers / 1000).toFixed(0)}K` : followers}
              </span>
              <span>Followers</span>
            </div>
          </div>

          {/* Action */}
          <Link href={`/store/${id}`} className="block">
            <Button className="w-full group-hover:bg-primary-600">
              Visit Store
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
