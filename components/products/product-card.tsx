import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  storeName: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
}

export function ProductCard({
  id,
  name,
  storeName,
  rating,
  reviews,
  price,
  originalPrice,
  discount,
  image,
}: ProductCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all">
      <Link href={`/product/${id}`}>
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <div className={`w-full h-full ${image}`}></div>
          {discount && (
            <Badge className="absolute top-2 left-2 bg-orange-500">
              -{discount}%
            </Badge>
          )}
          <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white">
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <div>
          <Link href={`/product/${id}`}>
            <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>
          <Link href={`/store/${storeName.toLowerCase()}`}>
            <p className="text-sm text-gray-500 hover:text-primary transition-colors">
              {storeName}
            </p>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900">{rating}</span>
          </div>
          <span className="text-sm text-gray-500">({reviews} reviews)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">${price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice}
            </span>
          )}
        </div>

        <Button className="w-full gap-2" size="sm">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
