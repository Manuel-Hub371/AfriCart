"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Truck, 
  Package, 
  Check, 
  X, 
  Edit3, 
  Loader2, 
  AlertCircle, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  DollarSign
} from "lucide-react";

export interface ShippingPolicyItem {
  id: string;
  storeId: string;
  name: string;
  shippingMethod: string;
  deliveryTime: string;
  shippingCost: number;
  freeShippingThreshold: number | null;
  processingTime: string | null;
  deliveryRegions: string | null;
  supportedCountries: string | null;
  localPickup: boolean;
  cashOnDelivery: boolean;
  trackingSupported: boolean;
  description: string | null;
  isActive: boolean;
  productsCount: number;
  createdAt?: string;
}

interface ShippingSettingsFormProps {
  onSave?: (data: any) => Promise<void>;
  initialData?: any;
}

export function ShippingSettingsForm({ onSave }: ShippingSettingsFormProps) {
  const [policies, setPolicies] = useState<ShippingPolicyItem[]>([]);
  const [stats, setStats] = useState({
    totalPolicies: 0,
    activePolicies: 0,
    inactivePolicies: 0,
    productsAssigned: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<ShippingPolicyItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    shippingMethod: "STANDARD",
    deliveryTime: "2-4 Business Days",
    shippingCost: "5.00",
    freeShippingThreshold: "",
    processingTime: "1-2 Business Days",
    deliveryRegions: "Nationwide",
    supportedCountries: "Ghana",
    localPickup: false,
    cashOnDelivery: false,
    trackingSupported: true,
    description: "",
    isActive: true,
  });

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/vendor/shipping-policies");
      if (!res.ok) throw new Error("Failed to load shipping policies");
      const data = await res.json();
      setPolicies(data.policies || []);
      if (data.stats) setStats(data.stats);
    } catch (err: any) {
      setError(err.message || "Failed to fetch shipping policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const openCreateModal = () => {
    setEditingPolicy(null);
    setFormData({
      name: "",
      shippingMethod: "STANDARD",
      deliveryTime: "2-4 Business Days",
      shippingCost: "5.00",
      freeShippingThreshold: "100.00",
      processingTime: "1-2 Business Days",
      deliveryRegions: "Nationwide",
      supportedCountries: "Ghana",
      localPickup: false,
      cashOnDelivery: false,
      trackingSupported: true,
      description: "Standard delivery option for all regional customer orders.",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (policy: ShippingPolicyItem) => {
    setEditingPolicy(policy);
    setFormData({
      name: policy.name,
      shippingMethod: policy.shippingMethod,
      deliveryTime: policy.deliveryTime,
      shippingCost: String(policy.shippingCost),
      freeShippingThreshold: policy.freeShippingThreshold ? String(policy.freeShippingThreshold) : "",
      processingTime: policy.processingTime || "1-2 Business Days",
      deliveryRegions: typeof policy.deliveryRegions === "string" ? policy.deliveryRegions : "",
      supportedCountries: typeof policy.supportedCountries === "string" ? policy.supportedCountries : "Ghana",
      localPickup: policy.localPickup,
      cashOnDelivery: policy.cashOnDelivery,
      trackingSupported: policy.trackingSupported,
      description: policy.description || "",
      isActive: policy.isActive,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (policy: ShippingPolicyItem) => {
    try {
      const updatedStatus = !policy.isActive;
      const res = await fetch(`/api/vendor/shipping-policies/${policy.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setPolicies((prev) =>
        prev.map((p) => (p.id === policy.id ? { ...p, isActive: updatedStatus } : p))
      );
      setStats((prev) => ({
        ...prev,
        activePolicies: updatedStatus ? prev.activePolicies + 1 : prev.activePolicies - 1,
        inactivePolicies: updatedStatus ? prev.inactivePolicies - 1 : prev.inactivePolicies + 1,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePolicy = async (policyId: string) => {
    if (!confirm("Are you sure you want to delete this shipping policy? Linked products will no longer use it.")) return;
    try {
      const res = await fetch(`/api/vendor/shipping-policies/${policyId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete policy");
      setSuccessMessage("Shipping policy deleted successfully.");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchPolicies();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: formData.name,
        shippingMethod: formData.shippingMethod,
        deliveryTime: formData.deliveryTime,
        shippingCost: parseFloat(formData.shippingCost) || 0,
        freeShippingThreshold: formData.freeShippingThreshold ? parseFloat(formData.freeShippingThreshold) : null,
        processingTime: formData.processingTime,
        deliveryRegions: formData.deliveryRegions,
        supportedCountries: formData.supportedCountries,
        localPickup: formData.localPickup,
        cashOnDelivery: formData.cashOnDelivery,
        trackingSupported: formData.trackingSupported,
        description: formData.description,
        isActive: formData.isActive,
      };

      const url = editingPolicy
        ? `/api/vendor/shipping-policies/${editingPolicy.id}`
        : "/api/vendor/shipping-policies";
      const method = editingPolicy ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save shipping policy");
      }

      setIsModalOpen(false);
      setSuccessMessage(editingPolicy ? "Shipping policy updated!" : "New shipping policy created!");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchPolicies();
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Store Shipping Policies</h2>
          <p className="text-gray-600 text-sm mt-1">
            Centralized shipping policy manager. Products reference these policies instead of retyping shipping data.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="gradient-primary text-white font-bold h-11 px-6 rounded-xl shadow-sm hover:shadow gap-2"
        >
          <Plus className="h-4 w-4" /> Create Shipping Policy
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm flex items-center gap-2 font-semibold">
          <Check className="h-4 w-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Policies</p>
          <p className="text-3xl font-extrabold text-gray-900">{stats.totalPolicies}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-sm space-y-1">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Active Policies</p>
          <p className="text-3xl font-extrabold text-emerald-700">{stats.activePolicies}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Inactive</p>
          <p className="text-3xl font-extrabold text-gray-600">{stats.inactivePolicies}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-blue-200 bg-blue-50/30 shadow-sm space-y-1">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Products Assigned</p>
          <p className="text-3xl font-extrabold text-blue-700">{stats.productsAssigned}</p>
        </div>
      </div>

      {/* Policies List */}
      {loading ? (
        <div className="bg-white p-16 rounded-3xl border border-gray-200 text-center">
          <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-semibold">Loading shipping policies...</p>
        </div>
      ) : policies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className={`bg-white rounded-3xl border transition-all p-6 space-y-4 shadow-sm relative ${
                policy.isActive ? "border-gray-200 hover:border-emerald-500" : "border-gray-200 opacity-60 bg-gray-50/50"
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-gray-900 text-lg">{policy.name}</h3>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                      {policy.shippingMethod}
                    </Badge>
                  </div>
                  {policy.description && (
                    <p className="text-xs text-gray-500 line-clamp-2">{policy.description}</p>
                  )}
                </div>

                {/* Active Switch */}
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={policy.isActive}
                    onChange={() => handleToggleActive(policy)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Policy Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-700 border-t border-b border-gray-100 py-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    Cost: <strong className="text-gray-900">${policy.shippingCost.toFixed(2)}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>{policy.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    Free above:{" "}
                    <strong className="text-gray-900">
                      {policy.freeShippingThreshold ? `$${policy.freeShippingThreshold}` : "N/A"}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span>
                    Linked Products: <strong className="text-gray-900">{policy.productsCount}</strong>
                  </span>
                </div>
              </div>

              {/* Badges / Extras */}
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                {policy.trackingSupported && (
                  <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-semibold border border-blue-100">
                    ✓ Live Tracking
                  </span>
                )}
                {policy.localPickup && (
                  <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md font-semibold border border-amber-100">
                    ✓ Store Pickup
                  </span>
                )}
                {policy.cashOnDelivery && (
                  <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-semibold border border-emerald-100">
                    ✓ Cash on Delivery
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  onClick={() => openEditModal(policy)}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 gap-1.5"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  onClick={() => handleDeletePolicy(policy.id)}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center shadow-sm">
          <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">No Shipping Policies Configured</h3>
          <p className="text-gray-500 max-w-md mx-auto text-sm mb-6">
            Create your first shipping policy (e.g. Standard Shipping, Express, Free Delivery) so your products can reference central store shipping rates.
          </p>
          <Button
            onClick={openCreateModal}
            className="gradient-primary text-white font-bold h-11 px-6 rounded-xl shadow-sm"
          >
            Create Shipping Policy
          </Button>
        </div>
      )}

      {/* CREATE / EDIT POLICY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-8">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editingPolicy ? "Edit Shipping Policy" : "Create New Shipping Policy"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePolicy} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Policy Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Standard Doorstep Delivery"
                    className="h-11 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Shipping Method
                  </label>
                  <select
                    value={formData.shippingMethod}
                    onChange={(e) => setFormData({ ...formData, shippingMethod: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm font-medium focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="STANDARD">Standard Shipping</option>
                    <option value="EXPRESS">Express Shipping</option>
                    <option value="NEXT_DAY">Next-Day Delivery</option>
                    <option value="FREE">Free Shipping</option>
                    <option value="LOCAL_PICKUP">Local Store Pickup</option>
                    <option value="INTERNATIONAL">International Delivery</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Delivery Time Estimate <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                    placeholder="e.g. 2-4 Business Days"
                    className="h-11 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Processing Time
                  </label>
                  <Input
                    type="text"
                    value={formData.processingTime}
                    onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                    placeholder="e.g. 1-2 Business Days"
                    className="h-11 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Base Shipping Fee ($) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={formData.shippingCost}
                    onChange={(e) => setFormData({ ...formData, shippingCost: e.target.value })}
                    placeholder="5.00"
                    className="h-11 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Free Shipping Threshold ($)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.freeShippingThreshold}
                    onChange={(e) => setFormData({ ...formData, freeShippingThreshold: e.target.value })}
                    placeholder="100.00 (Optional)"
                    className="h-11 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Serviced Regions &amp; Coverage
                </label>
                <Input
                  type="text"
                  value={formData.deliveryRegions}
                  onChange={(e) => setFormData({ ...formData, deliveryRegions: e.target.value })}
                  placeholder="e.g. Greater Accra, Ashanti Region, Central Region"
                  className="h-11 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Policy Description / Terms
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details regarding delivery conditions, returns, or handling..."
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={formData.trackingSupported}
                    onChange={(e) => setFormData({ ...formData, trackingSupported: e.target.checked })}
                    className="h-4 w-4 text-emerald-600 rounded"
                  />
                  Live Tracking Included
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={formData.localPickup}
                    onChange={(e) => setFormData({ ...formData, localPickup: e.target.checked })}
                    className="h-4 w-4 text-emerald-600 rounded"
                  />
                  Allow Local Pickup
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={formData.cashOnDelivery}
                    onChange={(e) => setFormData({ ...formData, cashOnDelivery: e.target.checked })}
                    className="h-4 w-4 text-emerald-600 rounded"
                  />
                  Cash on Delivery
                </label>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl h-11 px-5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="gradient-primary text-white font-bold h-11 px-6 rounded-xl"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingPolicy ? "Save Changes" : "Create Policy"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
