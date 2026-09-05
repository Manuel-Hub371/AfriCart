"use client";

import { 
  Users, 
  UserPlus, 
  Repeat, 
  Crown,
  DollarSign,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: "up" | "down";
  prefix?: string;
}

function StatCard({ title, value, change, icon, trend, prefix = "" }: StatCardProps) {
  const isPositive = trend === "up";
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
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

export function CustomerStatistics() {
  const stats = [
    { 
      title: "Total Customers", 
      value: 2847, 
      change: 12.5, 
      icon: <Users className="h-6 w-6" />, 
      trend: "up" as const 
    },
    { 
      title: "New Customers", 
      value: 156, 
      change: 8.2, 
      icon: <UserPlus className="h-6 w-6" />, 
      trend: "up" as const 
    },
    { 
      title: "Returning Customers", 
      value: 2234, 
      change: 15.3, 
      icon: <Repeat className="h-6 w-6" />, 
      trend: "up" as const 
    },
    { 
      title: "VIP Customers", 
      value: 457, 
      change: 22.1, 
      icon: <Crown className="h-6 w-6" />, 
      trend: "up" as const 
    },
    { 
      title: "Avg Order Value", 
      value: "$125.50", 
      change: 5.7, 
      icon: <DollarSign className="h-6 w-6" />, 
      trend: "up" as const 
    },
    { 
      title: "Customer Lifetime Value", 
      value: "$847", 
      change: 18.9, 
      icon: <TrendingUp className="h-6 w-6" />, 
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
