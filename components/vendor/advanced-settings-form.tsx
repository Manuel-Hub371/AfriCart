"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, Lock, Sun, ShoppingBag } from "lucide-react";

interface AdvancedSettingsFormProps {
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

export function AdvancedSettingsForm({ onSave, initialData }: AdvancedSettingsFormProps) {
  const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? true);
  const [acceptingOrders, setAcceptingOrders] = useState(initialData?.acceptingOrders ?? true);
  const [vacationMode, setVacationMode] = useState(initialData?.vacationMode ?? false);
  const [vacationMessage, setVacationMessage] = useState(
    initialData?.vacationMessage || "Our store is currently on vacation. Orders placed will be processed upon our return."
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setIsPublic(initialData.isPublic ?? true);
      setAcceptingOrders(initialData.acceptingOrders ?? true);
      setVacationMode(initialData.vacationMode ?? false);
      setVacationMessage(initialData.vacationMessage || vacationMessage);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        isPublic,
        acceptingOrders,
        vacationMode,
        vacationMessage,
        status: vacationMode ? "VACATION" : (acceptingOrders ? "ACTIVE" : "PAUSED"),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Advanced Store Visibility &amp; Operational Controls</h2>
        <p className="text-gray-600 text-sm">
          Manage storefront indexability, order acceptance status, and vacation mode settings.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Public / Private Store */}
          <div className="p-5 border border-gray-200 rounded-2xl bg-gray-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-600" /> Public Marketplace Visibility
              </label>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-500">
              When enabled, your store is indexed, searchable, and displayed on the AfriCart store directory.
            </p>
          </div>

          {/* Accepting Orders */}
          <div className="p-5 border border-gray-200 rounded-2xl bg-gray-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-emerald-600" /> Accept New Orders
              </label>
              <input
                type="checkbox"
                checked={acceptingOrders}
                onChange={(e) => setAcceptingOrders(e.target.checked)}
                className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-500">
              When disabled, customers can view products but cannot proceed to checkout for your items.
            </p>
          </div>
        </div>

        {/* Vacation Mode */}
        <div className="p-6 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Sun className="h-5 w-5 text-amber-600" /> Vacation / Pause Storefront Mode
              </label>
              <p className="text-xs text-gray-600">
                Temporarily pause order intake while keeping your store profile active with an announcement banner.
              </p>
            </div>
            <input
              type="checkbox"
              checked={vacationMode}
              onChange={(e) => setVacationMode(e.target.checked)}
              className="h-5 w-5 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
            />
          </div>

          {vacationMode && (
            <div className="space-y-2 pt-2 border-t border-amber-200">
              <label className="font-bold text-xs uppercase tracking-wider text-amber-900">
                Vacation Notice Message for Customers
              </label>
              <textarea
                rows={3}
                value={vacationMessage}
                onChange={(e) => setVacationMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-amber-300 text-xs bg-white focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t flex justify-end">
        <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 font-bold">
          <Save className="h-4 w-4 mr-2" /> {saving ? "Saving..." : "Save Advanced Settings"}
        </Button>
      </div>
    </form>
  );
}
