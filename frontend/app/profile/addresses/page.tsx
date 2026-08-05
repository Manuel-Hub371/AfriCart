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

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
              {!showForm && (
                <Button onClick={() => setShowForm(true)} className="gap-2 gradient-primary text-white">
                  <Plus className="h-5 w-5" />
                  Add New Address
                </Button>
              )}
            </div>
            <p className="text-gray-600">
              Manage your shipping and billing delivery addresses
            </p>
          </div>

          {showForm && (
            <div className="bg-white rounded-2xl border p-6 mb-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 border-b pb-3">Add New Address</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">First Name *</label>
                    <Input
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name *</label>
                    <Input
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
                    <Input
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Country *</label>
                    <Input
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Region / State *</label>
                    <Input
                      required
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                    <Input
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address *</label>
                    <Input
                      required
                      value={formData.streetAddress}
                      onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Postal Code</label>
                    <Input
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="isDefault" className="text-sm text-gray-700 cursor-pointer">
                    Set as default delivery address
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="gradient-primary text-white">
                    {isSubmitting ? "Saving..." : "Save Address"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-44 bg-white rounded-2xl border p-6 animate-pulse"></div>
              ))}
            </div>
          ) : addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`bg-white rounded-2xl border p-6 relative transition-all ${
                    address.isDefault ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/20" : "hover:border-gray-300"
                  }`}
                >
                  {address.isDefault && (
                    <span className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Default Address
                    </span>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-bold text-gray-900">
                      {address.firstName} {address.lastName}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {address.streetAddress}, {address.city}, {address.region}, {address.country}
                    {address.postalCode && ` (${address.postalCode})`}
                  </p>

                  <div className="text-xs text-gray-500 mb-4">Phone: {address.phone}</div>

                  <div className="flex justify-end pt-3 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(address.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border p-12 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No Saved Addresses</h3>
              <p className="text-sm text-gray-500 mb-6">Add a delivery address to speed up your checkout process.</p>
              <Button onClick={() => setShowForm(true)} className="gradient-primary text-white">
                Add Your First Address
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
