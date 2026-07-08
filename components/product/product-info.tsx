import { Star, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductInfoProps {
  name: string;
  rating: number;
  reviews: number;
  verified?: boolean;
}

export function ProductInfo({ name, rating, reviews, verified = false }: ProductInfoProps) {
  return (
    <div className="space-y-4">
      {/* Product Name */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
        {name}
      </h1>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-lg font-semibold text-gray-900">{rating}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <span className="font-medium">{reviews.toLocaleString()}</span>
          <span>Reviews</span>
        </div>

        {verified && (
          <Badge className="gap-1 bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3" />
            Verified Product
          </Badge>
        )}
      </div>
    </div>
  );
}
