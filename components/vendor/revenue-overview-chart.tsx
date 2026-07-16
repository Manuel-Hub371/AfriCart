"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Generate deterministic 30-day revenue data
const data = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  return {
    day: `Day ${day}`,
    current: 3000 + ((day * 123 + 456) % 2000) + (day * 50),
    previous: 2800 + ((day * 98 + 321) % 1800) + (day * 40),
  };
});

export function RevenueOverviewChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Revenue Overview</h3>
        <p className="text-sm text-gray-600">Daily revenue comparison - Current vs Previous Period</p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="day" 
            tick={{ fill: "#6b7280", fontSize: 12 }}
            stroke="#e5e7eb"
            interval={4}
          />
          <YAxis 
            tick={{ fill: "#6b7280", fontSize: 12 }}
            stroke="#e5e7eb"
            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number) => `$${value.toLocaleString()}`}
          />
          <Legend 
            wrapperStyle={{ fontSize: "12px" }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="current" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={false}
            name="Current Period"
          />
          <Line 
            type="monotone" 
            dataKey="previous" 
            stroke="#94a3b8" 
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
            name="Previous Period"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
