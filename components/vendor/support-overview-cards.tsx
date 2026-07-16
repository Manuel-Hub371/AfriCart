"use client";

import { Ticket, MessageSquare, CheckCircle, Clock } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "blue" | "yellow" | "green" | "purple";
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function SupportOverviewCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Open Tickets"
        value={3}
        icon={<Ticket className="h-6 w-6" />}
        color="blue"
      />
      <StatCard
        title="Pending Responses"
        value={2}
        icon={<MessageSquare className="h-6 w-6" />}
        color="yellow"
      />
      <StatCard
        title="Resolved Tickets"
        value={24}
        icon={<CheckCircle className="h-6 w-6" />}
        color="green"
      />
      <StatCard
        title="Avg Response Time"
        value="2.5 hrs"
        icon={<Clock className="h-6 w-6" />}
        color="purple"
      />
    </div>
  );
}
