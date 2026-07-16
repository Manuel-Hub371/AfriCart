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

const mockData = [
  { category: "Electronics", sales: 45678, orders: 234 },
  { category: "Fashion", sales: 38920, orders: 456 },
  { category: "Home", sales: 29450, orders: 178 },
  { category: "Beauty", sales: 18765, orders: 289 },
  { category: "Sports", sales: 15432, orders: 123 },
];

export function SalesChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Sales by Category</h3>
        <p className="text-sm text-gray-600">Revenue distribution across product categories</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockData}>
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
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value: number, name: string) => [
                name === "sales" ? `$${value.toLocaleString()}` : value,
                name === "sales" ? "Sales" : "Orders"
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
