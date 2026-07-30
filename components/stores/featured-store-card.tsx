import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Star, Package, Users, CheckCircle } from "lucide-react";
import Link from "next/link";

interface FeaturedStoreCardProps {
  id: string;
  name: string;
  banner?: string;
  logo?: string;
  verified?: boolean;
  rating?: number;
  products?: number;
  productCount?: number;
  followers?: number;
  followerCount?: number;
  isFollowing?: boolean;
  category?: string;
  slug?: string;
}

export function FeaturedStoreCard({
  id,
  name,
  banner,
  logo,
  verified = true,
  rating = 5.0,
  products,
  productCount,
  followers,
  followerCount,
  category = "General",
  slug,
}: FeaturedStoreCardProps) {
  const realProductCount = productCount ?? products ?? 0;
  const realFollowerCount = followerCount ?? followers ?? 0;
  const isLogoUrl = Boolean(logo && (logo.startsWith("http") || logo.startsWith("/")));
  const isBannerUrl = Boolean(banner && (banner.startsWith("http") || banner.startsWith("/")));
  const storeHref = `/stores/${slug || id}`;

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group bg-white border border-gray-200 rounded-3xl">
      {/* Banner */}
      <div className="h-32 relative bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600 overflow-hidden">
        {isBannerUrl ? (
          <img
            src={banner}
            alt={`${name} Banner`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-emerald-600 to-teal-700 opacity-90" />
        )}
      </div>

      {/* Content */}
      <div className="p-6 relative">
        {/* Logo */}
        <Avatar className="h-20 w-20 absolute -top-10 left-6 border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-2xl flex items-center justify-center">
          {isLogoUrl ? (
            <img
              src={logo}
              alt={`${name} Logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{name.charAt(0).toUpperCase()}</span>
          )}
        </Avatar>

        <div className="pt-12 space-y-4">
          {/* Store Name */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">{name}</h3>
              {verified && (
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              )}
            </div>
            <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-100 font-semibold">
              {category}
            </Badge>
          </div>

          {/* Real-time Stats */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{rating}</span>
              <span>Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              <span className="font-semibold text-gray-900">
                {realProductCount >= 1000 ? `${(realProductCount / 1000).toFixed(1)}K` : realProductCount}
              </span>
              <span>Products</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="font-semibold text-gray-900">
                {realFollowerCount >= 1000 ? `${(realFollowerCount / 1000).toFixed(1)}K` : realFollowerCount}
              </span>
              <span>Followers</span>
            </div>
          </div>

          {/* Action */}
          <Link href={storeHref} className="block pt-1">
            <Button className="w-full h-11 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
              Visit Store →
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
