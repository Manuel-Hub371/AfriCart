"use client";

import { useEffect, useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Plus,
  Calendar,
  Tag,
  TrendingUp,
  Eye,
  DollarSign,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Flame,
  ArrowLeft,
  Package,
} from "lucide-react";
import Link from "next/link";

interface CampaignItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string | null;
  badge?: string | null;
  color?: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  status: string;
  visibility: string;
  discountType: string;
  discountValue?: number | null;
  priority: number;
  targetScope: string;
  viewsCount: number;
  salesCount: number;
  revenueGenerated: number;
  productsCount: number;
}

export default function VendorCampaignsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [storeProducts, setStoreProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalViews: 0,
    totalRevenue: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignItem | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "FLASH_SALE",
    description: "",
    badge: "",
    color: "#EF4444",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    discountType: "PERCENTAGE",
    discountValue: 20,
    priority: 0,
    targetScope: "PRODUCT",
    visibility: "PUBLIC",
    isActive: true,
    productIds: [] as string[],
  });

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const [campRes, prodRes] = await Promise.all([
        fetch("/api/vendor/campaigns"),
        fetch("/api/vendor/products"),
      ]);

      if (!campRes.ok) {
        const err = await campRes.json();
        throw new Error(err.error || "Failed to load campaigns");
      }
      const data = await campRes.json();
      setCampaigns(data.campaigns || []);
      if (data.stats) setStats(data.stats);

      if (prodRes && prodRes.ok) {
        const pData = await prodRes.json();
        setStoreProducts(pData.products || pData || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCampaign(null);
    setFormData({
      name: "",
      type: "FLASH_SALE",
      description: "",
      badge: "",
      color: "#EF4444",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      discountType: "PERCENTAGE",
      discountValue: 20,
      priority: 0,
      targetScope: "PRODUCT",
      visibility: "PUBLIC",
      isActive: true,
      productIds: [],
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = async (c: CampaignItem) => {
    setEditingCampaign(c);
    let linkedProductIds: string[] = [];

    try {
      const res = await fetch(`/api/vendor/campaigns/${c.id}`);
      if (res.ok) {
        const details = await res.json();
        const cps = details.campaign?.campaignProducts || [];
        linkedProductIds = cps.map((cp: any) => cp.productId);
      }
    } catch {
      // best effort
    }

    setFormData({
      name: c.name,
      type: c.type,
      description: c.description || "",
      badge: c.badge || "",
      color: c.color || "#EF4444",
      startDate: c.startDate.split("T")[0],
      endDate: c.endDate.split("T")[0],
      discountType: c.discountType,
      discountValue: c.discountValue || 0,
      priority: c.priority || 0,
      targetScope: c.targetScope || "PRODUCT",
      visibility: c.visibility || "PUBLIC",
      isActive: c.isActive,
      productIds: linkedProductIds,
    });
    setModalOpen(true);
  };

  const toggleProductSelect = (pid: string) => {
    if (formData.productIds.includes(pid)) {
      setFormData({ ...formData, productIds: formData.productIds.filter((id) => id !== pid) });
    } else {
      setFormData({ ...formData, productIds: [...formData.productIds, pid] });
    }
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSaving(true);
      const url = editingCampaign
        ? `/api/vendor/campaigns/${editingCampaign.id}`
        : "/api/vendor/campaigns";
      const method = editingCampaign ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save campaign");
      }

      setModalOpen(false);
      fetchCampaigns();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (c: CampaignItem) => {
    try {
      const res = await fetch(`/api/vendor/campaigns/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !c.isActive }),
      });
      if (res.ok) fetchCampaigns();
    } catch {
      // ignore
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm("Are you sure you want to delete this marketing campaign?")) return;
    try {
      const res = await fetch(`/api/vendor/campaigns/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchCampaigns();
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <VendorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <VendorTopbar
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumbs={[
            { label: "Dashboard", href: "/vendor" },
            { label: "Marketing", href: "/vendor/marketing" },
            { label: "Campaigns" },
          ]}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link href="/vendor/marketing">
                  <Button variant="ghost" size="sm" className="p-1 h-auto text-gray-500 hover:text-gray-900">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Marketing Campaigns
                </h1>
              </div>
              <p className="text-sm text-gray-500">
                Create and manage promotional campaigns, flash sales, priority discounts, and product assignments.
              </p>
            </div>
            <Button
              onClick={handleOpenCreateModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 rounded-xl shadow-sm"
            >
              <Plus className="h-4 w-4" /> Create Campaign
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
                <span>Total Campaigns</span>
                <Sparkles className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-extrabold text-gray-900">{stats.totalCampaigns}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
                <span>Active Campaigns</span>
                <Flame className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-700">{stats.activeCampaigns}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
                <span>Campaign Views</span>
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-3xl font-extrabold text-gray-900">{stats.totalViews}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
                <span>Campaign Revenue</span>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-extrabold text-gray-900">GH₵{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          {/* Campaigns List */}
          {loading ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center">
              <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-600">Loading store marketing campaigns...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-6 rounded-3xl border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-4 shadow-sm">
              <Sparkles className="h-12 w-12 text-emerald-600 mx-auto" />
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">No Marketing Campaigns Found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  Create your first promotional campaign to boost product sales and feature special discounts across AfriCart.
                </p>
              </div>
              <Button
                onClick={handleOpenCreateModal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 rounded-xl"
              >
                <Plus className="h-4 w-4" /> Create First Campaign
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        className="font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider text-white"
                        style={{ backgroundColor: c.color || "#EF4444" }}
                      >
                        {c.badge || c.type}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(c)}
                        className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                          c.isActive && c.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {c.isActive ? `● ${c.status || "Active"}` : "○ Inactive"}
                      </button>
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-gray-900">{c.name}</h3>
                      {c.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{c.description}</p>
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400 font-bold text-[10px] uppercase block">Discount</span>
                        <strong className="text-emerald-700 font-extrabold text-sm">
                          {c.discountType === "PERCENTAGE"
                            ? `${c.discountValue}% OFF`
                            : c.discountType === "FIXED"
                            ? `GH₵${c.discountValue} OFF`
                            : "No Direct Discount"}
                        </strong>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold text-[10px] uppercase block">Products</span>
                        <strong className="text-gray-900 font-extrabold text-sm">{c.productsCount} linked</strong>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-gray-200 flex items-center justify-between text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                          {new Date(c.startDate).toLocaleDateString()} — {new Date(c.endDate).toLocaleDateString()}
                        </span>
                        <span className="font-bold text-gray-700">P{c.priority}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <Link href={`/campaigns/${c.slug}`} target="_blank">
                      <Button variant="outline" size="sm" className="text-xs font-bold rounded-xl gap-1">
                        <Eye className="h-3.5 w-3.5" /> Preview Page
                      </Button>
                    </Link>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditModal(c)}
                        className="h-8 w-8 p-0 text-gray-600 hover:text-emerald-700"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCampaign(c.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal Dialog for Create/Edit Campaign with Product Assignment */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-xl border border-gray-200 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-extrabold text-gray-900">
                {editingCampaign ? "Edit Marketing Campaign" : "Create New Campaign"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Campaign Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Black Friday Super Sale"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Campaign Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="FLASH_SALE">⚡ Flash Sale</option>
                    <option value="BLACK_FRIDAY">🔥 Black Friday</option>
                    <option value="CLEARANCE">🎉 Clearance Sale</option>
                    <option value="SEASONAL">✨ Seasonal Promo</option>
                    <option value="NEW_ARRIVAL">🆕 New Arrival</option>
                    <option value="LIMITED_OFFER">⌛ Limited Time Offer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Badge Tag Text
                  </label>
                  <Input
                    placeholder="e.g. 30% OFF FLASH"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of campaign terms and deals..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (GH₵)</option>
                    <option value="NONE">No Price Discount</option>
                  </select>
                </div>

                {formData.discountType !== "NONE" && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Discount Value
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="e.g. 25"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                      className="rounded-xl"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Priority (Higher wins)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Scope
                  </label>
                  <select
                    value={formData.targetScope}
                    onChange={(e) => setFormData({ ...formData, targetScope: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="PRODUCT">Selected Products</option>
                    <option value="CATEGORY">Category Wide</option>
                    <option value="BRAND">Brand Wide</option>
                    <option value="STORE">Entire Store</option>
                  </select>
                </div>
              </div>

              {/* Requirement 10: Assign Products to Campaign Join Table */}
              {formData.targetScope === "PRODUCT" && storeProducts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase text-gray-700">
                      Assign Store Products ({formData.productIds.length} Selected)
                    </label>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, productIds: storeProducts.map((p) => p.id) })}
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        Select All
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, productIds: [] })}
                        className="text-red-600 font-bold hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                  <div className="max-h-36 overflow-y-auto border rounded-xl p-2 space-y-1 bg-gray-50">
                    {storeProducts.map((p) => {
                      const isSel = formData.productIds.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => toggleProductSelect(p.id)}
                          className={`p-2 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between ${
                            isSel ? "bg-emerald-100 text-emerald-800 font-bold" : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <span className="truncate max-w-[80%]">{p.name} (GH₵{p.price})</span>
                          <span>{isSel ? "✓" : "+"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    End Date *
                  </label>
                  <Input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Badge Color
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-12 h-10 p-1 rounded-xl cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold text-gray-600">{formData.color}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Active Status
                  </label>
                  <select
                    value={formData.isActive ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="true">Active &amp; Published</option>
                    <option value="false">Inactive / Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingCampaign ? "Update Campaign" : "Save Campaign"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
