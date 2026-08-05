import { Package, CheckCircle, FileText, AlertCircle, AlertTriangle, Archive, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down";
  };
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

function StatCard({ title, value, change, icon, iconBg, iconColor }: StatCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white cursor-pointer group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
          <div className={iconColor}>{icon}</div>
        </div>
        {change && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50">
            {change.trend === "up" ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-600" />
            )}
            <span
              className={`text-xs font-semibold ${
                change.trend === "up" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {change.value}
            </span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        {change && (
          <p className="text-xs text-gray-500 mt-1">vs last month</p>
        )}
      </div>
    </Card>
  );
}

export function StatisticsCards() {
  const stats = [
    {
      title: "Total Products",
      value: 1245,
      change: { value: "+15", trend: "up" as const },
      icon: <Package className="h-6 w-6" />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Products",
      value: 1089,
      change: { value: "+12", trend: "up" as const },
      icon: <CheckCircle className="h-6 w-6" />,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Draft Products",
      value: 87,
      change: { value: "+8", trend: "up" as const },
      icon: <FileText className="h-6 w-6" />,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    {
      title: "Out of Stock",
      value: 23,
      change: { value: "-5", trend: "down" as const },
      icon: <AlertCircle className="h-6 w-6" />,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Low Stock",
      value: 46,
      icon: <AlertTriangle className="h-6 w-6" />,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Archived",
      value: 69,
      icon: <Archive className="h-6 w-6" />,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
