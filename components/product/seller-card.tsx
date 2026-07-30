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

  const isLogoUrl = Boolean(logo && (logo.startsWith("http") || logo.startsWith("/")));

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
    <Card className="p-6 border border-gray-200 rounded-3xl bg-white shadow-sm flex flex-col justify-between space-y-6">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
          Sold &amp; Fulfilled By:
        </h3>

        <div className="flex items-start gap-4 mb-6">
          <Avatar className="h-16 w-16 bg-emerald-600 border border-gray-200 overflow-hidden flex-shrink-0">
            {isLogoUrl ? (
              <img
                src={logo}
                alt={`${storeName} Logo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                {storeName?.charAt(0) || "S"}
              </div>
            )}
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/store/${storeId}`}>
                <h4 className="text-lg font-bold text-gray-900 hover:text-emerald-600 transition-colors truncate">
                  {storeName}
                </h4>
              </Link>
              {verified && (
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
              <div className="flex items-center gap-1 font-semibold text-gray-900">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{storeRating}</span>
                <span className="text-gray-400">/ 5.0</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1 text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                <span>{location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Store Metrics */}
        <div className="space-y-3 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-600 font-medium">
              <Package className="h-4 w-4 text-emerald-600" /> Products Listed
            </span>
            <span className="font-bold text-gray-900">{products}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-600 font-medium">
              <Users className="h-4 w-4 text-blue-600" /> Store Followers
            </span>
            <span className="font-bold text-gray-900">{followers}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-600 font-medium">
              <MessageCircle className="h-4 w-4 text-purple-600" /> Response Rate
            </span>
            <span className="font-bold text-gray-900">{responseRate}%</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Link href={`/store/${storeId}`} className="block">
          <Button variant="outline" className="w-full h-11 rounded-xl text-xs font-bold border-gray-200">
            <StoreIcon className="h-4 w-4 mr-1.5 text-emerald-600" />
            Visit Store
          </Button>
        </Link>
        <Button
          onClick={handleContactSeller}
          disabled={isStartingChat}
          className="h-11 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
        >
          {isStartingChat ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MessageCircle className="h-4 w-4" />
          )}
          Contact Seller
        </Button>
      </div>
    </Card>
  );
}
