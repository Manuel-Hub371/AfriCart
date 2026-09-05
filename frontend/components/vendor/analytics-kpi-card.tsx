"use client";

import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

interface AnalyticsKpiCardProps {
  title: string;
  value: string | number;
  previousValue?: number;
  change: number;
  icon: LucideIcon;
  trend: "up" | "down";
  prefix?: string;
  suffix?: string;
  sparklineData?: Array<{ value: number }>;
}

export function AnalyticsKpiCard({
  title,
  value,
  previousValue,
  change,
  icon: Icon,
  trend,
  prefix = "",
  suffix = "",
  sparklineData,
}: AnalyticsKpiCardProps) {
  const isPositive = trend === "up";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
        }`}>
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {Math.abs(change)}%
        </div>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        {previousValue && (
          <p className="text-sm text-gray-500 mt-1">
            vs {previousValue.toLocaleString()} last period
          </p>
        )}
      </div>

      {sparklineData && (
        <div className="h-12 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
