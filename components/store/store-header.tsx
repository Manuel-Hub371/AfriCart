"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  Star, 
  Users, 
  Package, 
  Calendar,
  Heart,
  MessageCircle,
  Share2
} from "lucide-react";

interface StoreHeaderProps {
  storeName: string;
  verified: boolean;
  rating: number;
  followers: number;
  products: number;
  joinDate: string;
  bannerImage?: string;
  logoColor?: string;
}

export function StoreHeader({
  storeName,
  verified,
  rating,
  followers,
  products,
  joinDate,
  bannerImage = "bg-gradient-to-r from-primary-100 to-primary-200",
  logoColor = "bg-gradient-to-br from-primary-500 to-primary-600",
}: StoreHeaderProps) {
  return (
    <div className="bg-white border-b">
      {/* Banner Image */}
      <div className={`h-48 md:h-64 ${bannerImage}`}></div>

      {/* Store Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Store Logo */}
          <div className="absolute -top-16 md:-top-20">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-lg">
              <div className={`w-full h-full ${logoColor} flex items-center justify-center text-white text-4xl md:text-5xl font-bold`}>
                {storeName.charAt(0)}
              </div>
            </Avatar>
          </div>

          {/* Store Details */}
          <div className="pt-20 md:pt-24 pb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              {/* Left: Store Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {storeName}
                  </h1>
                  {verified && (
                    <Badge className="bg-primary gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-6 flex-wrap text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{rating}</span>
                    <span>Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold text-gray-900">
                      {followers >= 1000 
                        ? `${(followers / 1000).toFixed(1)}K` 
                        : followers}
                    </span>
                    <span>Followers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="font-semibold text-gray-900">{products}</span>
                    <span>Products</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex gap-3">
                <Button size="lg" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Follow Store
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
