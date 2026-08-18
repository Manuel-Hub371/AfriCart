"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MapPin, Trash2, CheckCircle2 } from "lucide-react";

export default function AddressesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: "shipping",
    firstName: "",
    lastName: "",
    phone: "",
    streetAddress: "",
    city: "",
    region: "",
    country: "Ghana",
    postalCode: "",
    isDefault: false,
  });

  async function loadAddresses() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (err) {
      console.error("Failed to load addresses:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add address");
      }

      const updated = await res.json();
      setAddresses(updated);
      setShowForm(false);
      setFormData({
        type: "shipping",
        firstName: "",
        lastName: "",
        phone: "",
        streetAddress: "",
        city: "",
        region: "",
        country: "Ghana",
        postalCode: "",
        isDefault: false,
      });
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const updated = await res.json();
        setAddresses(updated);
      }
    } catch (err) {
      console.error("Failed to delete address:", err);
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
              <h1 className="text-base sm:text-xl font-extrabold text-gray-900 tracking-tight">
                My Addresses
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Manage your saved shipping and billing delivery destinations ({addresses.length})
              </p>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className="gap-1.5 gradient-primary text-white font-bold text-xs h-8 px-3 rounded-lg shadow-2xs">
                <Plus className="h-4 w-4" />
                <span>Add Address</span>
              </Button>
            )}
          </div>

          {showForm && (
            <div className="bg-white rounded-xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h2 className="text-sm font-extrabold text-gray-900">Add Delivery Address</h2>
                <button onClick={() => setShowForm(false)} className="text-xs font-semibold text-gray-400 hover:text-gray-600">Cancel</button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">First Name *</label>
                    <Input
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="h-8 text-xs rounded-lg bg-gray-50 border-gray-200 focus-within:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Last Name *</label>
                    <Input
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="h-8 text-xs rounded-lg bg-gray-50 border-gray-200 focus-within:border-emerald-500"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Phone Number *</label>
                    <Input
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-8 text-xs rounded-lg bg-gray-50 border-gray-200 focus-within:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Country *</label>
                    <Input
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="h-8 text-xs rounded-lg bg-gray-50 border-gray-200 focus-within:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Region / State *</label>
                    <Input
                      required
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="h-8 text-xs rounded-lg bg-gray-50 border-gray-200 focus-within:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">City *</label>
                    <Input
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="h-8 text-xs rounded-lg bg-gray-50 border-gray-200 focus-within:border-emerald-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Street Address *</label>
                    <Input
                      required
                      value={formData.streetAddress}
                      onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                      className="h-8 text-xs rounded-lg bg-gray-50 border-gray-200 focus-within:border-emerald-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Postal Code</label>
                    <Input
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="h-8 text-xs rounded-lg bg-gray-50 border-gray-200 focus-within:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="isDefault" className="text-xs text-gray-700 cursor-pointer font-medium">
                    Set as default delivery address
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)} className="h-8 text-xs font-bold px-3 rounded-lg border-gray-200">
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={isSubmitting} className="h-8 text-xs font-bold px-4 rounded-lg gradient-primary text-white">
                    {isSubmitting ? "Saving..." : "Save Address"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-white rounded-xl border border-gray-200/80 animate-pulse"></div>
              ))}
            </div>
          ) : addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`bg-white rounded-xl border p-4 relative transition-all ${
                    address.isDefault ? "border-emerald-500/80 shadow-2xs" : "border-gray-200/80 hover:border-gray-300"
                  }`}
                >
                  {address.isDefault && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      <CheckCircle2 className="h-3 w-3" /> Default
                    </span>
                  )}

                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <MapPin className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm">
                      {address.firstName} {address.lastName}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed mb-2 font-medium">
                    {address.streetAddress}, {address.city}, {address.region}, {address.country}
                    {address.postalCode && ` (${address.postalCode})`}
                  </p>

                  <div className="text-[11px] text-gray-400 mb-3 font-semibold">Phone: {address.phone}</div>

                  <div className="flex justify-end pt-2 border-t border-gray-100">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(address.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50 h-7 text-xs font-bold px-2.5 rounded-lg gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> <span>Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center">
              <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <h3 className="text-sm font-extrabold text-gray-900 mb-1">No Saved Addresses</h3>
              <p className="text-xs text-gray-400 mb-4 max-w-xs mx-auto font-medium">Add a delivery address to speed up your checkout process.</p>
              <Button onClick={() => setShowForm(true)} className="gradient-primary text-white font-bold text-xs h-8 px-4 rounded-lg">
                Add Your First Address
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
