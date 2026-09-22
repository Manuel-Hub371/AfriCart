import { Package, Store, Users, MessageSquare, TrendingUp } from "lucide-react";

interface MarketplaceStatsProps {
  statistics: Record<string, number> | null;
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString("en-US");
}

export function MarketplaceStats({ statistics }: MarketplaceStatsProps) {
  const hasStats = statistics && (
    (statistics.totalProducts || 0) +
    (statistics.totalStores || 0) +
    (statistics.totalCustomers || 0) +
    (statistics.totalReviews || 0)
  ) > 0;

  const metrics = [
    {
      icon: Package,
      label: "Active Products",
      value: statistics?.totalProducts ?? 0,
    },
    {
      icon: Store,
      label: "Active Stores",
      value: statistics?.totalStores ?? 0,
    },
    {
      icon: Users,
      label: "Registered Shoppers",
      value: statistics?.totalCustomers ?? 0,
    },
    {
      icon: MessageSquare,
      label: "Customer Reviews",
      value: statistics?.totalReviews ?? 0,
    },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block mb-2 sm:mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs sm:text-sm font-bold">
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
              Marketplace Snapshot
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
            A Marketplace Built on <span className="text-gradient">Real Activity</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-emerald-100/80 mt-2 sm:mt-3 max-w-2xl mx-auto font-medium">
            Live numbers from the AfriCart marketplace — products, stores, shoppers and reviews,
            updated as the community grows.
          </p>
        </div>

        {hasStats ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 sm:p-7 text-center hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="w-11 h-11 sm:w-14 sm:h-14 mx-auto rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mb-3 sm:mb-4">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-300" />
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">
                    {formatNumber(metric.value)}
                  </div>
                  <p className="text-[11px] sm:text-sm text-emerald-100/80 font-semibold">
                    {metric.label}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <Package className="h-10 w-10 text-emerald-300/50 mx-auto mb-3" />
            <p className="text-sm sm:text-base text-emerald-100/80 font-medium">
              AfriCart is a young marketplace — live statistics will appear here as
              products, stores and shoppers join.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}