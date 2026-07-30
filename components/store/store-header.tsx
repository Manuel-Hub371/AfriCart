"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  Star, 
  Users, 
  Package, 
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";

interface StoreHeaderProps {
  storeId?: string;
  storeName: string;
  verified: boolean;
  rating: number;
  followers: number;
  isFollowing?: boolean;
  products: number;
  joinDate: string;
  bannerImage?: string;
  logoUrl?: string;
}

export function StoreHeader({
  storeId,
  storeName,
  verified,
  rating,
  followers,
  isFollowing = false,
  products,
  joinDate,
  bannerImage,
  logoUrl,
}: StoreHeaderProps) {
  const router = useRouter();
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [followingState, setFollowingState] = useState(isFollowing);
  const [followersCountState, setFollowersCountState] = useState(followers);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);

  const isBannerUrl = Boolean(bannerImage && (bannerImage.startsWith("http") || bannerImage.startsWith("/")));
  const isLogoUrl = Boolean(logoUrl && (logoUrl.startsWith("http") || logoUrl.startsWith("/")));

  const handleFollowStore = async () => {
    if (!storeId || isTogglingFollow) return;
    try {
      setIsTogglingFollow(true);
      const res = await fetch(`/api/stores/${storeId}/follow`, {
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
      console.error("Failed to toggle follow:", err);
    } finally {
      setIsTogglingFollow(false);
    }
  };

  const handleMessageStore = async () => {
    if (!storeId) return;
    try {
      setIsStartingChat(true);
      const res = await fetch("/api/messaging/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId }),
      });

      if (res.ok) {
        const conv = await res.json();
        router.push(`/profile/messages?conversationId=${conv.id}`);
      } else {
        router.push("/auth/login");
      }
    } catch (err) {
      console.error("Failed to message store:", err);
    } finally {
      setIsStartingChat(false);
    }
  };

  return (
    <div className="bg-white border-b">
      {/* Banner Image */}
      <div className="h-48 md:h-64 relative bg-slate-900 overflow-hidden">
        {isBannerUrl ? (
          <img
            src={bannerImage}
            alt={`${storeName} Banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full gradient-primary opacity-90" />
        )}
      </div>

      {/* Store Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Store Logo */}
          <div className="absolute -top-16 md:-top-20">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-lg bg-white overflow-hidden">
              {isLogoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${storeName} Logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full gradient-primary flex items-center justify-center text-white text-4xl md:text-5xl font-bold">
                  {storeName?.charAt(0) || "S"}
                </div>
              )}
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
                    <Badge className="bg-emerald-600 gap-1 text-white">
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
                      {followersCountState >= 1000 
                        ? `${(followersCountState / 1000).toFixed(1)}K` 
                        : followersCountState}
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
                <Button
                  size="lg"
                  onClick={handleFollowStore}
                  disabled={isTogglingFollow}
                  className={`gap-2 text-white font-bold transition-all ${
                    followingState
                      ? "bg-red-600 hover:bg-red-700"
                      : "gradient-primary"
                  }`}
                >
                  {isTogglingFollow ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart className={`h-4 w-4 ${followingState ? "fill-white" : ""}`} />
                  )}
                  {followingState ? "Following" : "Follow Store"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleMessageStore}
                  disabled={isStartingChat}
                  className="gap-2"
                >
                  {isStartingChat ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MessageCircle className="h-4 w-4" />
                  )}
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
