import { BadgeCheck, Sparkles, Star, Truck, Tag, Store } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/home/section-header";

const FEATURES = [
  {
    icon: BadgeCheck,
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    title: "Verified Vendors",
    description:
      "Every store is reviewed and approved before it goes live, so you can shop with confidence.",
  },
  {
    icon: Sparkles,
    iconBg: "bg-gradient-to-br from-indigo-500 to-blue-600",
    title: "Curated Product Range",
    description:
      "Browse an organised catalogue spanning electronics, fashion, home, beauty, groceries and more.",
  },
  {
    icon: Star,
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
    title: "Transparent Ratings",
    description:
      "Check star ratings and honest reviews on every product page before you decide.",
  },
  {
    icon: Truck,
    iconBg: "bg-gradient-to-br from-sky-500 to-cyan-600",
    title: "Flexible Delivery Options",
    description:
      "Vendors publish clear shipping terms, so you always know how your order reaches you.",
  },
  {
    icon: Tag,
    iconBg: "bg-gradient-to-br from-rose-500 to-pink-600",
    title: "Genuine Marketplace Deals",
    description:
      "Live vendor promotions and discounts are shown directly on listings, with no hidden markups.",
  },
  {
    icon: Store,
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    title: "Discover Local Businesses",
    description:
      "Shop directly from regional vendors and support businesses across Africa.",
  },
];

export function WhyChooseAfriCart() {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white via-green-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Why AfriCart"
          title={<>Why Choose <span className="text-gradient">AfriCart</span></>}
          subtitle="Everything you need to discover great products, trusted stores, and better shopping experiences in one place."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group relative bg-white border border-gray-200/80 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 rounded-2xl p-5 sm:p-7"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0`}>
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-gray-900 text-sm sm:text-lg mb-1 sm:mb-1.5">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}