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

        <main className="flex-1 p-3 sm:p-6 lg:p-8 space-y-3 sm:space-y-6">
          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-3xl font-black text-gray-900 flex items-center gap-2 tracking-tight">
                  Notifications
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-extrabold text-[10px] px-2 py-0.2 rounded-full">
                      {unreadCount} new
                    </Badge>
                  )}
                </h1>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Stay updated with your order activities and store updates
                </p>
              </div>

              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs font-bold h-8 px-2.5 rounded-xl border-gray-200"
                >
                  <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Mark all as read</span>
                  <span className="sm:hidden">Read All</span>
                </Button>
              )}
            </div>

            {/* Notifications List */}
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-2xs border border-gray-200 p-6 text-center text-xs text-gray-400 font-medium">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-2xs border border-dashed border-gray-200 p-8 text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900">No Notifications</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  When you have new order updates or messages, they will appear here.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xs border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                {notifications.map((item) => {
                  const { icon: Icon, iconColor, iconBg } = getIcon(item.type);
                  return (
                    <div
                      key={item.id}
                      onClick={() => !item.isRead && markAsRead(item.id)}
                      className={`p-3 sm:p-5 flex items-start gap-3 transition-colors cursor-pointer ${
                        !item.isRead ? "bg-emerald-50/40 hover:bg-emerald-50/60" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className={`p-2 rounded-lg sm:rounded-xl ${iconBg} ${iconColor} flex-shrink-0`}>
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className={`text-xs sm:text-sm ${!item.isRead ? "text-gray-900 font-extrabold" : "text-gray-700 font-semibold"}`}>
                            {item.title}
                          </h3>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap font-medium">
                            {new Date(item.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5 leading-snug">{item.message}</p>
                      </div>

                      {!item.isRead && (
                        <div className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0 mt-1.5" />
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
