"use client";

import { DollarSign, Minus, Plus } from "lucide-react";

interface EarningsItem {
  label: string;
  amount: number;
  type: "add" | "subtract" | "neutral";
  description?: string;
}

export function EarningsBreakdown() {
  const items: EarningsItem[] = [
    { 
      label: "Order Amount", 
      amount: 125000, 
      type: "neutral",
      description: "Total customer payments"
    },
    { 
      label: "Marketplace Commission", 
      amount: -12500, 
      type: "subtract",
      description: "10% platform fee"
    },
    { 
      label: "Payment Processing Fee", 
      amount: -3125, 
      type: "subtract",
      description: "2.5% transaction fee"
    },
    { 
      label: "Shipping Revenue", 
      amount: 4560, 
      type: "add",
      description: "Customer shipping fees"
    },
    { 
      label: "Tax Deducted", 
      amount: -11250, 
      type: "subtract",
      description: "Sales tax collected"
    },
  ];

  const netEarnings = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Earnings Breakdown</h3>
        <p className="text-sm text-gray-600">How your earnings are calculated</p>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
                  item.type === "add" 
                    ? "bg-emerald-100 text-emerald-600"
                    : item.type === "subtract"
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"
                }`}>
                  {item.type === "add" ? (
                    <Plus className="h-4 w-4" />
                  ) : item.type === "subtract" ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <DollarSign className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  )}
                </div>
              </div>
              <div className="text-right ml-4">
                <p className={`text-lg font-semibold ${
                  item.type === "add"
                    ? "text-emerald-600"
                    : item.type === "subtract"
                    ? "text-red-600"
                    : "text-gray-900"
                }`}>
                  {item.amount < 0 ? "-" : item.type === "add" ? "+" : ""}
                  ${Math.abs(item.amount).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Net Earnings */}
        <div className="pt-4 mt-2 border-t-2 border-gray-200">
          <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-900">Your Net Earnings</p>
                <p className="text-xs text-emerald-700">Amount credited to your account</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-900">
                ${netEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-900">
          <span className="font-semibold">Note:</span> Earnings are calculated in real-time. 
          Final amounts may vary slightly due to currency conversion, refunds, or adjustments.
        </p>
      </div>
    </div>
  );
}
