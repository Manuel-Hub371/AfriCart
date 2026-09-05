"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Tag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SpecialDeals() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
          {/* Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTIgMTItMTItNS4zNzMtMTItMTJ6bTAgMjhjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

          <div className="relative grid lg:grid-cols-2 gap-6 p-6 sm:p-10 md:p-14 items-center">
            {/* Left: Content */}
            <div className="space-y-4 sm:space-y-6 text-white">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm">
                <Tag className="h-3.5 w-3.5" />
                <span className="text-xs font-bold">Limited Time Offer 🔥</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-4 leading-tight">
                  Weekend Flash Sale
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed">
                  Get up to <span className="font-bold text-base sm:text-xl">50% OFF</span> on selected electronics and accessories. Hurry
                  before the deals expire!
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/90">
                  <Clock className="h-4 w-4" />
                  <span>Sale ends in:</span>
                </div>
                <div className="flex gap-2 items-center">
                  {[
                    { value: timeLeft.hours, label: "Hours" },
                    { value: timeLeft.minutes, label: "Mins" },
                    { value: timeLeft.seconds, label: "Secs" }
                  ].map((item, index) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-center shadow-md min-w-[54px] sm:min-w-[64px]">
                        <div className="text-lg sm:text-2xl font-black text-white">
                          {String(item.value).padStart(2, "0")}
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-white/80 font-bold uppercase tracking-tight">
                          {item.label}
                        </div>
                      </div>
                      {index < 2 && (
                        <span className="text-lg sm:text-xl font-bold text-white/80">:</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <Link href="/deals">
                  <Button size="sm" className="w-full sm:w-auto bg-white text-orange-600 hover:bg-gray-100 h-10 sm:h-12 px-6 rounded-xl shadow-lg font-extrabold text-xs sm:text-sm">
                    Shop Deals Now →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Product Grid */}
            <div className="relative mt-4 lg:mt-0">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                {[
                  { gradient: "from-orange-100 to-orange-300", discount: "50%" },
                  { gradient: "from-red-100 to-red-300", discount: "40%" },
                  { gradient: "from-yellow-100 to-yellow-300", discount: "35%" },
                  { gradient: "from-pink-100 to-pink-300", discount: "45%" }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className={`bg-white p-3 sm:p-4 rounded-2xl shadow-xl card-hover ${index % 2 === 1 ? 'mt-3 sm:mt-6' : ''}`}
                  >
                    <div className={`aspect-square bg-gradient-to-br ${item.gradient} rounded-xl mb-2 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                    </div>
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-extrabold text-[9px] sm:text-xs">
                      -{item.discount}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Floating Badge */}
              <div className="hidden sm:block absolute -top-4 -right-4 bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-5 py-2.5 rounded-2xl shadow-xl transform rotate-12 animate-float">
                <p className="text-xs font-extrabold">UP TO</p>
                <p className="text-2xl font-extrabold leading-none">50%</p>
                <p className="text-[10px] font-bold">OFF!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
