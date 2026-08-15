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
    <div className="space-y-4">
      {/* Campaign Banner — only shown when an active campaign exists */}
      {isDiscounted && campaignName && (
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-3 rounded-2xl flex items-center justify-between shadow-md gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Flame className="h-5 w-5 animate-pulse flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-extrabold text-sm uppercase tracking-wide truncate">
                {campaignName}
              </p>
              {discountPercent > 0 && (
                <p className="text-xs font-semibold text-orange-100">
                  {discountPercent}% OFF — Limited Time Offer
                </p>
              )}
            </div>
          </div>

          {/* Real countdown timer */}
          {showCountdown && (
            <div className="flex items-center gap-1 text-xs font-bold font-mono bg-black/30 px-3 py-1.5 rounded-xl flex-shrink-0">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {timeLeft.days > 0 && <><span>{timeLeft.days}d</span><span className="opacity-60">:</span></>}
              <span>{pad(timeLeft.hours)}h</span>
              <span className="opacity-60">:</span>
              <span>{pad(timeLeft.minutes)}m</span>
              <span className="opacity-60">:</span>
              <span>{pad(timeLeft.seconds)}s</span>
            </div>
          )}
        </div>
      )}

      {/* Main Pricing — from API, no frontend calculation */}
      <div className="flex items-baseline gap-2.5 flex-wrap">
        <span className="text-2xl sm:text-4xl font-black text-emerald-700 tracking-tight">
          GH₵{Number(price).toFixed(2)}
        </span>

        {isDiscounted && originalPrice && originalPrice > price && (
          <span className="text-xs sm:text-lg text-gray-400 line-through font-semibold">
            GH₵{Number(originalPrice).toFixed(2)}
          </span>
        )}

        {isDiscounted && discountPercent > 0 && (
          <Badge className="bg-red-600 text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-xs">
            -{discountPercent}% OFF
          </Badge>
        )}
      </div>

      {/* You Save callout */}
      {isDiscounted && amountSaved > 0 && (
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
          <span className="font-bold text-emerald-800 text-[11px] sm:text-xs">
            You save <span className="text-emerald-900">GH₵{Number(amountSaved).toFixed(2)}</span> with this offer
          </span>
        </div>
      )}

      {/* Real-time Inventory Status */}
      <div className="flex items-center gap-2 text-[10px] sm:text-xs flex-wrap">
        {inStock ? (
          isLowStock ? (
            <div className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              Only {stock} unit{stock === 1 ? "" : "s"} left — order soon!
            </div>
          ) : (
            <div className="flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              In Stock ({stock} available for dispatch)
            </div>
          )
        ) : (
          <div className="flex items-center gap-1 font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
            <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
            Out of Stock
          </div>
        )}
      </div>
    </div>
  );
}
