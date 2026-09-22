"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tag, Clock, ArrowRight, PackageX, Zap } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { apiFetch } from "@/lib/api/client";

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

export function SpecialDeals() {
  const [products, setProducts] = useState<any[]>([]);
  const [featuredCampaign, setFeaturedCampaign] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => computeTimeLeft(null));
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadDeals() {
      try {
        setIsLoading(true);
        const res = await apiFetch("/api/deals?limit=8&sortBy=discount_desc");
        if (res.ok) {
          const data = await res.json();
          setProducts(Array.isArray(data?.products) ? data.products : []);
          setFeaturedCampaign(data?.featuredCampaign || null);
          if (data?.featuredCampaign?.endDate) {
            setTimeLeft(computeTimeLeft(data.featuredCampaign.endDate));
          }
        }
      } catch (err) {
        console.error("Failed to load deals:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDeals();
  }, []);

  useEffect(() => {
    if (!featuredCampaign?.endDate) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(computeTimeLeft(featuredCampaign.endDate));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [featuredCampaign?.endDate]);

  const pad = (n: number) => String(n).padStart(2, "0");
  const showCountdown = Boolean(featuredCampaign?.endDate) && !timeLeft.expired;

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-8 sm:mb-10 text-center md:text-left">
          <div className="inline-block mb-2 sm:mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs sm:text-sm font-bold">
              <Tag className="h-3.5 w-3.5" />
              Limited-Time Deals
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                Deals You Don&apos;t Want to <span className="text-gradient">Miss</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-xl font-medium">
                Live promotional pricing from vendors running active campaigns on AfriCart.
              </p>
            </div>
            <Link href="/deals" className="shrink-0">
              <Button className="gradient-primary text-white shadow-md hover:shadow-lg transition-all duration-300 h-10 sm:h-11 px-5 rounded-xl font-bold text-xs sm:text-sm">
                Shop All Deals
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Promotional banner (real campaign when available) */}
        <div
          className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl mb-6 sm:mb-8"
          style={
            featuredCampaign?.color
              ? { backgroundImage: `linear-gradient(to bottom right, ${featuredCampaign.color}, rgba(0,0,0,0.35))` }
              : undefined
          }
        >
          <div className="relative grid lg:grid-cols-2 gap-6 p-6 sm:p-10 items-center">
            {/* Left: content */}
            <div className="space-y-4 text-white">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm">
                <Zap className="h-3.5 w-3.5" />
                <span className="text-xs font-bold">
                  {featuredCampaign?.badge || featuredCampaign?.name || "Active Marketplace Promotions"}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 leading-tight">
                  Great products.{" "}
                  <span className="text-white/85">Better prices.</span>
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed max-w-md">
                  {featuredCampaign?.name
                    ? `Right now: ${featuredCampaign.name} — limited promotional pricing while the campaign runs.`
                    : "Browse discounted items from live vendor campaigns across the marketplace, with savings shown at checkout."}
                </p>
              </div>

              {showCountdown && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/90">
                    <Clock className="h-4 w-4" />
                    <span>Campaign ends in:</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    {(timeLeft.days > 0
                      ? [
                          { value: timeLeft.days, label: "Days" },
                          { value: timeLeft.hours, label: "Hrs" },
                          { value: timeLeft.minutes, label: "Mins" },
                          { value: timeLeft.seconds, label: "Secs" },
                        ]
                      : [
                          { value: timeLeft.hours, label: "Hours" },
                          { value: timeLeft.minutes, label: "Mins" },
                          { value: timeLeft.seconds, label: "Secs" },
                        ]
                    ).map((item, index, arr) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-center shadow-md min-w-[54px] sm:min-w-[64px]">
                          <div className="text-lg sm:text-2xl font-black text-white">
                            {pad(item.value)}
                          </div>
                          <div className="text-[9px] sm:text-[10px] text-white/80 font-bold uppercase tracking-tight">
                            {item.label}
                          </div>
                        </div>
                        {index < arr.length - 1 && (
                          <span className="text-lg sm:text-xl font-bold text-white/80">:</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-1">
                <Link href="/deals">
                  <Button
                    size="sm"
                    className="bg-white text-orange-600 hover:bg-gray-100 h-10 sm:h-12 px-6 rounded-xl shadow-lg font-extrabold text-xs sm:text-sm"
                  >
                    Shop All Deals
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: campaign activity summary */}
            <div className="relative mt-2 lg:mt-0">
              <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-white">
                  <Tag className="h-5 w-5" />
                  <span className="font-extrabold text-sm sm:text-base">What&apos;s on offer</span>
                </div>
                <ul className="space-y-3">
                  {[
                    "Discounted prices on live campaign products",
                    "Savings shown directly on each listing",
                    "Offers from verified stores across the marketplace",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2.5 text-white/95 text-xs sm:text-sm font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/90 mt-1.5 shrink-0"></span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-1 border-t border-white/20">
                  <p className="text-[11px] text-white/75 font-medium">
                    Deals are set by vendors and change as campaigns start and finish.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deal product grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border p-2 space-y-2 animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand}
                storeName={product.store?.name || "AfriCart Store"}
                verified={true}
                rating={product.rating}
                reviews={product.numReviews}
                price={product.price}
                originalPrice={product.originalPrice}
                isDiscounted={product.isDiscounted}
                discountPercent={product.discountPercent}
                amountSaved={product.amountSaved}
                campaignBadge={product.campaignBadge}
                campaignColor={product.campaignColor}
                campaignName={product.campaignName}
                image={product.images}
                inStock={product.stock > 0}
                imagesCount={Array.isArray(product.images) ? product.images.length : 1}
                isBestSeller={product.isBestSeller}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <PackageX className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-1">
              No active deals right now
            </h3>
            <p className="text-sm text-gray-500 font-medium mb-4">
              New vendor campaigns are added regularly. Check the deals page for the latest offers.
            </p>
            <Link href="/deals">
              <Button className="gradient-primary text-white rounded-xl font-bold shadow-md">
                Browse Deals
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}