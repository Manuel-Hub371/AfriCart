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
  Flame,
  Clock,
  AlertCircle,
  Loader2,
  Edit2,
  Trash2,
  ArrowRight,
  Eye,
  Percent,
} from "lucide-react";
import Link from "next/link";

interface DashboardCampaign {
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
  discountType: string;
  discountValue?: number | null;
  productsCount: number;
}

export default function VendorMarketingDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    scheduledCampaigns: 0,
    expiredCampaigns: 0,
    draftCampaigns: 0,
    productsInCampaigns: 0,
  });

  const [campaigns, setCampaigns] = useState<DashboardCampaign[]>([]);

  // Modals state
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<DashboardCampaign | null>(null);
  const [campaignSaving, setCampaignSaving] = useState(false);

  const [campaignForm, setCampaignForm] = useState({
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
    visibility: "PUBLIC",
    isActive: true,
  });

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/vendor/marketing/overview");
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to load marketing overview");
      }
      const data = await res.json();
      if (data.stats) setStats(data.stats);
      setCampaigns(data.campaigns || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  // Campaign Modal handlers
  const handleOpenCreateCampaign = () => {
    setEditingCampaign(null);
    setCampaignForm({
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
      visibility: "PUBLIC",
      isActive: true,
    });
    setCampaignModalOpen(true);
  };

  const handleOpenEditCampaign = (c: DashboardCampaign) => {
    setEditingCampaign(c);
    setCampaignForm({
      name: c.name,
      type: c.type,
      description: c.description || "",
      badge: c.badge || "",
      color: c.color || "#EF4444",
      startDate: c.startDate.split("T")[0],
      endDate: c.endDate.split("T")[0],
      discountType: c.discountType,
      discountValue: c.discountValue || 0,
      priority: 0,
      visibility: "PUBLIC",
      isActive: c.isActive,
    });
    setCampaignModalOpen(true);
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.name.trim()) return;

    try {
      setCampaignSaving(true);
      const url = editingCampaign
        ? `/api/vendor/campaigns/${editingCampaign.id}`
        : "/api/vendor/campaigns";
      const method = editingCampaign ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignForm),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save campaign");
      }

      setCampaignModalOpen(false);
      fetchOverview();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCampaignSaving(false);
    }
  };

  const handleToggleCampaignActive = async (c: DashboardCampaign) => {
    try {
      const res = await fetch(`/api/vendor/campaigns/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !c.isActive }),
      });
      if (res.ok) fetchOverview();
    } catch {
      // silently fail
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm("Are you sure you want to delete this marketing campaign?")) return;
    try {
      const res = await fetch(`/api/vendor/campaigns/${id}`, { method: "DELETE" });
      if (res.ok) fetchOverview();
    } catch {
      // silently fail
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
            { label: "Marketing Overview" },
          ]}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
                Marketing Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Central hub for promotional campaigns, flash sales, and customer discounts.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button
                onClick={handleOpenCreateCampaign}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 rounded-xl shadow-sm"
              >
                <Plus className="h-4 w-4" /> Create Campaign
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center">
              <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-600">Loading Marketing Overview Statistics...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-6 rounded-3xl border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <>
              {/* Marketing Overview Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Total Campaigns</span>
                  <p className="text-2xl font-extrabold text-gray-900">{stats.totalCampaigns}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-600 tracking-wider">Active Deals</span>
                  <p className="text-2xl font-extrabold text-emerald-700">{stats.activeCampaigns}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-blue-600 tracking-wider">Scheduled</span>
                  <p className="text-2xl font-extrabold text-blue-700">{stats.scheduledCampaigns}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-red-500 tracking-wider">Expired</span>
                  <p className="text-2xl font-extrabold text-red-600">{stats.expiredCampaigns}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-gray-500 tracking-wider">Drafts</span>
                  <p className="text-2xl font-extrabold text-gray-900">{stats.draftCampaigns}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-purple-600 tracking-wider">Linked Products</span>
                  <p className="text-2xl font-extrabold text-purple-700">{stats.productsInCampaigns}</p>
                </div>
              </div>

              {/* Marketing Campaigns Overview */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                    <h2 className="text-xl font-extrabold text-gray-900">Marketing Campaigns</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href="/vendor/marketing/campaigns">
                      <Button variant="ghost" size="sm" className="text-emerald-700 font-bold text-xs gap-1 hover:bg-emerald-50">
                        View All Campaigns <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {campaigns.length === 0 ? (
                  <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center space-y-3 shadow-sm">
                    <Sparkles className="h-10 w-10 text-emerald-600 mx-auto" />
                    <h3 className="text-base font-extrabold text-gray-900">No Campaigns Configured</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      Create promotional campaigns to offer percentage or flat discounts to your storefront customers.
                    </p>
                    <Button
                      onClick={handleOpenCreateCampaign}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Create Campaign
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((c) => (
                      <div
                        key={c.id}
                        className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider text-white"
                              style={{ backgroundColor: c.color || "#EF4444" }}
                            >
                              {c.badge || c.type}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleCampaignActive(c)}
                              className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                                c.isActive
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {c.isActive ? "● Active" : "○ Paused"}
                            </button>
                          </div>

                          <div>
                            <h3 className="text-lg font-extrabold text-gray-900 leading-snug">{c.name}</h3>
                            {c.description && (
                              <p className="text-xs text-gray-500 line-clamp-2 mt-1">{c.description}</p>
                            )}
                          </div>

                          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 space-y-2 text-xs">
                            <div className="flex items-center justify-between text-gray-600">
                              <span>Discount Offer</span>
                              <strong className="text-emerald-700 font-extrabold">
                                {c.discountType === "PERCENTAGE"
                                  ? `${c.discountValue}% OFF`
                                  : `$${c.discountValue} OFF`}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between text-gray-600">
                              <span>Assigned Products</span>
                              <strong className="text-gray-900 font-extrabold">{c.productsCount} Items</strong>
                            </div>
                            <div className="flex items-center justify-between text-gray-400 text-[11px] pt-1 border-t border-gray-200">
                              <span>
                                {c.startDate.split("T")[0]} → {c.endDate.split("T")[0]}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                          <Link href={`/campaigns/${c.slug}`} target="_blank">
                            <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-gray-600 hover:text-emerald-700">
                              <Eye className="h-3.5 w-3.5 mr-1" /> Landing Page
                            </Button>
                          </Link>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditCampaign(c)}
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
              </div>
            </>
          )}
        </main>
      </div>

      {/* Campaign Create/Edit Modal */}
      {campaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-xl border border-gray-200 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-extrabold text-gray-900">
                {editingCampaign ? "Edit Marketing Campaign" : "Create Marketing Campaign"}
              </h3>
              <button
                type="button"
                onClick={() => setCampaignModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Campaign Name *</label>
                <Input
                  required
                  placeholder="e.g. Summer Mega Sale 2026"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Campaign Type</label>
                  <select
                    value={campaignForm.type}
                    onChange={(e) => setCampaignForm({ ...campaignForm, type: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="FLASH_SALE">⚡ Flash Sale</option>
                    <option value="BLACK_FRIDAY">🔥 Black Friday</option>
                    <option value="HOLIDAY">🎄 Holiday Sale</option>
                    <option value="CLEARANCE">🎉 Clearance</option>
                    <option value="NEW_ARRIVAL">✨ New Arrival</option>
                    <option value="CUSTOM">⭐ Custom Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Badge Label</label>
                  <Input
                    placeholder="🔥 Black Friday 50%"
                    value={campaignForm.badge}
                    onChange={(e) => setCampaignForm({ ...campaignForm, badge: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={campaignForm.discountType}
                    onChange={(e) => setCampaignForm({ ...campaignForm, discountType: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Discount Value</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={campaignForm.discountValue}
                    onChange={(e) => setCampaignForm({ ...campaignForm, discountValue: parseFloat(e.target.value) || 0 })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Start Date</label>
                  <Input
                    type="date"
                    value={campaignForm.startDate}
                    onChange={(e) => setCampaignForm({ ...campaignForm, startDate: e.target.value })}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">End Date</label>
                  <Input
                    type="date"
                    value={campaignForm.endDate}
                    onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Campaign terms & customer promotion details..."
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setCampaignModalOpen(false)} className="rounded-xl font-bold">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={campaignSaving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2"
                >
                  {campaignSaving && <Loader2 className="h-4 w-4 animate-spin" />}
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
