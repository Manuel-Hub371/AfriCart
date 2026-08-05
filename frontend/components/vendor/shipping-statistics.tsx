"use client";

import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: "up" | "down";
  prefix?: string;
  suffix?: string;
  status?: "success" | "warning" | "danger" | "info";
}

function StatCard({ title, value, change, icon, trend, prefix = "", suffix = "", status = "info" }: StatCardProps) {
  const statusColors = {
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-yellow-50 text-yellow-600",
    danger: "bg-red-50 text-red-600",
    info: "bg-blue-50 text-blue-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </h3>
          {change !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={trend === "up" ? "text-emerald-600" : "text-red-600"}>
                {Math.abs(change)}%
              </span>
              <span className="text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${statusColors[status]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function ShippingStatistics() {
  const stats = [
    { 
      title: "Awaiting Shipment", 
      value: 24, 
      change: -8.3,
      icon: <Package className="h-6 w-6" />, 
      trend: "down" as const,
      status: "warning" as const
    },
    { 
      title: "In Transit", 
      value: 156, 
      change: 12.5,
      icon: <Truck className="h-6 w-6" />, 
      trend: "up" as const,
      status: "info" as const
    },
    { 
      title: "Delivered", 
      value: 2847, 
      change: 18.2,
      icon: <CheckCircle className="h-6 w-6" />, 
      trend: "up" as const,
      status: "success" as const
    },
    { 
      title: "Avg Delivery Time", 
      value: "3.2 days", 
      change: -10.5,
      icon: <Clock className="h-6 w-6" />, 
      trend: "down" as const,
      status: "info" as const
    },
    { 
      title: "Shipping Revenue", 
      value: "$12,450", 
      change: 22.8,
      icon: <DollarSign className="h-6 w-6" />, 
      trend: "up" as const,
      status: "success" as const
    },
    { 
      title: "Failed Deliveries", 
      value: 8, 
      change: 15.2,
      icon: <AlertTriangle className="h-6 w-6" />, 
      trend: "up" as const,
      status: "danger" as const
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
