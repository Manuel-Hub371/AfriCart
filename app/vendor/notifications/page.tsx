"use client";

import { useState, useEffect, useMemo } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { NotificationStatistics } from "@/components/vendor/notification-statistics";
import { NotificationFilters } from "@/components/vendor/notification-filters";
import { NotificationList } from "@/components/vendor/notification-list";
import { Button } from "@/components/ui/button";
import { CheckCheck, Settings, Trash2 } from "lucide-react";

export type NotificationCategory = 
  | "orders" 
  | "products" 
  | "inventory" 
  | "customers" 
  | "finance" 
  | "marketing" 
  | "marketplace";

export type NotificationStatus = "unread" | "read" | "important" | "archived";

export interface Notification {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  timestamp: string;
  status: NotificationStatus;
  actionType?: string;
  actionData?: {
    orderId?: string;
    productId?: string;
    customerId?: string;
    transactionId?: string;
  };
}

export default function VendorNotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        const mapped: Notification[] = (data || []).map((n: any) => {
          let category: NotificationCategory = "marketplace";
          if (n.type === "ORDER") category = "orders";
          if (n.type === "PROMOTION") category = "marketing";

          return {
            id: n.id,
            category,
            title: n.title,
            description: n.message,
            timestamp: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: n.isRead ? "read" : "unread",
          };
        });
        setNotifications(mapped);
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

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      const matchesCategory = selectedCategory === "all" || notif.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "unread" && notif.status === "unread") ||
        (selectedStatus === "read" && notif.status === "read") ||
        (selectedStatus === "important" && notif.status === "important");
      const matchesSearch =
        searchQuery === "" ||
        notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [notifications, selectedCategory, selectedStatus, searchQuery]);

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", { method: "POST" });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" })));
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
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

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
                <p className="text-gray-600">
                  Stay updated with important activities happening in your store
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleMarkAllAsRead}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark All as Read
                </Button>
              </div>
            </div>

            {/* Statistics */}
            <NotificationStatistics notifications={notifications} />

            {/* Filters */}
            <NotificationFilters
              selectedCategory={selectedCategory}
              selectedStatus={selectedStatus}
              searchQuery={searchQuery}
              onCategoryChange={setSelectedCategory}
              onStatusChange={setSelectedStatus}
              onSearchChange={setSearchQuery}
            />

            {/* Notification List */}
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500 mt-6">
                Loading store notifications...
              </div>
            ) : (
              <NotificationList notifications={filteredNotifications} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
