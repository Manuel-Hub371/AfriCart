"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Tag, AlertTriangle, CheckCircle2, Clock, Flame, ShieldAlert, Sparkles } from "lucide-react";

interface ProductPricingProps {
  /** Effective (campaign-adjusted) selling price */
  price: number;
  /** Original base price (shown with strikethrough when discounted) */
  originalPrice?: number;
  /** Amount saved in GH₵ */
  amountSaved?: number;
  /** Discount percentage (0–100) */
  discountPercent?: number;
  /** Whether a discount is currently active */
  isDiscounted?: boolean;
  /** Campaign name for display */
  campaignName?: string | null;
  /** Campaign end date ISO string for real countdown */
  campaignEndDate?: string | null;
  stock: number;
  inStock: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function computeTimeLeft(endDateIso?: string | null): TimeLeft {
  if (!endDateIso) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const diff = new Date(endDateIso).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, expired: false };
}

export function ProductPricing({
  price,
  originalPrice,
  amountSaved = 0,
  discountPercent = 0,
  isDiscounted = false,
  campaignName,
  campaignEndDate,
  stock,
  inStock,
}: ProductPricingProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => computeTimeLeft(campaignEndDate));
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Real countdown from actual campaign endDate
  useEffect(() => {
    if (!campaignEndDate || !isDiscounted) return;

    // Recompute immediately when prop changes
    setTimeLeft(computeTimeLeft(campaignEndDate));

    timerRef.current = setInterval(() => {
      setTimeLeft(computeTimeLeft(campaignEndDate));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [campaignEndDate, isDiscounted]);

  const isLowStock = inStock && stock <= 5;
  const showCountdown = isDiscounted && campaignEndDate && !timeLeft.expired;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="space-y-2.5 sm:space-y-4">
      {/* Campaign Banner — only shown when an active campaign exists */}
      {isDiscounted && campaignName && (
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center justify-between shadow-2xs gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Flame className="h-4 w-4 animate-pulse flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-black text-xs sm:text-sm uppercase tracking-wide truncate">
                {campaignName}
              </p>
              {discountPercent > 0 && (
                <p className="text-[10px] sm:text-xs font-bold text-orange-100">
                  {discountPercent}% OFF — Limited Time
                </p>
              )}
            </div>
          </div>

          {/* Real countdown timer */}
          {showCountdown && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-[9px] font-bold text-orange-100 hidden sm:inline mr-1">
                Ends in:
              </span>
              {timeLeft.days > 0 && (
                <div className="bg-black/30 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-black">
                  {timeLeft.days}d
                </div>
              )}
              <div className="bg-black/30 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-black">
                {pad(timeLeft.hours)}h
              </div>
              <span className="text-[10px] font-black">:</span>
              <div className="bg-black/30 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-black">
                {pad(timeLeft.minutes)}m
              </div>
              <span className="text-[10px] font-black">:</span>
              <div className="bg-black/30 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-black">
                {pad(timeLeft.seconds)}s
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Pricing Row */}
      <div className="bg-emerald-50/50 border border-emerald-100 p-3 sm:p-5 rounded-xl sm:rounded-2xl flex items-baseline justify-between flex-wrap gap-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-xl sm:text-3xl font-black text-emerald-700">
            GH₵{Number(price).toFixed(2)}
          </span>

          {isDiscounted && originalPrice && originalPrice > price && (
            <span className="text-xs sm:text-lg font-bold text-gray-400 line-through">
              GH₵{Number(originalPrice).toFixed(2)}
            </span>
          )}

          {isDiscounted && discountPercent > 0 && (
            <Badge className="bg-red-500 text-white font-extrabold text-[9px] sm:text-xs px-2 py-0.2 rounded-md">
              -{discountPercent}% OFF
            </Badge>
          )}
        </div>

        {amountSaved > 0 && (
          <span className="text-[10px] sm:text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
            Save GH₵{amountSaved.toFixed(2)}
          </span>
        )}
      </div>

      {/* Stock Alert */}
      <div className="flex items-center gap-2 text-xs font-bold">
        {inStock ? (
          isLowStock ? (
            <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 flex items-center gap-1 text-[10px] sm:text-xs">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              Hurry! Only {stock} items remaining in stock
            </span>
          ) : (
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1 text-[10px] sm:text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              In Stock &amp; Ready to Ship
            </span>
          )
        ) : (
          <span className="text-red-700 bg-red-50 px-2.5 py-1 rounded-xl border border-red-200 flex items-center gap-1 text-[10px] sm:text-xs">
            <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
            Out of Stock
          </span>
        )}
      </div>
    </div>
  );
}
