import { Store, CheckCircle2, ShoppingBag, Package, TrendingUp, ArrowRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HIGHLIGHTS = [
  { icon: ShoppingBag, text: "Reach more shoppers" },
  { icon: Package, text: "Showcase your products" },
  { icon: TrendingUp, text: "Grow your business" },
];

export function VendorCTA() {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white to-green-50/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-10 items-center">
          {/* Left: Copy */}
          <div className="space-y-4 sm:space-y-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold">
              <Store className="h-3.5 w-3.5 mr-1.5" />
              Grow Your Business
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Turn Your Products Into Your{" "}
              <span className="text-gradient">Next Customer</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium max-w-lg">
              Reach more shoppers, showcase your products, and grow your business with AfriCart.
            </p>

            <ul className="space-y-2.5 sm:space-y-3">
              {HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.text} className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-gray-800">{item.text}</span>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link href="/auth/register?type=vendor">
                <Button className="w-full sm:w-auto gradient-primary text-white shadow-md hover:shadow-lg transition-all duration-300 h-11 sm:h-12 px-6 rounded-xl font-bold text-sm">
                  Become a Vendor
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/profile/become-vendor">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border border-green-200 hover:border-green-300 hover:bg-green-50 h-11 sm:h-12 px-6 rounded-xl font-bold text-sm"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Storefront Visual */}
          <div className="relative lg:pl-6">
            <div className="relative bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-900 rounded-3xl shadow-2xl p-5 sm:p-8 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-12 -left-6 w-56 h-56 bg-emerald-400/20 rounded-full blur-2xl"></div>

              <div className="relative space-y-4">
                {/* Store card */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                    A
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm sm:text-base truncate">Your Store on AfriCart</p>
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-200">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      <span className="truncate">Verified vendor</span>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="h-3 w-3" />
                    Approved
                  </span>
                </div>

                {/* Product tiles */}
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`bg-white/10 border border-white/15 rounded-xl p-2.5 sm:p-3 ${
                        i === 1 ? "translate-y-2 sm:translate-y-3" : ""
                      }`}
                    >
                      <div className="aspect-square rounded-lg bg-gradient-to-br from-emerald-300/70 to-teal-400/70 mb-2 relative overflow-hidden">
                        <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-white absolute inset-0 m-auto opacity-80" />
                      </div>
                      <div className="h-1.5 bg-white/30 rounded-full w-3/4 mb-1.5"></div>
                      <div className="h-1.5 bg-white/20 rounded-full w-1/2"></div>
                    </div>
                  ))}
                </div>

                {/* Capabilities strip */}
                <div className="flex items-center justify-between bg-emerald-500/25 border border-emerald-300/25 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-emerald-100" />
                    <p className="text-[11px] sm:text-xs text-white font-bold">List your products</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-100" />
                    <p className="text-[11px] sm:text-xs text-white font-bold">Track orders & analytics</p>
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