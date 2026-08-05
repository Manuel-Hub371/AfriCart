import { CheckCircle, Shield, TrendingUp, Store } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left: Branding & Info - Fixed/Sticky */}
          <div className="hidden lg:flex flex-col justify-center p-8 lg:p-12 sticky top-0 h-screen">
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

              {/* Optional: Decorative Product Cards */}
              <div className="hidden xl:block">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl shadow-lg card-hover">
                    <div className="w-full h-24 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl mb-3"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-lg card-hover mt-6">
                    <div className="w-full h-24 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-xl mb-3"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form Content - Scrollable */}
          <div className="flex items-center justify-center p-4 lg:p-8 min-h-screen">
            <div className="w-full py-12">
              {/* Mobile: Show branding at top */}
              <div className="lg:hidden mb-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                  <span className="text-2xl font-bold text-gradient">AfriCart</span>
                </div>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
