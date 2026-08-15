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

        <main className="flex-1 p-3 sm:p-6 lg:p-8 space-y-3 sm:space-y-6">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">Settings</h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Manage your account preferences</p>
          </div>

          {saveSuccess && (
            <div className="max-w-3xl p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              Settings updated successfully!
            </div>
          )}

          {saveError && (
            <div className="max-w-3xl p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              {saveError}
            </div>
          )}

          <div className="max-w-3xl space-y-3 sm:space-y-6">
            {/* Profile Picture */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3.5 sm:p-6 shadow-2xs space-y-3">
              <h2 className="text-sm sm:text-lg font-black text-gray-900">Profile Picture</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-16 w-16 sm:h-24 sm:w-24 overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xl sm:text-3xl font-black">
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {uploadingPhoto && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
                      <Loader2 className="h-4 w-4 text-emerald-600 animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
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
                    size="sm"
                    className="gap-1.5 h-8 text-xs font-bold px-3 rounded-xl border-gray-200"
                    disabled={uploadingPhoto}
                    onClick={() => photoInputRef.current?.click()}
                  >
                    {uploadingPhoto ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Camera className="h-3.5 w-3.5 text-emerald-600" />
                    )}
                    {uploadingPhoto ? "Uploading..." : "Change Photo"}
                  </Button>
                  {avatarUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 text-[10px] h-6 p-0 font-bold"
                      onClick={handleRemovePhoto}
                    >
                      Remove Photo
                    </Button>
                  )}
                  <p className="text-[10px] text-gray-400 font-medium">PNG, JPG up to 10 MB</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3.5 sm:p-6 shadow-2xs space-y-3">
              <h2 className="text-sm sm:text-lg font-black text-gray-900">
                Personal Information
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      First Name
                    </label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="h-8 sm:h-10 text-xs rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Last Name
                    </label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="h-8 sm:h-10 text-xs rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-50 text-gray-500 cursor-not-allowed h-8 sm:h-10 text-xs rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-8 sm:h-10 text-xs rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3.5 sm:p-6 shadow-2xs space-y-3">
              <h2 className="text-sm sm:text-lg font-black text-gray-900">Preferences</h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full h-8 sm:h-10 px-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option>English</option>
                    <option>French</option>
                    <option>Spanish</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full h-8 sm:h-10 px-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option>GHS (GH₵)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3.5 sm:p-6 shadow-2xs space-y-3">
              <h2 className="text-sm sm:text-lg font-black text-gray-900">
                Notification Preferences
              </h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-gray-900">
                      Email Notifications
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      Receive email updates about promotions and news
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-gray-100">
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-gray-900">Order Updates</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      Real-time notifications about your order statuses
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="orderUpdates"
                    checked={formData.orderUpdates}
                    onChange={handleChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gradient-primary text-white font-bold text-xs h-9 px-5 rounded-xl shadow-2xs gap-1.5 w-full sm:w-auto"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
