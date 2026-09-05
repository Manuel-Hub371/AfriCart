"use client";

import { Bell, AlertCircle, Clock, Activity } from "lucide-react";
import { Notification } from "@/app/vendor/notifications/page";

interface NotificationStatisticsProps {
  notifications: Notification[];
}

export function NotificationStatistics({ notifications }: NotificationStatisticsProps) {
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => n.status === "unread").length;
  const importantCount = notifications.filter((n) => n.status === "important").length;
  const recentCount = notifications.filter((n) => 
    n.timestamp.includes("Just now") || n.timestamp.includes("h ago")
  ).length;

  const stats = [
    {
      label: "Total Notifications",
      value: totalCount,
      icon: Bell,
      color: "bg-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Unread Notifications",
      value: unreadCount,
      icon: Clock,
      color: "bg-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      label: "Important Alerts",
      value: importantCount,
      icon: AlertCircle,
      color: "bg-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      label: "Recent Activity",
      value: recentCount,
      icon: Activity,
      color: "bg-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
          <p className="text-sm text-gray-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
