"use client";

import {
  ShoppingBag,
  Package,
  Archive,
  MessageSquare,
  DollarSign,
  Tag,
  Bell,
  Eye,
  Check,
  Archive as ArchiveIcon,
} from "lucide-react";
import { Notification } from "@/app/vendor/notifications/page";
import { Button } from "@/components/ui/button";

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const getCategoryIcon = () => {
    switch (notification.category) {
      case "orders":
        return ShoppingBag;
      case "products":
        return Package;
      case "inventory":
        return Archive;
      case "customers":
        return MessageSquare;
      case "finance":
        return DollarSign;
      case "marketing":
        return Tag;
      case "marketplace":
        return Bell;
      default:
        return Bell;
    }
  };

  const getCategoryColor = () => {
    switch (notification.category) {
      case "orders":
        return "bg-blue-100 text-blue-600";
      case "products":
        return "bg-purple-100 text-purple-600";
      case "inventory":
        return "bg-orange-100 text-orange-600";
      case "customers":
        return "bg-green-100 text-green-600";
      case "finance":
        return "bg-emerald-100 text-emerald-600";
      case "marketing":
        return "bg-pink-100 text-pink-600";
      case "marketplace":
        return "bg-indigo-100 text-indigo-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const Icon = getCategoryIcon();
  const isUnread = notification.status === "unread";
  const isImportant = notification.status === "important";

  const handleMarkAsRead = () => {
    console.log("Mark as read:", notification.id);
  };

  const handleArchive = () => {
    console.log("Archive:", notification.id);
  };

  const handleAction = () => {
    console.log("Action:", notification.actionType, notification.actionData);
  };

  return (
    <div
      className={`bg-white rounded-xl p-5 border transition-all hover:shadow-md ${
        isImportant
          ? "border-red-300 bg-red-50/30"
          : isUnread
          ? "border-emerald-300 bg-emerald-50/30"
          : "border-gray-200"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-lg ${getCategoryColor()} flex items-center justify-center flex-shrink-0`}>
          <Icon className="h-6 w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`text-base font-semibold ${
                  isUnread || isImportant ? "text-gray-900" : "text-gray-700"
                }`}>
                  {notification.title}
                </h3>
                {isImportant && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                    Important
                  </span>
                )}
                {isUnread && !isImportant && (
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{notification.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="capitalize">{notification.category}</span>
                <span>•</span>
                <span>{notification.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4">
            <Button
              size="sm"
              onClick={handleAction}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              View Details
            </Button>
            {isUnread && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleMarkAsRead}
              >
                <Check className="h-4 w-4 mr-1.5" />
                Mark as Read
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={handleArchive}
            >
              <ArchiveIcon className="h-4 w-4 mr-1.5" />
              Archive
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
