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

  const validCoupons = ["SAVE50", "AFRICART10", "WELCOME20"];

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setError("Please enter a valid promo or coupon code");
      return;
    }

    if (validCoupons.includes(code)) {
      onApplyCoupon(code);
      setCouponCode("");
      setError("");
    } else {
      setError("Invalid or expired coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="h-5 w-5 text-emerald-600" />
        <h3 className="font-bold text-gray-900">Apply Promo Coupon</h3>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div>
            <p className="text-sm font-bold text-emerald-800">
              Coupon Code Applied: {appliedCoupon}
            </p>
            <p className="text-xs text-emerald-600 mt-0.5 font-medium">
              Promotional discount calculated at order review
            </p>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-emerald-700 hover:text-emerald-900 p-1 rounded-lg hover:bg-emerald-100"
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
              placeholder="Enter coupon code (e.g. AFRICART10)"
              className="flex-1 rounded-xl"
            />
            <Button onClick={handleApplyCoupon} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
              Apply
            </Button>
          </div>
          {error && <p className="text-xs font-semibold text-red-600 mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}
