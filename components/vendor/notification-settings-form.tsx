"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Bell, Mail, MessageSquare, Package } from "lucide-react";

interface NotificationSettingsFormProps {
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

export function NotificationSettingsForm({ onSave, initialData }: NotificationSettingsFormProps) {
  const [notifyNewOrders, setNotifyNewOrders] = useState(initialData?.notifyNewOrders ?? true);
  const [notifyOrderUpdates, setNotifyOrderUpdates] = useState(initialData?.notifyOrderUpdates ?? true);
  const [notifyCustomerMessages, setNotifyCustomerMessages] = useState(initialData?.notifyCustomerMessages ?? true);
  const [notifyProductReviews, setNotifyProductReviews] = useState(initialData?.notifyProductReviews ?? true);
  const [notifyLowStock, setNotifyLowStock] = useState(initialData?.notifyLowStock ?? true);
  const [notifyMarketing, setNotifyMarketing] = useState(initialData?.notifyMarketing ?? false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        notifyNewOrders,
        notifyOrderUpdates,
        notifyCustomerMessages,
        notifyProductReviews,
        notifyLowStock,
        notifyMarketing,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
        <p className="text-gray-600 text-sm">
          Select which store events and customer interactions trigger email and in-app alerts.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-200">
          <div className="space-y-0.5">
            <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Package className="h-4 w-4 text-emerald-600" /> New Customer Orders
            </span>
            <p className="text-xs text-gray-500">Receive instant alerts whenever a customer places an order</p>
          </div>
          <input
            type="checkbox"
            checked={notifyNewOrders}
            onChange={(e) => setNotifyNewOrders(e.target.checked)}
            className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-200">
          <div className="space-y-0.5">
            <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Bell className="h-4 w-4 text-emerald-600" /> Order Status Changes
            </span>
            <p className="text-xs text-gray-500">Notifications when orders transition to Shipped or Delivered</p>
          </div>
          <input
            type="checkbox"
            checked={notifyOrderUpdates}
            onChange={(e) => setNotifyOrderUpdates(e.target.checked)}
            className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-200">
          <div className="space-y-0.5">
            <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-600" /> Direct Customer Messages
            </span>
            <p className="text-xs text-gray-500">Alerts when a buyer sends a message to your store</p>
          </div>
          <input
            type="checkbox"
            checked={notifyCustomerMessages}
            onChange={(e) => setNotifyCustomerMessages(e.target.checked)}
            className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-200">
          <div className="space-y-0.5">
            <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Bell className="h-4 w-4 text-emerald-600" /> Product Ratings &amp; Reviews
            </span>
            <p className="text-xs text-gray-500">Get notified when customers post reviews on your products</p>
          </div>
          <input
            type="checkbox"
            checked={notifyProductReviews}
            onChange={(e) => setNotifyProductReviews(e.target.checked)}
            className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-200">
          <div className="space-y-0.5">
            <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Bell className="h-4 w-4 text-emerald-600" /> Low Inventory Alerts
            </span>
            <p className="text-xs text-gray-500">Automatic warnings when product stock drops below 10 items</p>
          </div>
          <input
            type="checkbox"
            checked={notifyLowStock}
            onChange={(e) => setNotifyLowStock(e.target.checked)}
            className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-200">
          <div className="space-y-0.5">
            <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Mail className="h-4 w-4 text-emerald-600" /> Marketplace Marketing Updates
            </span>
            <p className="text-xs text-gray-500">Receive platform campaign invites and seller promotional tips</p>
          </div>
          <input
            type="checkbox"
            checked={notifyMarketing}
            onChange={(e) => setNotifyMarketing(e.target.checked)}
            className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="pt-4 border-t flex justify-end">
        <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
          <Save className="h-4 w-4 mr-2" /> {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </form>
  );
}
