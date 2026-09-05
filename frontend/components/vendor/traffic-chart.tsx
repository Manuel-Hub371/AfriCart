"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface TrafficChartProps {
  data?: Array<{ name: string; value: number; percentage: number }>;
}

const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#6B7280"];

export function TrafficChart({ data }: TrafficChartProps) {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Traffic & Channel Sources</h3>
        <p className="text-xs text-gray-500 font-medium">Storefront referral sources and channel breakdowns</p>
      </div>
      
      {hasData ? (
        <>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }: any) => `${name} ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => Number(value || 0).toLocaleString()}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {data.map((source, index) => (
              <div key={source.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs font-semibold text-gray-700 truncate">{source.name}</span>
                <span className="text-xs font-extrabold text-gray-900 ml-auto">
                  {source.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="h-80 flex flex-col items-center justify-center text-center p-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-1">No Traffic Data Logged Yet</p>
          <p className="text-xs text-gray-500 max-w-xs">
            Referral sources and visitor channel breakdowns will appear here as buyers visit your storefront.
          </p>
        </div>
      )}
    </div>
  );
}
