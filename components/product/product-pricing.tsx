import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ProductPricingProps {
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  inStock: boolean;
}

export function ProductPricing({
  price,
  originalPrice,
  discount,
  stock,
  inStock,
}: ProductPricingProps) {
  return (
    <div className="space-y-4 py-6 border-y">
      {/* Price */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-4xl font-bold text-gray-900">
          ${price.toFixed(2)}
        </span>
        {originalPrice && (
          <>
            <span className="text-2xl text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
            {discount && (
              <Badge className="bg-orange-500 text-lg px-3 py-1">
                -{discount}% OFF
              </Badge>
            )}
          </>
        )}
      </div>

      {/* Savings */}
      {originalPrice && (
        <p className="text-green-600 font-medium">
          You save ${(originalPrice - price).toFixed(2)} ({discount}%)
        </p>
      )}

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {inStock ? (
          <>
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-600 font-semibold">In Stock</span>
            {stock <= 10 && (
              <span className="text-orange-600">
                - Only {stock} items left!
              </span>
            )}
          </>
        ) : (
          <>
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-600 font-semibold">Out of Stock</span>
          </>
        )}
      </div>
    </div>
  );
}
