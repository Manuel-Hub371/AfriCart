"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CustomerChartProps {
  data?: Array<{ month: string; new: number; returning: number }>;
}

export function CustomerChart({ data }: CustomerChartProps) {
  const chartData = data && data.length > 0 ? data : [
    { month: "Jan", new: 0, returning: 0 },
    { month: "Feb", new: 0, returning: 0 },
    { month: "Mar", new: 0, returning: 0 },
    { month: "Apr", new: 0, returning: 0 },
    { month: "May", new: 0, returning: 0 },
    { month: "Jun", new: 0, returning: 0 },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Customer Growth & Loyalty</h3>
        <p className="text-xs text-gray-500 font-medium">New vs returning customer trends based on real orders</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorReturning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="new"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#colorNew)"
              name="New Customers"
            />
            <Area
              type="monotone"
              dataKey="returning"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorReturning)"
              name="Returning Customers"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
