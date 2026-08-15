"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Star, Package, Users, CheckCircle, MessageCircle, Loader2, Store as StoreIcon, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SellerCardProps {
  storeId: string;
  storeName: string;
  storeRating?: number;
  products?: number;
  totalSales?: number;
  followers?: number;
  responseRate?: number;
  responseTime?: string;
  verified?: boolean;
  logo?: string;
  banner?: string;
  location?: string;
  joinedDate?: string;
}

export function SellerCard({
  storeId,
  storeName,
  storeRating = 4.9,
  products = 0,
  followers = 0,
  responseRate = 98,
  verified = true,
  logo,
  location = "Accra, Ghana",
}: SellerCardProps) {
  const router = useRouter();
  const [isStartingChat, setIsStartingChat] = useState(false);

  const isLogoUrl = Boolean(logo && (logo.startsWith("http") || logo.startsWith("/") || logo.startsWith("data:image/")));

  const handleContactSeller = async () => {
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
      console.error("Failed to contact seller:", err);
    } finally {
      setIsStartingChat(false);
    }
  };

  return (
    <Card className="p-3 sm:p-6 border border-gray-200 rounded-xl sm:rounded-3xl bg-white shadow-2xs flex flex-col justify-between space-y-3 sm:space-y-6">
      <div>
        <h3 className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">
          Sold &amp; Fulfilled By:
        </h3>

        <div className="flex items-center gap-2.5 mb-3 sm:mb-6">
          <Avatar className="h-10 w-10 sm:h-16 sm:w-16 bg-emerald-600 border border-gray-200 overflow-hidden flex-shrink-0">
            {isLogoUrl ? (
              <img
                src={logo}
                alt={`${storeName} Logo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full gradient-primary flex items-center justify-center text-white text-base sm:text-2xl font-black">
                {storeName?.charAt(0) || "S"}
              </div>
            )}
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <Link href={`/store/${storeId}`}>
                <h4 className="text-xs sm:text-lg font-black text-gray-900 hover:text-emerald-600 transition-colors truncate">
                  {storeName}
                </h4>
              </Link>
              {verified && (
                <CheckCircle className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-emerald-600 flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 flex-wrap font-medium">
              <div className="flex items-center gap-0.5 text-amber-500 font-extrabold">
                <Star className="h-3 w-3 fill-amber-400" />
                <span>{storeRating}</span>
              </div>
              <span>•</span>
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-1.5 text-center bg-gray-50 p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100">
          <div>
            <p className="text-[9px] sm:text-xs text-gray-400 font-bold uppercase">Products</p>
            <p className="font-black text-xs sm:text-base text-gray-900">{products}</p>
          </div>
          <div className="border-x border-gray-200 px-1">
            <p className="text-[9px] sm:text-xs text-gray-400 font-bold uppercase">Followers</p>
            <p className="font-black text-xs sm:text-base text-gray-900">{followers}</p>
          </div>
          <div>
            <p className="text-[9px] sm:text-xs text-gray-400 font-bold uppercase">Response</p>
            <p className="font-black text-xs sm:text-base text-emerald-700">{responseRate}%</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Link href={`/store/${storeId}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full h-8 sm:h-10 text-xs font-bold rounded-xl border-gray-200 hover:bg-gray-50">
            <StoreIcon className="h-3.5 w-3.5 text-emerald-600 mr-1" />
            <span>Visit Store</span>
          </Button>
        </Link>
        <Button
          size="sm"
          disabled={isStartingChat}
          onClick={handleContactSeller}
          className="flex-1 h-8 sm:h-10 text-xs font-bold rounded-xl gradient-primary text-white"
        >
          {isStartingChat ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <MessageCircle className="h-3.5 w-3.5 mr-1" />
          )}
          <span>Chat Seller</span>
        </Button>
      </div>
    </Card>
  );
}
