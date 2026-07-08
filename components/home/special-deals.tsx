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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl overflow-hidden border border-orange-200">
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
            {/* Left: Content */}
            <div className="space-y-6">
              <Badge className="bg-orange-500 text-white">
                <Tag className="h-3 w-3 mr-1" />
                Limited Time Offer
              </Badge>

              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Weekend Flash Sale
                </h2>
                <p className="text-lg text-gray-600">
                  Get up to 50% off on selected electronics and accessories. Hurry
                  before the deals expire!
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-4">
                <Clock className="h-6 w-6 text-orange-600" />
                <div className="flex gap-2">
                  <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-gray-900">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-gray-500">Hours</div>
                  </div>
                  <div className="flex items-center text-2xl font-bold text-gray-900">
                    :
                  </div>
                  <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-gray-900">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-gray-500">Minutes</div>
                  </div>
                  <div className="flex items-center text-2xl font-bold text-gray-900">
                    :
                  </div>
                  <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-gray-900">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-gray-500">Seconds</div>
                  </div>
                </div>
              </div>

              <Link href="/deals">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                  Shop Now
                </Button>
              </Link>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <div className="aspect-square bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg mb-2"></div>
                    <Badge className="bg-orange-500 text-white text-xs">
                      -50%
                    </Badge>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <div className="aspect-square bg-gradient-to-br from-red-100 to-red-200 rounded-lg mb-2"></div>
                    <Badge className="bg-red-500 text-white text-xs">
                      -40%
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <div className="aspect-square bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg mb-2"></div>
                    <Badge className="bg-yellow-600 text-white text-xs">
                      -35%
                    </Badge>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg mb-2"></div>
                    <Badge className="bg-pink-500 text-white text-xs">
                      -45%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
