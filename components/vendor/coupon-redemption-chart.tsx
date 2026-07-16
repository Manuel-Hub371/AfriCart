"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { coupon: "SUMMER20", redemptions: 234, revenue: 12400 },
  { coupon: "FREESHIP", redemptions: 189, revenue: 8900 },
  { coupon: "WELCOME15", redemptions: 156, revenue: 6700 },
  { coupon: "FLASH30", redemptions: 142, revenue: 11200 },
  { coupon: "BUNDLE25", redemptions: 98, revenue: 5400 },
];

export function CouponRedemptionChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Top Performing Coupons</h3>
        <p className="text-sm text-gray-600">Most redeemed discount codes this month</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="coupon" 
            tick={{ fill: "#6b7280", fontSize: 12 }}
            stroke="#e5e7eb"
          />
          <YAxis 
            tick={{ fill: "#6b7280", fontSize: 12 }}
            stroke="#e5e7eb"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Bar 
            dataKey="redemptions" 
            fill="#10b981" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
