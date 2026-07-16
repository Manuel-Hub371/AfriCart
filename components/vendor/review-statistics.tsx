"use client";

import { 
  Star, 
  MessageSquare, 
  Clock,
  AlertTriangle,
  CheckCircle,
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

export function ReviewStatistics() {
  const stats = [
    { 
      title: "Total Reviews", 
      value: 2847, 
      change: 15.3, 
      icon: <MessageSquare className="h-6 w-6" />, 
      trend: "up" as const 
    },
    { 
      title: "Average Rating", 
      value: "4.6", 
      change: 8.2, 
      icon: <Star className="h-6 w-6" />, 
      trend: "up" as const 
    },
    { 
      title: "5-Star Reviews", 
      value: 1936, 
      change: 22.1, 
      icon: <Star className="h-6 w-6" />, 
      trend: "up" as const 
    },
    { 
      title: "Pending Replies", 
      value: 47, 
      change: -12.5, 
      icon: <Clock className="h-6 w-6" />, 
      trend: "down" as const 
    },
    { 
      title: "Reported Reviews", 
      value: 12, 
      change: -5.7, 
      icon: <AlertTriangle className="h-6 w-6" />, 
      trend: "down" as const 
    },
    { 
      title: "Response Rate", 
      value: "94%", 
      change: 6.3, 
      icon: <CheckCircle className="h-6 w-6" />, 
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
