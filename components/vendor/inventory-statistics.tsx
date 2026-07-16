"use client";

import { 
  Package, 
  AlertTriangle, 
  XCircle, 
  Clock,
  Lock,
  TrendingUp,
  TrendingDown,
  DollarSign
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

export function InventoryStatistics() {
  const stats = [
    { 
      title: "Total Products", 
      value: 1245, 
      change: 8.2, 
      icon: <Package className="h-6 w-6" />, 
      trend: "up" as const 
    },
    { 
      title: "Total Stock Units", 
      value: 45678, 
      change: 12.5, 
      icon: <Package className="h-6 w-6" />, 
      trend: "up" as const 
    },
    { 
      title: "Low Stock Products", 
      value: 46, 
      change: -15.3, 
      icon: <AlertTriangle className="h-6 w-6" />, 
      trend: "down" as const 
    },
    { 
      title: "Out of Stock", 
      value: 23, 
      change: -22.1, 
      icon: <XCircle className="h-6 w-6" />, 
      trend: "down" as const 
    },
    { 
      title: "Reserved Stock", 
      value: 1234, 
      change: 5.7, 
      icon: <Lock className="h-6 w-6" />, 
      trend: "up" as const 
    },
    { 
      title: "Incoming Stock", 
      value: 2890, 
      change: 18.9, 
      icon: <Clock className="h-6 w-6" />, 
      trend: "up" as const 
    },
    { 
      title: "Inventory Value", 
      value: "567K", 
      change: 14.3, 
      icon: <DollarSign className="h-6 w-6" />, 
      trend: "up" as const,
      prefix: "$"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
