import { Smartphone, Bell, MapPin, ShoppingBag, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppDownloadCTA() {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Phone mockup */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative">
              <div className="w-52 sm:w-60 h-[22rem] sm:h-[26rem] rounded-[2.5rem] bg-gray-900 border-4 border-gray-800 shadow-2xl p-2.5 relative overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-b-2xl z-10"></div>

                {/* Screen content */}
                <div className="w-full h-full rounded-[2rem] bg-gradient-to-b from-emerald-50 to-white p-3.5 pt-7 flex flex-col gap-3 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 gradient-primary rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">AfriCart</span>
                  </div>

                  {/* Search placeholder */}
                  <div className="bg-white border border-gray-200 rounded-lg h-7 flex items-center px-2 text-[10px] text-gray-400">
                    Search products...
                  </div>

                  {/* Product tiles */}
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-lg p-1.5">
                        <div className="aspect-square rounded-md bg-gradient-to-br from-emerald-100 to-emerald-200 mb-1.5"></div>
                        <div className="h-1.5 bg-gray-200 rounded-full w-3/4 mb-1"></div>
                        <div className="h-1.5 bg-emerald-400/60 rounded-full w-1/2"></div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom bar */}
                  <div className="flex items-center justify-around py-2 border-t border-gray-200 bg-white -mx-3.5 -mb-3.5 rounded-b-2xl">
                    <ShoppingBag className="h-4 w-4 text-emerald-600" />
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <PackageCheck className="h-4 w-4 text-gray-400" />
                    <Bell className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="hidden sm:flex absolute -right-4 top-10 bg-white border border-emerald-100 shadow-xl rounded-2xl px-4 py-2.5 items-center gap-2 animate-float">
                <Smartphone className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-extrabold text-gray-900">Coming Soon</span>
              </div>
            </div>
          </div>

          {/* Right: Copy */}
          <div className="space-y-4 sm:space-y-5 order-1 lg:order-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-xs sm:text-sm font-bold">
              <Smartphone className="h-3.5 w-3.5 mr-1.5" />
              Mobile
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              AfriCart, <span className="text-gradient">Wherever You Shop</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium max-w-lg">
              A native AfriCart app for Android and iOS isn&apos;t available yet. We&apos;re
              bringing the full marketplace to your phone so you can discover products, save
              favourites and follow orders on the go.
            </p>

            <ul className="space-y-2.5">
              {[
                { icon: ShoppingBag, text: "Browse products and stores from anywhere" },
                { icon: MapPin, text: "Discover vendors near you" },
                { icon: PackageCheck, text: "Keep track of your orders" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.text} className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-gray-800">{item.text}</span>
                  </li>
                );
              })}
            </ul>

            <div className="pt-1">
              <a href="#newsletter">
                <Button
                  variant="outline"
                  className="border border-green-200 hover:border-green-300 hover:bg-green-50 h-11 sm:h-12 px-6 rounded-xl font-bold text-sm"
                >
                  <Bell className="h-4 w-4" />
                  Notify me when it launches
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}