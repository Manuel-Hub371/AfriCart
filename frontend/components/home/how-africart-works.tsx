import { Search, ShoppingBag, Package, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/home/section-header";

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Discover",
    description: "Explore products and stores from across AfriCart by category, store, or search.",
  },
  {
    number: "02",
    icon: ShoppingBag,
    title: "Order",
    description: "Choose what you want, add it to your cart, and checkout securely.",
  },
  {
    number: "03",
    icon: Package,
    title: "Receive",
    description: "Get your order through the available delivery process arranged by the vendor.",
  },
];

export function HowAfriCartWorks() {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="How It Works"
          title={<>From Discovery to Delivery, <span className="text-gradient">Made Simple</span></>}
          subtitle="Shopping on AfriCart is designed to be straightforward — three steps from first find to final delivery."
        />

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[16%] right-[16%] h-px bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200">
            <span className="absolute inset-x-0 mx-auto top-0 w-2 h-2 -translate-y-1/2 bg-emerald-400 rounded-full hidden"></span>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.number}
                  className="relative bg-white border border-gray-200/80 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 rounded-2xl p-6 sm:p-8 text-center"
                >
                  {index > 0 && (
                    <div className="md:hidden flex justify-center -mt-4 mb-4 text-emerald-500">
                      <ArrowDown className="h-5 w-5" />
                    </div>
                  )}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md mb-4 sm:mb-5">
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="text-emerald-600 font-black text-xs tracking-widest mb-1.5">
                    STEP {step.number}
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-lg sm:text-xl mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}