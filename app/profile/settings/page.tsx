"use client";

import { useState, useRef, useEffect } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useUpload } from "@/lib/hooks/use-upload";
import { useAuth } from "@/lib/auth/context";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, updateUser } = useAuth();

  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    language: "English",
    currency: "USD",
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading: uploadingPhoto } = useUpload();

  // Populate user data from auth context
  useEffect(() => {
    if (user) {
      setAvatarUrl(user.avatar || "");
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaveError(null);
    const url = await uploadFile(file);
    if (url) {
      setAvatarUrl(url);

      // Persist avatar change immediately to database
      try {
        const res = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar: url }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            updateUser(data.user);
          }
        }
      } catch (err) {
        console.error("Failed to persist avatar:", err);
      }
    }
    e.target.value = "";
  };

  const handleRemovePhoto = async () => {
    setAvatarUrl("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: null }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          updateUser(data.user);
        }
      }
    } catch (err) {
      console.error("Failed to remove avatar:", err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          avatar: avatarUrl || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile changes");
      }

      const data = await res.json();
      if (data.user) {
        updateUser(data.user);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = `${formData.firstName} ${formData.lastName}`.trim();
  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account preferences</p>
          </div>

          {saveSuccess && (
            <div className="max-w-3xl mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              Settings and profile picture updated successfully!
            </div>
          )}

          {saveError && (
            <div className="max-w-3xl mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              {saveError}
            </div>
          )}

          <div className="max-w-3xl space-y-6">
            {/* Profile Picture */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-3xl font-bold">
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {uploadingPhoto && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
                      <Loader2 className="h-5 w-5 text-emerald-600 animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="sr-only"
                    id="profile-photo-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    disabled={uploadingPhoto}
                    onClick={() => photoInputRef.current?.click()}
                  >
                    {uploadingPhoto ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                    {uploadingPhoto ? "Uploading..." : "Change Photo"}
                  </Button>
                  {avatarUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                      onClick={handleRemovePhoto}
                    >
                      Remove Photo
                    </Button>
                  )}
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10 MB</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>English</option>
                    <option>French</option>
                    <option>Spanish</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>USD</option>
                    <option>GHS</option>
                    <option>EUR</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">
                Notification Preferences
              </h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Email Notifications
                    </h3>
                    <p className="text-sm text-gray-600">
                      Receive email updates
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleChange}
                    className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <h3 className="font-medium text-gray-900">Order Updates</h3>
                    <p className="text-sm text-gray-600">
                      Notifications about your orders
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="orderUpdates"
                    checked={formData.orderUpdates}
                    onChange={handleChange}
                    className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gradient-primary text-white gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
