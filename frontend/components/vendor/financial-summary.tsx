"use client";

import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface FinancialItem {
  label: string;
  amount: number;
  isPositive?: boolean;
}

export function FinancialSummary() {
  const financials: FinancialItem[] = [
    { label: "Gross Sales", amount: 148245, isPositive: true },
    { label: "Discounts", amount: -8950, isPositive: false },
    { label: "Refunds", amount: -3420, isPositive: false },
    { label: "Marketplace Commission", amount: -14825, isPositive: false },
    { label: "Shipping Revenue", amount: 4560, isPositive: true },
    { label: "Taxes", amount: -11859, isPositive: false },
  ];

  const netProfit = financials.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Financial Summary</h3>
        <p className="text-sm text-gray-600">Revenue breakdown and estimated profit</p>
      </div>

      <div className="space-y-4">
        {financials.map((item) => (
          <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-sm text-gray-700">{item.label}</span>
            <span className={`text-sm font-semibold ${
              item.isPositive === false ? "text-red-600" : "text-gray-900"
            }`}>
              {item.amount < 0 ? "-" : ""}${Math.abs(item.amount).toLocaleString()}
            </span>
          </div>
        ))}

        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
          <span className="text-base font-semibold text-gray-900">Net Profit (Estimated)</span>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <span className="text-lg font-bold text-emerald-600">
              ${netProfit.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="h-5 w-5 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-900">Profit Margin</span>
        </div>
        <div className="text-2xl font-bold text-emerald-700">
          {((netProfit / financials[0].amount) * 100).toFixed(1)}%
        </div>
        <p className="text-xs text-emerald-700 mt-1">
          +2.3% vs last period
        </p>
      </div>
    </div>
  );
}
