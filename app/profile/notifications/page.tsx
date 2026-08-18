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

        <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto w-full space-y-3.5">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-xl border border-gray-200/80 shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-extrabold text-gray-900 tracking-tight">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[10px] px-2 py-0.5 rounded-md">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Updates regarding your orders, seller messages, and platform activity
              </p>
            </div>

            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs font-bold h-8 px-3 rounded-lg border-gray-200 hover:bg-gray-50"
              >
                <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Mark All Read</span>
              </Button>
            )}
          </div>

          {/* Notifications List Stream */}
          {isLoading ? (
            <div className="bg-white rounded-xl border border-gray-200/80 p-8 text-center text-xs text-gray-400 font-medium">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Bell className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-900 mb-0.5">You&apos;re all caught up!</h3>
              <p className="text-xs text-gray-400 font-medium">
                New order updates and message notifications will appear here.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200/80 divide-y divide-gray-100 overflow-hidden shadow-2xs">
              {notifications.map((item) => {
                const { icon: Icon, iconColor, iconBg } = getIcon(item.type);
                return (
                  <div
                    key={item.id}
                    onClick={() => !item.isRead && markAsRead(item.id)}
                    className={`p-3.5 sm:p-4 flex items-start gap-3.5 transition-colors cursor-pointer ${
                      !item.isRead ? "bg-emerald-50/40 hover:bg-emerald-50/70 border-l-4 border-emerald-600" : "hover:bg-gray-50 bg-white"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0 mt-0.5 border border-gray-100`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h3 className={`text-xs sm:text-sm ${!item.isRead ? "text-gray-900 font-extrabold" : "text-gray-700 font-semibold"}`}>
                          {item.title}
                        </h3>
                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">{item.message}</p>
                    </div>

                    {!item.isRead && (
                      <div className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
