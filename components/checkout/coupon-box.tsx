"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CouponBoxProps {
  appliedCoupon: string | null;
  onApplyCoupon: (coupon: string | null) => void;
}

export default function CouponBox({
  appliedCoupon,
  onApplyCoupon,
}: CouponBoxProps) {
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    // Simulate coupon validation (accept "SAVE50" for demo)
    if (couponCode.toUpperCase() === "SAVE50") {
      onApplyCoupon(couponCode.toUpperCase());
      setCouponCode("");
      setError("");
    } else {
      setError("Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="h-5 w-5 text-emerald-600" />
        <h3 className="font-semibold text-gray-900">Apply Coupon</h3>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Coupon Applied: {appliedCoupon}
            </p>
            <p className="text-xs text-emerald-600 mt-0.5">
              You saved $50 on this order
            </p>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-emerald-700 hover:text-emerald-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div>
          <div className="flex gap-2">
            <Input
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                setError("");
              }}
              placeholder="Enter coupon code"
              className="flex-1"
            />
            <Button onClick={handleApplyCoupon}>Apply</Button>
          </div>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          <p className="text-xs text-gray-500 mt-2">
            Try "SAVE50" for $50 discount
          </p>
        </div>
      )}
    </div>
  );
}
