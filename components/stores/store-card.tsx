"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Star, Package, Users, CheckCircle, MapPin, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface StoreCardProps {
  id: string;
  name: string;
  description?: string;
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
  categories?: { id: string; name: string; slug: string }[];
  businessType?: string;
  location?: string;
  slug?: string;
}

export function StoreCard({
  id,
  name,
  description,
  banner,
  logo,
  verified = true,
  rating = 5.0,
  products,
  productCount,
  followers,
  followerCount,
  isFollowing = false,
  category = "General",
  categories = [],
  businessType = "Retailer",
  location = "Ghana",
  slug,
}: StoreCardProps) {
  const router = useRouter();
  const [followingState, setFollowingState] = useState(isFollowing);
  const [followersCountState, setFollowersCountState] = useState(
    followerCount ?? followers ?? 0
  );
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);

  const displayCategories = categories && categories.length > 0
    ? categories
    : [{ id: "cat-1", name: category, slug: "cat-1" }];

  const realProductCount = productCount ?? products ?? 0;
  const isLogoUrl = Boolean(logo && (logo.startsWith("http") || logo.startsWith("/") || logo.startsWith("data:image/")));
  const isBannerUrl = Boolean(banner && (banner.startsWith("http") || banner.startsWith("/") || banner.startsWith("data:image/")));
  const storeHref = `/stores/${slug || id}`;

  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isTogglingFollow) return;

    try {
      setIsTogglingFollow(true);
      const res = await fetch(`/api/stores/${id}/follow`, {
        method: "POST",
      });

      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setFollowingState(data.isFollowing);
        setFollowersCountState(data.followerCount);
      }
    } catch (err) {
      console.error("Failed to toggle store follow:", err);
    } finally {
      setIsTogglingFollow(false);
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-200 rounded-3xl hover:shadow-xl transition-all duration-300 group bg-white flex flex-col justify-between">
      {/* Banner */}
      <Link href={storeHref}>
        <div className="h-28 relative bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600 overflow-hidden">
          {isBannerUrl ? (
            <img
              src={banner}
              alt={`${name} Banner`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 font-black text-4xl">
              AfriCart
            </div>
          )}

          {/* Follow Heart Button */}
          <button
            onClick={handleFollowToggle}
            title={followingState ? "Unfollow Store" : "Follow Store"}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all ${
              followingState
                ? "bg-red-500 text-white"
                : "bg-white/90 backdrop-blur-xs text-gray-700 hover:bg-emerald-600 hover:text-white"
            }`}
          >
            {isTogglingFollow ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className={`h-4 w-4 ${followingState ? "fill-white" : ""}`} />
            )}
          </button>
        </div>
      </Link>

      <div className="px-6 pb-6 pt-0 relative flex-1 flex flex-col justify-between">
        {/* Logo Avatar */}
        <Avatar className="h-16 w-16 border-4 border-white shadow-md bg-white text-emerald-700 font-extrabold text-xl absolute -top-8 left-6">
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

        <div className="pt-10 space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            {/* Store Name & Categories */}
            <div>
              <Link href={storeHref}>
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {name}
                  </h3>
                  {verified && (
                    <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  )}
                </div>
              </Link>
              <div className="flex items-center gap-1.5 flex-wrap">
                {displayCategories.slice(0, 2).map((c) => (
                  <Badge key={c.slug} variant="secondary" className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-100 font-semibold">
                    {c.name}
                  </Badge>
                ))}
                {displayCategories.length > 2 && (
                  <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 font-bold">
                    +{displayCategories.length - 2} more
                  </Badge>
                )}
                {businessType && (
                  <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-200 font-bold">
                    {businessType}
                  </Badge>
                )}
              </div>
            </div>

            {/* Store Description */}
            {description && (
              <p className="text-xs text-gray-600 font-medium line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Real-time DB Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900">{rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-bold text-gray-900">
                {realProductCount >= 1000 ? `${(realProductCount / 1000).toFixed(1)}K` : realProductCount}
              </span>
              <span>items</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-bold text-gray-900">
                {followersCountState >= 1000 ? `${(followersCountState / 1000).toFixed(1)}K` : followersCountState}
              </span>
              <span>followers</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-gray-400" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>

          {/* Action */}
          <Link href={storeHref} className="block pt-1">
            <Button className="w-full h-10 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white" size="sm">
              Visit Store →
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
