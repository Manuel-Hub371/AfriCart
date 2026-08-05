"use client";

import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface FinanceSummaryCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down";
  icon: LucideIcon;
  description?: string;
  prefix?: string;
  suffix?: string;
  highlight?: boolean;
}

export function FinanceSummaryCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  description,
  prefix = "$",
  suffix = "",
  highlight = false,
}: FinanceSummaryCardProps) {
  const formattedValue = typeof value === "number" ? value.toLocaleString() : value;
  
  return (
    <div className={`rounded-xl border p-6 hover:shadow-md transition-shadow ${
      highlight 
        ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200" 
        : "bg-white border-gray-200"
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className={`text-sm font-medium mb-1 ${
            highlight ? "text-emerald-700" : "text-gray-600"
          }`}>
            {title}
          </p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          highlight 
            ? "bg-emerald-600 text-white" 
            : "bg-emerald-50 text-emerald-600"
        }`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="mb-2">
        <h3 className={`text-3xl font-bold ${
          highlight ? "text-emerald-900" : "text-gray-900"
        }`}>
          {prefix}{formattedValue}{suffix}
        </h3>
      </div>

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
          <span className="text-gray-500">vs last period</span>
        </div>
      )}
    </div>
  );
}
