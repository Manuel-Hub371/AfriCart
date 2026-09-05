"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RevenueChartProps {
  data?: Array<{ date: string; revenue: number; orders: number }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  // If real data provided use it, otherwise format clean default timeline
  const chartData = data && data.length > 0 ? data : Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toLocaleDateString("en-US", { weekday: "short" }),
      revenue: 0,
      orders: 0,
    };
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Revenue & Orders Overview</h3>
        <p className="text-xs text-gray-500 font-medium">Real-time daily revenue generated from completed orders</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
              }}
              formatter={(value: any, name: any) => [
                name === "revenue" || name === "Revenue" ? `$${Number(value || 0).toFixed(2)}` : value,
                name === "revenue" || name === "Revenue" ? "Revenue" : "Orders"
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Orders"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
