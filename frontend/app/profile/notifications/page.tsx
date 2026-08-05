"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Tag,
  MessageCircle,
  Shield,
  CheckCheck,
  Bell,
} from "lucide-react";

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data || []);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", { method: "POST" });
      if (res.ok) {
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      if (res.ok) {
        setNotifications(
          notifications.map((item) => (item.id === id ? { ...item, isRead: true } : item))
        );
      }
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "ORDER":
        return { icon: Package, iconColor: "text-blue-600", iconBg: "bg-blue-100" };
      case "PROMOTION":
        return { icon: Tag, iconColor: "text-orange-600", iconBg: "bg-orange-100" };
      case "SYSTEM":
        return { icon: Shield, iconColor: "text-red-600", iconBg: "bg-red-100" };
      default:
        return { icon: MessageCircle, iconColor: "text-emerald-600", iconBg: "bg-emerald-100" };
    }
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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Notifications
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {unreadCount} new
                    </Badge>
                  )}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Stay updated with your order activities and updates
                </p>
              </div>

              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark all as read
                </Button>
              )}
            </div>

            {/* Notifications List */}
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No Notifications</h3>
                <p className="text-gray-500 text-sm mt-1">
                  When you have new order updates or messages, they will appear here.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200 overflow-hidden">
                {notifications.map((item) => {
                  const { icon: Icon, iconColor, iconBg } = getIcon(item.type);
                  return (
                    <div
                      key={item.id}
                      onClick={() => !item.isRead && markAsRead(item.id)}
                      className={`p-4 sm:p-6 flex items-start gap-4 transition-colors cursor-pointer ${
                        !item.isRead ? "bg-emerald-50/30 hover:bg-emerald-50/50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${iconBg} ${iconColor} flex-shrink-0`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className={`text-sm font-semibold ${!item.isRead ? "text-gray-900 font-bold" : "text-gray-700"}`}>
                            {item.title}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{item.message}</p>
                      </div>

                      {!item.isRead && (
                        <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
