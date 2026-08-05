"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SalesChartProps {
  data?: Array<{ category: string; sales: number; orders: number }>;
}

export function SalesChart({ data }: SalesChartProps) {
  const chartData = data && data.length > 0 ? data : [
    { category: "General", sales: 0, orders: 0 },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Sales by Category</h3>
        <p className="text-xs text-gray-500 font-medium">Revenue distribution across store categories from live database records</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="category"
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
                name === "sales" || name === "Sales" ? `$${Number(value || 0).toFixed(2)}` : value,
                name === "sales" || name === "Sales" ? "Sales" : "Orders"
              ]}
            />
            <Legend />
            <Bar dataKey="sales" fill="#10B981" name="Sales" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
