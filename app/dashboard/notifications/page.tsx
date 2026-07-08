"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Tag,
  MessageCircle,
  Shield,
  CheckCheck,
} from "lucide-react";

const notifications = [
  {
    id: "1",
    type: "order",
    title: "Your order has shipped",
    message: "Tech World order #MK12345 is on its way",
    time: "2 hours ago",
    read: false,
    icon: Package,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    id: "2",
    type: "promotion",
    title: "Flash Sale Alert!",
    message: "Up to 50% off on electronics - Limited time only",
    time: "5 hours ago",
    read: false,
    icon: Tag,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-100",
  },
  {
    id: "3",
    type: "message",
    title: "New message from Fashion House",
    message: "Your question about the product has been answered",
    time: "1 day ago",
    read: true,
    icon: MessageCircle,
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
  },
  {
    id: "4",
    type: "order",
    title: "Order delivered successfully",
    message: "Order #MK12344 has been delivered",
    time: "2 days ago",
    read: true,
    icon: Package,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    id: "5",
    type: "security",
    title: "New login detected",
    message: "Your account was accessed from a new device",
    time: "3 days ago",
    read: true,
    icon: Shield,
    iconColor: "text-red-600",
    iconBg: "bg-red-100",
  },
];

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [items, setItems] = useState(notifications);

  const unreadCount = items.filter((item) => !item.read).length;

  const markAllAsRead = () => {
    setItems(items.map((item) => ({ ...item, read: true })));
  };

  const markAsRead = (id: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <Badge className="bg-red-600 text-white">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  onClick={markAllAsRead}
                  className="gap-2"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark all as read
                </Button>
              )}
            </div>
            <p className="text-gray-600">
              Stay updated with your orders and activities
            </p>
          </div>

          <div className="max-w-3xl space-y-3">
            {items.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`bg-white rounded-lg border p-6 cursor-pointer transition-colors ${
                  !notification.read
                    ? "border-l-4 border-l-emerald-600 bg-emerald-50/30"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`p-3 rounded-lg ${notification.iconBg} flex-shrink-0 h-fit`}
                  >
                    <notification.icon
                      className={`h-6 w-6 ${notification.iconColor}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3
                        className={`font-semibold ${
                          !notification.read
                            ? "text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
