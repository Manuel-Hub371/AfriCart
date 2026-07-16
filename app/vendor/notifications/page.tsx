"use client";

import { useState, useMemo } from "react";
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

// Generate deterministic notifications
function generateNotifications(count: number): Notification[] {
  const categories: NotificationCategory[] = [
    "orders",
    "products",
    "inventory",
    "customers",
    "finance",
    "marketing",
    "marketplace",
  ];

  const templates = {
    orders: [
      { title: "New Order Received", desc: "Order #ORDER has been placed by a customer" },
      { title: "Order Cancelled", desc: "Order #ORDER was cancelled by the customer" },
      { title: "Order Delivered", desc: "Order #ORDER has been successfully delivered" },
    ],
    products: [
      { title: "Product Approved", desc: "Your product listing has been approved" },
      { title: "Product Rejected", desc: "Product listing requires modifications" },
      { title: "Product Updated", desc: "Product inventory has been updated" },
    ],
    inventory: [
      { title: "Low Stock Alert", desc: "Product stock is running low (5 units remaining)" },
      { title: "Out of Stock", desc: "Product is currently out of stock" },
      { title: "Inventory Adjusted", desc: "Inventory adjustment completed successfully" },
    ],
    customers: [
      { title: "New Message", desc: "You have a new message from a customer" },
      { title: "New Review Posted", desc: "A customer left a review on your product" },
      { title: "Customer Complaint", desc: "Customer reported an issue with their order" },
    ],
    finance: [
      { title: "Payment Received", desc: "Payment of $150.00 has been received" },
      { title: "Payout Completed", desc: "Your payout of $1,250.00 has been processed" },
      { title: "Refund Processed", desc: "Refund of $75.00 has been issued" },
    ],
    marketing: [
      { title: "Campaign Started", desc: "Your marketing campaign is now live" },
      { title: "Coupon Expired", desc: "Coupon code SUMMER2026 has expired" },
      { title: "Promotion Completed", desc: "Your promotion period has ended" },
    ],
    marketplace: [
      { title: "Policy Update", desc: "Marketplace policies have been updated" },
      { title: "Maintenance Notice", desc: "Scheduled maintenance on July 20, 2026" },
      { title: "Platform Announcement", desc: "New features available in vendor dashboard" },
    ],
  };

  const notifications: Notification[] = [];

  for (let i = 0; i < count; i++) {
    const categoryIndex = i % categories.length;
    const category = categories[categoryIndex];
    const templateIndex = i % templates[category].length;
    const template = templates[category][templateIndex];
    
    const hoursAgo = i * 2;
    const isUnread = i < 8;
    const isImportant = i % 7 === 0;

    notifications.push({
      id: `notif-${i + 1}`,
      category,
      title: template.title,
      description: template.desc.replace("#ORDER", `#${45000 + i}`),
      timestamp:
        hoursAgo < 1
          ? "Just now"
          : hoursAgo < 24
          ? `${hoursAgo}h ago`
          : `${Math.floor(hoursAgo / 24)}d ago`,
      status: isImportant ? "important" : isUnread ? "unread" : "read",
      actionType: category === "orders" ? "view-order" : category === "inventory" ? "restock" : "view",
      actionData: {
        orderId: category === "orders" ? `${45000 + i}` : undefined,
        productId: category === "products" ? `prod-${i}` : undefined,
      },
    });
  }

  return notifications;
}

export default function VendorNotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Generate notifications
  const allNotifications = useMemo(() => generateNotifications(50), []);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return allNotifications.filter((notif) => {
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
  }, [allNotifications, selectedCategory, selectedStatus, searchQuery]);

  const handleMarkAllAsRead = () => {
    console.log("Mark all as read");
  };

  const handleClearAll = () => {
    console.log("Clear all notifications");
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
                <Button
                  onClick={handleClearAll}
                  variant="outline"
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Statistics */}
            <NotificationStatistics notifications={allNotifications} />

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
            <NotificationList notifications={filteredNotifications} />
          </div>
        </main>
      </div>
    </div>
  );
}
