"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, X, CheckCircle } from "lucide-react";

interface AppliedCoupon {
  code: string;
  discount: number;
}

export function CouponInput() {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupons, setAppliedCoupons] = useState<AppliedCoupon[]>([
    { code: "SAVE20", discount: 20 },
  ]);
  const [error, setError] = useState("");

  const handleApply = () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    // Check if already applied
    if (appliedCoupons.some((c) => c.code === couponCode)) {
      setError("This coupon is already applied");
      return;
    }

    // Simulate coupon validation
    // In real app, this would be an API call
    setError("");
    setCouponCode("");
    // Add success message or apply coupon
  };

  const removeCoupon = (code: string) => {
    setAppliedCoupons(appliedCoupons.filter((c) => c.code !== code));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-gray-900">Apply Coupon</h3>
      </div>

      {/* Applied Coupons */}
      {appliedCoupons.length > 0 && (
        <div className="mb-4 space-y-2">
          {appliedCoupons.map((coupon) => (
            <div
              key={coupon.code}
              className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-900">
                  {coupon.code}
                </span>
                <span className="text-sm text-green-700">
                  -${coupon.discount} discount applied
                </span>
              </div>
              <button
                onClick={() => removeCoupon(coupon.code)}
                className="p-1 hover:bg-green-100 rounded transition-colors"
              >
                <X className="h-4 w-4 text-green-700" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Coupon Input */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => {
            setCouponCode(e.target.value.toUpperCase());
            setError("");
          }}
          className="flex-1"
        />
        <Button onClick={handleApply}>Apply</Button>
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {/* Available Coupons */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Available Coupons:
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => setCouponCode("WELCOME10")}
          >
            WELCOME10
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => setCouponCode("FREESHIP")}
          >
            FREESHIP
          </Badge>
        </div>
      </div>
    </Card>
  );
}
