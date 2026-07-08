import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Package, Users, CheckCircle, MessageCircle } from "lucide-react";
import Link from "next/link";

interface SellerCardProps {
  storeId: string;
  storeName: string;
  storeRating: number;
  products: number;
  followers: number;
  responseRate: number;
  verified: boolean;
  logo: string;
}

export function SellerCard({
  storeId,
  storeName,
  storeRating,
  products,
  followers,
  responseRate,
  verified,
  logo,
}: SellerCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-sm font-semibold text-gray-600 mb-4">Sold By:</h3>
      
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="h-16 w-16">
          <div className={`w-full h-full ${logo} flex items-center justify-center text-white text-2xl font-bold`}>
            {storeName?.charAt(0) || "S"}
          </div>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/store/${storeId}`}>
              <h4 className="text-lg font-bold text-gray-900 hover:text-primary transition-colors">
                {storeName}
              </h4>
            </Link>
            {verified && (
              <CheckCircle className="h-5 w-5 text-primary" />
            )}
          </div>
          
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-900">
              {storeRating}
            </span>
            <span className="text-sm text-gray-600">/5</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="h-4 w-4" />
            <span>Products</span>
          </div>
          <span className="font-semibold text-gray-900">{products}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-4 w-4" />
            <span>Followers</span>
          </div>
          <span className="font-semibold text-gray-900">
            {followers >= 1000 ? `${(followers / 1000).toFixed(1)}K` : followers}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle className="h-4 w-4" />
            <span>Response Rate</span>
          </div>
          <span className="font-semibold text-gray-900">{responseRate}%</span>
        </div>
      </div>

      <div className="space-y-2">
        <Link href={`/store/${storeId}`} className="block">
          <Button variant="outline" className="w-full">
            Visit Store
          </Button>
        </Link>
        <Button variant="ghost" className="w-full gap-2">
          <MessageCircle className="h-4 w-4" />
          Contact Seller
        </Button>
      </div>
    </Card>
  );
}
