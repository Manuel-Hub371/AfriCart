"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smartphone, Trash2, Plus, CheckCircle2, Edit2, Star, Check } from "lucide-react";

export default function PaymentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [methods, setMethods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const initialFormState = {
    provider: "MTN Mobile Money",
    accountName: "",
    accountNumber: "",
    isDefault: false,
  };

  const [formData, setFormData] = useState(initialFormState);

  async function loadPaymentMethods() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/payments");
      if (res.ok) {
        const data = await res.json();
        setMethods(data);
      }
    } catch (err) {
      console.error("Failed to load payment methods:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const handleOpenAddForm = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setError(null);
    setShowForm(true);
  };

  const handleOpenEditForm = (method: any) => {
    setEditingId(method.id);
    setFormData({
      provider: method.provider || "MTN Mobile Money",
      accountName: method.accountName || "",
      accountNumber: method.accountNumber || "",
      isDefault: Boolean(method.isDefault),
    });
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = editingId ? `/api/payments/${editingId}` : "/api/payments";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Failed to ${editingId ? "update" : "add"} payment method`);
      }

      const updated = await res.json();
      setMethods(updated);
      setShowForm(false);
      setEditingId(null);
      setFormData(initialFormState);
      setSuccessMessage(editingId ? "Mobile Money account updated!" : "New Mobile Money account added!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/payments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMethods(updated);
        setSuccessMessage("Set as default payment method!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error("Failed to set default payment method:", err);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const res = await fetch(`/api/payments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const updated = await res.json();
        setMethods(updated);
        setSuccessMessage("Payment method removed!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error("Failed to remove payment method:", err);
    }
  };

  const getProviderBadgeStyle = (providerName: string) => {
    const p = (providerName || "").toLowerCase();
    if (p.includes("mtn")) return "bg-amber-50 text-amber-800 border-amber-200/80";
    if (p.includes("telecel") || p.includes("vodafone")) return "bg-red-50 text-red-800 border-red-200/80";
    if (p.includes("at") || p.includes("airtel")) return "bg-blue-50 text-blue-800 border-blue-200/80";
    return "bg-emerald-50 text-emerald-800 border-emerald-200/80";
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
                Mobile Money Payment Profiles
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Manage your saved Mobile Money accounts for fast marketplace checkout ({methods.length})
              </p>
            </div>
            {!showForm && (
              <Button onClick={handleOpenAddForm} className="gap-1.5 font-bold text-xs h-8 px-3 rounded-lg gradient-primary text-white shadow-2xs">
                <Plus className="h-4 w-4" />
                <span>Add Mobile Money</span>
              </Button>
            )}
          </div>

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              {successMessage}
            </div>
          )}

          {showForm && (
            <div className="bg-white rounded-xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h2 className="text-sm font-extrabold text-gray-900">
                  {editingId ? "Edit Mobile Money Account" : "Add Mobile Money Account"}
                </h2>
                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-xs font-semibold text-gray-400 hover:text-gray-600">Cancel</button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Provider Network *</label>
                    <select
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      className="w-full h-8 px-2.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    >
                      <option value="MTN Mobile Money">MTN Mobile Money</option>
                      <option value="Telecel Cash">Telecel Cash (Vodafone)</option>
                      <option value="AT Money">AT Money (AirtelTigo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Account Holder Name *</label>
                    <Input
                      required
                      value={formData.accountName}
                      onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                      placeholder="Name registered on SIM card"
                      className="h-8 text-xs rounded-lg bg-gray-50 border-gray-200 focus-within:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Mobile Money Number *</label>
                    <Input
                      required
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="e.g. 024 123 4567"
                      className="h-8 text-xs rounded-lg bg-gray-50 border-gray-200 focus-within:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isDefaultPm"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                  />
                  <label htmlFor="isDefaultPm" className="text-xs text-gray-700 cursor-pointer font-bold">
                    Set as default Mobile Money payment method
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => { setShowForm(false); setEditingId(null); }} className="h-8 text-xs font-bold px-3 rounded-lg border-gray-200">
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={isSubmitting} className="h-8 text-xs font-bold px-4 rounded-lg gradient-primary text-white">
                    {isSubmitting ? "Saving..." : editingId ? "Update Account" : "Save Mobile Money"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-white rounded-xl border border-gray-200/80 animate-pulse"></div>
              ))}
            </div>
          ) : methods.length > 0 ? (
            <div className="space-y-3">
              {methods.map((method) => (
                <div
                  key={method.id}
                  className={`bg-white rounded-xl border p-4 shadow-2xs transition-all ${
                    method.isDefault ? "border-emerald-500/80 ring-1 ring-emerald-500/20" : "border-gray-200/80 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${getProviderBadgeStyle(method.provider)}`}>
                      <Smartphone className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="font-bold text-gray-900 text-xs sm:text-sm">
                          {method.provider}
                        </h3>
                        <span className="text-[11px] text-gray-600 font-semibold">
                          ({method.accountName || "Account Holder"})
                        </span>

                        {method.isDefault && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Default
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 font-bold tracking-wider">
                        {method.accountNumber || `•••• ${method.last4}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {!method.isDefault && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSetDefault(method.id)}
                          className="text-[10px] text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 h-7 px-2 font-bold gap-1 rounded-lg"
                        >
                          <Star className="h-3 w-3" /> Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditForm(method)}
                        className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 h-7 w-7 p-0 rounded-lg"
                        title="Edit method"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(method.id)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-7 w-7 p-0 rounded-lg"
                        title="Remove method"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center">
              <Smartphone className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <h3 className="text-sm font-extrabold text-gray-900 mb-1">No Saved Mobile Money Accounts</h3>
              <p className="text-xs text-gray-400 mb-4 max-w-xs mx-auto font-medium">Add your MTN MoMo, Telecel Cash, or AT Money account for instant marketplace checkout.</p>
              <Button onClick={handleOpenAddForm} className="gradient-primary text-white font-bold text-xs h-8 px-4 rounded-lg">
                Add Your First Mobile Money Account
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
