"use client";

import { 
  ShoppingBag, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle2,
  XCircle,
  RotateCcw,
  DollarSign,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  trend: "up" | "down";
}

function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  const isPositive = trend === "up";
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value.toLocaleString()}</h3>
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

export function OrderStatistics() {
  const stats = [
    { title: "Total Orders", value: 1847, change: 12.5, icon: <ShoppingBag className="h-6 w-6" />, trend: "up" as const },
    { title: "New Orders", value: 47, change: 8.2, icon: <Clock className="h-6 w-6" />, trend: "up" as const },
    { title: "Processing", value: 123, change: -3.1, icon: <Package className="h-6 w-6" />, trend: "down" as const },
    { title: "Ready to Ship", value: 89, change: 15.3, icon: <Package className="h-6 w-6" />, trend: "up" as const },
    { title: "Shipped", value: 234, change: 22.1, icon: <Truck className="h-6 w-6" />, trend: "up" as const },
    { title: "Delivered", value: 1289, change: 18.7, icon: <CheckCircle2 className="h-6 w-6" />, trend: "up" as const },
    { title: "Cancelled", value: 34, change: -12.4, icon: <XCircle className="h-6 w-6" />, trend: "down" as const },
    { title: "Returns", value: 23, change: -5.6, icon: <RotateCcw className="h-6 w-6" />, trend: "down" as const },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
