import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DashboardCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  iconColor?: string;
  iconBg?: string;
}

export default function DashboardCard({
  icon: Icon,
  label,
  value,
  change,
  iconColor = "text-emerald-600",
  iconBg = "bg-emerald-100",
}: DashboardCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div
              className={`flex items-center gap-1 text-sm ${
                change.type === "increase"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {change.type === "increase" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{Math.abs(change.value)}%</span>
              <span className="text-gray-600">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
}
