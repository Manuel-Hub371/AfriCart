import { Button } from "@/components/ui/button";
import { ShoppingBag, Store, Sparkles, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-8 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 shadow-sm">
              <Sparkles className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">Trusted by 10,000+ shoppers</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
              Discover{" "}
              <span className="text-gradient">Everything</span>
              <br />You Need
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl">
              Shop from trusted sellers, explore thousands of products, and enjoy a seamless shopping experience with exclusive deals.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-3xl font-bold text-gray-900">50K+</span>
                </div>
                <p className="text-sm text-gray-600">Products</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Store className="h-5 w-5 text-green-600" />
                  <span className="text-3xl font-bold text-gray-900">500+</span>
                </div>
                <p className="text-sm text-gray-600">Verified Stores</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-5 w-5 text-green-600" />
                  <span className="text-3xl font-bold text-gray-900">24/7</span>
                </div>
                <p className="text-sm text-gray-600">Support</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/products">
                <Button size="lg" className="gradient-primary text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 h-14 px-8 text-base rounded-xl">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Shop Now
                </Button>
              </Link>
              <Link href="/stores">
                <Button size="lg" variant="outline" className="border-2 border-green-200 hover:border-green-300 hover:bg-green-50 h-14 px-8 text-base rounded-xl transition-all duration-300">
                  <Store className="h-5 w-5 mr-2" />
                  Explore Stores
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Product Cards Grid */}
          <div className="relative lg:pl-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 animate-slide-up">
                <div className="group bg-white p-5 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 card-hover cursor-pointer">
                  <div className="w-full h-36 bg-gradient-to-br from-green-100 via-green-200 to-green-300 rounded-2xl mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-green-500/20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-3 bg-green-200 rounded-full w-1/3"></div>
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ShoppingBag className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="group bg-white p-5 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 card-hover cursor-pointer">
                  <div className="w-full h-36 bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300 rounded-2xl mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-emerald-500/20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-3 bg-indigo-200 rounded-full w-1/3"></div>
                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ShoppingBag className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="group bg-white p-5 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 card-hover cursor-pointer">
                  <div className="w-full h-36 bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 rounded-2xl mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-pink-500/20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-3 bg-pink-200 rounded-full w-1/3"></div>
                      <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ShoppingBag className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="group bg-white p-5 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 card-hover cursor-pointer">
                  <div className="w-full h-36 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 rounded-2xl mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-amber-500/20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-3 bg-amber-200 rounded-full w-1/3"></div>
                      <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ShoppingBag className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-orange-400 to-red-500 text-white px-6 py-3 rounded-2xl shadow-xl transform rotate-3 animate-float">
              <p className="text-sm font-bold">50% OFF</p>
              <p className="text-xs">This Week!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
