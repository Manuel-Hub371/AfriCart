"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const mockData = [
  { name: "Direct", value: 2890, percentage: 35 },
  { name: "Search", value: 2145, percentage: 26 },
  { name: "Social Media", value: 1650, percentage: 20 },
  { name: "Email", value: 825, percentage: 10 },
  { name: "Referral", value: 495, percentage: 6 },
  { name: "Ads", value: 245, percentage: 3 },
];

const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#6B7280"];

export function TrafficChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Traffic Sources</h3>
        <p className="text-sm text-gray-600">Where your visitors come from</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name} ${percentage}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {mockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => value.toLocaleString()}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {mockData.map((source, index) => (
          <div key={source.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-sm text-gray-700">{source.name}</span>
            <span className="text-sm font-medium text-gray-900 ml-auto">
              {source.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
