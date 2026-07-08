import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Tag } from "lucide-react";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
}

export function CartSummary({
  subtotal,
  shipping,
  discount,
  tax,
  total,
}: CartSummaryProps) {
  return (
    <Card className="p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-gray-900">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold text-gray-900">
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Discount</span>
            <span className="font-semibold text-green-600">
              -${discount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-semibold text-gray-900">
            ${tax.toFixed(2)}
          </span>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-primary">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <Button size="lg" className="w-full gap-2 mb-3">
        <ShoppingBag className="h-5 w-5" />
        Proceed to Checkout
      </Button>

      <Button size="lg" variant="outline" className="w-full">
        Continue Shopping
      </Button>

      {/* Savings Badge */}
      {discount > 0 && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
          <Tag className="h-5 w-5 text-green-600" />
          <div className="text-sm">
            <span className="font-semibold text-green-900">
              You saved ${discount.toFixed(2)}
            </span>
            <span className="text-green-700"> on this order!</span>
          </div>
        </div>
      )}
    </Card>
  );
}
