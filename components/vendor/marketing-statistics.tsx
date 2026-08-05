"use client";

import { 
  Megaphone, 
  DollarSign, 
  Ticket,
  TrendingUp,
  Percent,
  Target,
  TrendingDown
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: "up" | "down";
  prefix?: string;
  suffix?: string;
}

function StatCard({ title, value, change, icon, trend, prefix = "", suffix = "" }: StatCardProps) {
  const isPositive = trend === "up";
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </h3>
          <div className="flex items-center gap-1 text-sm">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={isPositive ? "text-emerald-600" : "text-red-600"}>
              {Math.abs(change)}%
            </span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function MarketingStatistics() {
  const stats = [
    { 
      title: "Active Campaigns", 
      value: 12, 
      change: 20.0, 
      icon: <Megaphone className="h-6 w-6" />, 
      trend: "up" as const 
    },
    { 
      title: "Revenue from Promotions", 
      value: "$42.5K", 
      change: 28.5, 
      icon: <DollarSign className="h-6 w-6" />, 
      trend: "up" as const 
    },
    { 
      title: "Coupon Redemptions", 
      value: 1234, 
      change: 15.3, 
      icon: <Ticket className="h-6 w-6" />, 
      trend: "up" as const 
    },
    { 
      title: "Conversion Rate", 
      value: "6.8%", 
      change: 12.1, 
      icon: <Percent className="h-6 w-6" />, 
      trend: "up" as const 
    },
    { 
      title: "Average Discount", 
      value: "18.5%", 
      change: -5.2, 
      icon: <Percent className="h-6 w-6" />, 
      trend: "down" as const 
    },
    { 
      title: "Campaign ROI", 
      value: "385%", 
      change: 22.7, 
      icon: <Target className="h-6 w-6" />, 
      trend: "up" as const 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
