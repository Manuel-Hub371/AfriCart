"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { date: "Jul 1", revenue: 4200, orders: 42, conversions: 156 },
  { date: "Jul 2", revenue: 3800, orders: 38, conversions: 142 },
  { date: "Jul 3", revenue: 5100, orders: 51, conversions: 189 },
  { date: "Jul 4", revenue: 4500, orders: 45, conversions: 167 },
  { date: "Jul 5", revenue: 6200, orders: 62, conversions: 223 },
  { date: "Jul 6", revenue: 5500, orders: 55, conversions: 198 },
  { date: "Jul 7", revenue: 4800, orders: 48, conversions: 178 },
  { date: "Jul 8", revenue: 5900, orders: 59, conversions: 212 },
  { date: "Jul 9", revenue: 6500, orders: 65, conversions: 234 },
  { date: "Jul 10", revenue: 7200, orders: 72, conversions: 267 },
  { date: "Jul 11", revenue: 6800, orders: 68, conversions: 245 },
  { date: "Jul 12", revenue: 5600, orders: 56, conversions: 203 },
  { date: "Jul 13", revenue: 4900, orders: 49, conversions: 182 },
  { date: "Jul 14", revenue: 6100, orders: 61, conversions: 221 },
];

export function CampaignPerformanceChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Campaign Performance</h3>
        <p className="text-sm text-gray-600">Revenue and conversion trends over time</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: "#6b7280", fontSize: 12 }}
            stroke="#e5e7eb"
          />
          <YAxis 
            yAxisId="left"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            stroke="#e5e7eb"
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
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
          <Legend 
            wrapperStyle={{ fontSize: "12px" }}
            iconType="line"
          />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="revenue" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={false}
            name="Revenue ($)"
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="orders" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            name="Orders"
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="conversions" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            dot={false}
            name="Conversions"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
