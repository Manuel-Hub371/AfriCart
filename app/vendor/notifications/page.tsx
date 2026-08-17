"use client";

import { useState, useEffect, useMemo } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  BellRing,
  CheckCheck,
  Check,
  Trash2,
  ShoppingBag,
  Tag,
  Info,
  ShieldCheck,
  Search,
  RotateCw,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

export interface VendorNotificationItem {
  id: string;
  title: string;
  message: string;
  type: "ORDER" | "PROMOTION" | "SYSTEM" | "INFO";
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}

export type Notification = any;

export default function VendorNotificationsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "orders" | "system">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<VendorNotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNotifications = async (showRefreshSpinner = false) => {
    try {
      if (showRefreshSpinner) setIsRefreshing(true);
      else setIsLoading(true);

      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data || []);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Compute unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Filter notifications based on tab & search query
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Tab filter
      if (activeTab === "unread" && item.isRead) return false;
      if (activeTab === "orders" && item.type !== "ORDER") return false;
      if (activeTab === "system" && item.type === "ORDER") return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesMessage = item.message.toLowerCase().includes(query);
        if (!matchesTitle && !matchesMessage) return false;
      }

      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", { method: "POST" });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  // Mark single notification as read
  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Delete notification
  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  // Click handler to view detail / link
  const handleNotificationClick = async (item: VendorNotificationItem) => {
    if (!item.isRead) {
      await handleMarkAsRead(item.id);
    }
    if (item.link) {
      router.push(item.link);
    }
  };

  // Helper for formatting relative time
  const formatTimeAgo = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 172800) return "Yesterday";
    return `${Math.floor(diffSec / 86400)}d ago`;
  };

  // Helper for notification type icon & color scheme
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "ORDER":
        return {
          icon: <ShoppingBag className="h-4 w-4 text-emerald-600" />,
          bg: "bg-emerald-100/70 border-emerald-200",
        };
      case "PROMOTION":
        return {
          icon: <Tag className="h-4 w-4 text-purple-600" />,
          bg: "bg-purple-100/70 border-purple-200",
        };
      case "SYSTEM":
        return {
          icon: <ShieldCheck className="h-4 w-4 text-amber-600" />,
          bg: "bg-amber-100/70 border-amber-200",
        };
      default:
        return {
          icon: <Info className="h-4 w-4 text-blue-600" />,
          bg: "bg-blue-100/70 border-blue-200",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <VendorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <VendorTopbar
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumbs={[
            { label: "Dashboard", href: "/vendor" },
            { label: "Notifications" },
          ]}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    Notifications
                  </h1>
                  {unreadCount > 0 && (
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  System updates, new orders, and merchant notifications
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNotifications(true)}
                disabled={isRefreshing}
                className="h-9 px-3 text-xs font-bold rounded-xl border-gray-200 text-gray-700 hover:bg-gray-100"
              >
                <RotateCw className={`h-3.5 w-3.5 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </Button>
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="h-9 px-3 text-xs font-bold rounded-xl gradient-primary text-white shadow-2xs"
                >
                  <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
                  <span>Mark All Read</span>
                </Button>
              )}
            </div>
          </div>

          {/* Clean Notification Center Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
            {/* Filter Tabs & Search Bar Header */}
            <div className="p-3 sm:p-4 bg-gray-50/70 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Tab Navigation */}
              <div className="flex items-center gap-1 bg-gray-200/60 p-1 rounded-xl w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === "all"
                      ? "bg-white text-gray-900 shadow-2xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveTab("unread")}
                  className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === "unread"
                      ? "bg-white text-gray-900 shadow-2xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === "orders"
                      ? "bg-white text-gray-900 shadow-2xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab("system")}
                  className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === "system"
                      ? "bg-white text-gray-900 shadow-2xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  System &amp; Promo
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Filter notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs rounded-xl bg-white border-gray-200 focus-within:border-emerald-500"
                />
              </div>
            </div>

            {/* Notification Stream List */}
            <div className="divide-y divide-gray-100">
              {isLoading ? (
                <div className="p-12 text-center text-gray-400 text-xs font-semibold">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  Loading notifications...
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <BellRing className="h-6 w-6" />
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
                    You're all caught up!
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                    {searchQuery
                      ? "No notifications matching your search filter."
                      : "New store orders and system announcements will appear here."}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((item) => {
                  const badge = getTypeBadge(item.type);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`p-4 transition-all flex items-start gap-3.5 group cursor-pointer ${
                        !item.isRead
                          ? "bg-emerald-50/40 hover:bg-emerald-50/70 border-l-4 border-emerald-600"
                          : "hover:bg-gray-50/80 bg-white"
                      }`}
                    >
                      {/* Type Icon Badge */}
                      <div
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${badge.bg}`}
                      >
                        {badge.icon}
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-xs sm:text-sm font-extrabold truncate ${
                                !item.isRead ? "text-gray-900" : "text-gray-700"
                              }`}
                            >
                              {item.title}
                            </h4>
                            {!item.isRead && (
                              <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] sm:text-xs font-semibold text-gray-400 flex-shrink-0">
                            {formatTimeAgo(item.createdAt)}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed font-medium">
                          {item.message}
                        </p>

                        {item.link && (
                          <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800">
                            <span>View Details</span>
                            <ExternalLink className="h-3 w-3" />
                          </div>
                        )}
                      </div>

                      {/* Item Quick Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        {!item.isRead && (
                          <button
                            onClick={(e) => handleMarkAsRead(item.id, e)}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Mark as Read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDeleteNotification(item.id, e)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
