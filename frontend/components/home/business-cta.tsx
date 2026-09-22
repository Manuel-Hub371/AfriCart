import { Store, ArrowRight, ShoppingBag, BadgeCheck, LineChart, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const STEPS = [
  {
    title: "Create your store",
    description: "Set up store details, branding and your product catalogue.",
    icon: Store,
  },
  {
    title: "Verify your business",
    description: "Complete vendor verification so shoppers trust your store.",
    icon: BadgeCheck,
  },
  {
    title: "Publish your products",
    description: "List items with images, pricing and delivery terms.",
    icon: ShoppingBag,
  },
  {
    title: "Track orders & growth",
    description: "Use the vendor dashboard to manage sales, reviews and analytics.",
    icon: LineChart,
  },
];

export function BusinessCTA() {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center">
          {/* Left: Copy */}
          <div className="space-y-4 sm:space-y-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold">
              <Store className="h-3.5 w-3.5 mr-1.5" />
              Vendor Opportunity
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Your Store Deserves{" "}
              <span className="text-gradient">More Visibility</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium max-w-lg">
              Put your products in front of shoppers discovering what to buy next.
              AfriCart gives your business a storefront on a growing marketplace.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link href="/auth/register?type=vendor">
                <Button className="w-full sm:w-auto gradient-primary text-white shadow-md hover:shadow-lg transition-all duration-300 h-11 sm:h-12 px-6 rounded-xl font-bold text-sm">
                  Start Selling on AfriCart
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/profile/become-vendor">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border border-green-200 hover:border-green-300 hover:bg-green-50 h-11 sm:h-12 px-6 rounded-xl font-bold text-sm"
                >
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Steps panel */}
          <div className="relative bg-gradient-to-br from-emerald-50 via-white to-green-50 border border-green-100 rounded-3xl p-5 sm:p-8">
            <h3 className="font-extrabold text-gray-900 text-base sm:text-lg mb-4 sm:mb-6">
              Get your store live
            </h3>
            <ol className="space-y-4 sm:space-y-5">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.title} className="flex items-start gap-4">
                    <div className="relative flex flex-col items-center">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-emerald-200 shadow-sm flex items-center justify-center text-emerald-700 shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      {index < STEPS.length - 1 && (
                        <span className="hidden sm:block w-px flex-1 bg-emerald-200 my-1 min-h-4"></span>
                      )}
                    </div>
                    <div className="pt-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-emerald-600 tracking-wider">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">{step.title}</h4>
                        <CircleCheck className="h-4 w-4 text-emerald-500 ml-auto sm:ml-1" />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}