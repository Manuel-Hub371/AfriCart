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
    <section className="section-padding bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-3xl overflow-hidden shadow-2xl">
          {/* Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6bTAgMjhjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

          <div className="relative grid lg:grid-cols-2 gap-12 p-8 md:p-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8 text-white">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
                <Tag className="h-4 w-4" />
                <span className="text-sm font-bold">Limited Time Offer 🔥</span>
              </div>

              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                  Weekend Flash Sale
                </h2>
                <p className="text-xl text-white/90 leading-relaxed">
                  Get up to <span className="font-bold text-2xl">50% OFF</span> on selected electronics and accessories. Hurry
                  before the deals expire!
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6" />
                  <span className="text-lg font-semibold">Sale ends in:</span>
                </div>
                <div className="flex gap-3">
                  {[
                    { value: timeLeft.hours, label: "Hours" },
                    { value: timeLeft.minutes, label: "Minutes" },
                    { value: timeLeft.seconds, label: "Seconds" }
                  ].map((item, index) => (
                    <div key={item.label}>
                      <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-5 py-4 rounded-2xl shadow-xl">
                        <div className="text-4xl font-extrabold">
                          {String(item.value).padStart(2, "0")}
                        </div>
                        <div className="text-xs text-white/80 font-semibold mt-1">
                          {item.label}
                        </div>
                      </div>
                      {index < 2 && (
                        <div className="flex items-center justify-center text-3xl font-bold mx-2 h-full">
                          :
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/deals">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-50 h-14 px-10 rounded-xl shadow-2xl font-bold text-base hover:scale-105 transition-all duration-300">
                  Shop Deals Now →
                </Button>
              </Link>
            </div>

            {/* Right: Product Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { gradient: "from-orange-100 to-orange-300", discount: "50%" },
                  { gradient: "from-red-100 to-red-300", discount: "40%" },
                  { gradient: "from-yellow-100 to-yellow-300", discount: "35%" },
                  { gradient: "from-pink-100 to-pink-300", discount: "45%" }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className={`bg-white p-5 rounded-3xl shadow-2xl card-hover ${index % 2 === 1 ? 'mt-8' : ''}`}
                  >
                    <div className={`aspect-square bg-gradient-to-br ${item.gradient} rounded-2xl mb-3 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                    </div>
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg">
                      -{item.discount}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-3xl shadow-2xl transform rotate-12 animate-float">
                <p className="text-2xl font-extrabold">UP TO</p>
                <p className="text-4xl font-extrabold">50%</p>
                <p className="text-sm font-bold">OFF!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
