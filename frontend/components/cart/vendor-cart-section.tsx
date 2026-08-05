import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, CheckCircle, Truck } from "lucide-react";
import Link from "next/link";
import { CartItem } from "./cart-item";

interface CartItemData {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  maxQuantity: number;
  variants?: { name: string; value: string }[];
  inStock: boolean;
}

interface VendorCartSectionProps {
  vendorId: string;
  vendorName: string;
  vendorLogo: string;
  verified: boolean;
  rating: number;
  items: CartItemData[];
  shippingInfo: {
    cost: number;
    estimatedDelivery: string;
  };
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function VendorCartSection({
  vendorId,
  vendorName,
  vendorLogo,
  verified,
  rating,
  items,
  shippingInfo,
  onQuantityChange,
  onRemove,
}: VendorCartSectionProps) {
  return (
    <Card className="p-6">
      {/* Vendor Header */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <div className={`w-full h-full ${vendorLogo} flex items-center justify-center text-white text-xl font-bold`}>
              {vendorName.charAt(0)}
            </div>
          </Avatar>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900">{vendorName}</h3>
              {verified && (
                <CheckCircle className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{rating}</span>
              <span className="text-gray-600">/5</span>
            </div>
          </div>
        </div>

        <Link href={`/store/${vendorId}`}>
          <Button variant="outline" size="sm">
            Visit Store
          </Button>
        </Link>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <CartItem
            key={item.id}
            {...item}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* Shipping Info */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Truck className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-900">
            {shippingInfo.cost === 0 ? (
              <span className="text-green-600">Free Delivery</span>
            ) : (
              <span>Shipping: ${shippingInfo.cost.toFixed(2)}</span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            Estimated Arrival: {shippingInfo.estimatedDelivery}
          </div>
        </div>
      </div>
    </Card>
  );
}
