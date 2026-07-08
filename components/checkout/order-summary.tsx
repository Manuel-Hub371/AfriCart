"use client";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
}

export default function OrderSummary({
  subtotal,
  shipping,
  discount,
  tax,
  total,
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">${subtotal}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span>Shipping</span>
          <span className="font-medium">${shipping}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-emerald-600">
            <span>Discount</span>
            <span className="font-medium">-${discount}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-gray-600">
          <span>Tax (2.5%)</span>
          <span className="font-medium">${tax}</span>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-emerald-600">
              ${total}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            <span>Secure payment processing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            <span>30-day return policy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            <span>Buyer protection guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
