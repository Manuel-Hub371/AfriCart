import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Store, CheckCircle, Shield, TrendingUp } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Branding & Info */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-2xl">A</span>
              </div>
              <span className="text-3xl font-bold text-gradient">AfriCart</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Welcome to Your Marketplace
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Shop from thousands of trusted sellers or start your own business and reach millions of customers across Africa.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-gray-700">Secure payments & buyer protection</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-gray-700">Verified sellers & quality products</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-gray-700">Fast delivery & easy returns</p>
              </div>
            </div>
          </div>

          {/* Right: Auth Options */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h2>
                <p className="text-gray-600">Choose how you want to continue</p>
              </div>

              {/* Sign In Option */}
              <div className="space-y-4">
                <Link href="/auth/login" className="block">
                  <Button 
                    size="lg" 
                    className="w-full gradient-primary text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 h-14 text-base rounded-xl"
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Sign In to Your Account
                  </Button>
                </Link>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <Link href="/auth/register" className="block">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full border-2 border-green-200 hover:border-green-300 hover:bg-green-50 h-14 text-base rounded-xl transition-all duration-300"
                  >
                    Create New Account
                  </Button>
                </Link>
              </div>

              {/* Separator */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm font-semibold text-gray-700">For Business</span>
                </div>
              </div>

              {/* Vendor Option */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Store className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Start Selling</h3>
                    <p className="text-sm text-gray-600">
                      Join thousands of successful vendors and grow your business with AfriCart
                    </p>
                  </div>
                </div>
                <Link href="/auth/register?type=vendor" className="block">
                  <Button 
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-12 rounded-xl shadow-lg"
                  >
                    Become a Vendor
                  </Button>
                </Link>
              </div>

              {/* Footer Note */}
              <p className="text-xs text-center text-gray-500 pt-4">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-green-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-green-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
