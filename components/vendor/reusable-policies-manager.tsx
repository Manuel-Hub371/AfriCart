"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  RotateCcw,
  ShieldCheck,
  Award,
  Truck,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";

export function ReusablePoliciesManager() {
  const [activeTab, setActiveTab] = useState<"generalStore" | "privacy" | "refund" | "return" | "warranty">("generalStore");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [policies, setPolicies] = useState<{
    shipping: any[];
    refund: any[];
    return: any[];
    warranty: any[];
    generalStore: any[];
    privacy: any[];
    currentStorePolicyId: string | null;
    currentPrivacyPolicyId: string | null;
  }>({
    shipping: [],
    refund: [],
    return: [],
    warranty: [],
    generalStore: [],
    privacy: [],
    currentStorePolicyId: null,
    currentPrivacyPolicyId: null,
  });

  // Active Policy Assignment Selection State
  const [selectedStorePolicyId, setSelectedStorePolicyId] = useState<string>("");
  const [selectedPrivacyPolicyId, setSelectedPrivacyPolicyId] = useState<string>("");
  const [assigning, setAssigning] = useState(false);
  const [assignMessage, setAssignMessage] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Forms
  const [storePolicyForm, setStorePolicyForm] = useState({
    name: "",
    description: "",
    termsConditions: "",
    customerResponsibilities: "",
    sellerResponsibilities: "",
    orderAcceptanceRules: "",
    productRestrictions: "",
    cancellationRules: "",
    disputeResolution: "",
    effectiveDate: "",
    isActive: true,
  });

  const [privacyPolicyForm, setPrivacyPolicyForm] = useState({
    name: "",
    introduction: "",
    infoCollected: "",
    howInfoUsed: "",
    cookiesPolicy: "",
    thirdPartyServices: "",
    dataSharing: "",
    dataRetention: "",
    securityMeasures: "",
    customerRights: "",
    contactInfo: "",
    effectiveDate: "",
    isActive: true,
  });

  // Forms
  const [refundForm, setRefundForm] = useState({
    name: "",
    description: "",
    eligibilityPeriod: "7 days",
    refundType: "FULL_REFUND",
    conditions: "",
    excludedProducts: "",
    processingTime: "3-5 Business Days",
    isActive: true,
  });

  const [returnForm, setReturnForm] = useState({
    name: "",
    description: "",
    returnWindow: "14 days",
    returnConditions: "",
    shippingResponsibility: "CUSTOMER",
    acceptedReasons: "",
    inspectionReqs: "",
    isActive: true,
  });

  const [warrantyForm, setWarrantyForm] = useState({
    name: "",
    warrantyType: "STORE",
    warrantyDuration: "12 Months",
    coverage: "",
    exclusions: "",
    claimProcess: "",
    isActive: true,
  });

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/vendor/policies");
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to load store policies");
      }
      const data = await res.json();
      const p = data.policies || { shipping: [], refund: [], return: [], warranty: [], generalStore: [], privacy: [] };
      setPolicies(p);
      if (p.currentStorePolicyId) setSelectedStorePolicyId(p.currentStorePolicyId);
      if (p.currentPrivacyPolicyId) setSelectedPrivacyPolicyId(p.currentPrivacyPolicyId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleAssignPolicies = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssigning(true);
    setAssignMessage(null);
    try {
      const res = await fetch("/api/vendor/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentStorePolicyId: selectedStorePolicyId || null,
          currentPrivacyPolicyId: selectedPrivacyPolicyId || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to assign policies");
      }
      setAssignMessage("Active policies assigned successfully! Storefront updated.");
      setTimeout(() => setAssignMessage(null), 3000);
      fetchPolicies();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAssigning(false);
    }
  };

  // Modal Open Handlers
  const handleOpenCreate = () => {
    setEditingItem(null);
    if (activeTab === "generalStore") {
      setStorePolicyForm({
        name: "",
        description: "",
        termsConditions: "",
        customerResponsibilities: "",
        sellerResponsibilities: "",
        orderAcceptanceRules: "",
        productRestrictions: "",
        cancellationRules: "",
        disputeResolution: "",
        effectiveDate: new Date().toISOString().split("T")[0],
        isActive: true,
      });
    } else if (activeTab === "privacy") {
      setPrivacyPolicyForm({
        name: "",
        introduction: "",
        infoCollected: "",
        howInfoUsed: "",
        cookiesPolicy: "",
        thirdPartyServices: "",
        dataSharing: "",
        dataRetention: "",
        securityMeasures: "",
        customerRights: "",
        contactInfo: "",
        effectiveDate: new Date().toISOString().split("T")[0],
        isActive: true,
      });
    } else if (activeTab === "refund") {
      setRefundForm({
        name: "",
        description: "",
        eligibilityPeriod: "7 days",
        refundType: "FULL_REFUND",
        conditions: "",
        excludedProducts: "",
        processingTime: "3-5 Business Days",
        isActive: true,
      });
    } else if (activeTab === "return") {
      setReturnForm({
        name: "",
        description: "",
        returnWindow: "14 days",
        returnConditions: "",
        shippingResponsibility: "CUSTOMER",
        acceptedReasons: "",
        inspectionReqs: "",
        isActive: true,
      });
    } else if (activeTab === "warranty") {
      setWarrantyForm({
        name: "",
        warrantyType: "STORE",
        warrantyDuration: "12 Months",
        coverage: "",
        exclusions: "",
        claimProcess: "",
        isActive: true,
      });
    }
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === "generalStore") {
      setStorePolicyForm({
        name: item.name,
        description: item.description || "",
        termsConditions: item.termsConditions || "",
        customerResponsibilities: item.customerResponsibilities || "",
        sellerResponsibilities: item.sellerResponsibilities || "",
        orderAcceptanceRules: item.orderAcceptanceRules || "",
        productRestrictions: item.productRestrictions || "",
        cancellationRules: item.cancellationRules || "",
        disputeResolution: item.disputeResolution || "",
        effectiveDate: item.effectiveDate || "",
        isActive: item.isActive,
      });
    } else if (activeTab === "privacy") {
      setPrivacyPolicyForm({
        name: item.name,
        introduction: item.introduction || "",
        infoCollected: item.infoCollected || "",
        howInfoUsed: item.howInfoUsed || "",
        cookiesPolicy: item.cookiesPolicy || "",
        thirdPartyServices: item.thirdPartyServices || "",
        dataSharing: item.dataSharing || "",
        dataRetention: item.dataRetention || "",
        securityMeasures: item.securityMeasures || "",
        customerRights: item.customerRights || "",
        contactInfo: item.contactInfo || "",
        effectiveDate: item.effectiveDate || "",
        isActive: item.isActive,
      });
    } else if (activeTab === "refund") {
      setRefundForm({
        name: item.name,
        description: item.description || "",
        eligibilityPeriod: item.eligibilityPeriod || "7 days",
        refundType: item.refundType || "FULL_REFUND",
        conditions: item.conditions || "",
        excludedProducts: item.excludedProducts || "",
        processingTime: item.processingTime || "3-5 Business Days",
        isActive: item.isActive,
      });
    } else if (activeTab === "return") {
      setReturnForm({
        name: item.name,
        description: item.description || "",
        returnWindow: item.returnWindow || "14 days",
        returnConditions: item.returnConditions || "",
        shippingResponsibility: item.shippingResponsibility || "CUSTOMER",
        acceptedReasons: item.acceptedReasons || "",
        inspectionReqs: item.inspectionReqs || "",
        isActive: item.isActive,
      });
    } else if (activeTab === "warranty") {
      setWarrantyForm({
        name: item.name,
        warrantyType: item.warrantyType || "STORE",
        warrantyDuration: item.warrantyDuration || "12 Months",
        coverage: item.coverage || "",
        exclusions: item.exclusions || "",
        claimProcess: item.claimProcess || "",
        isActive: item.isActive,
      });
    }
    setModalOpen(true);
  };

  // Submit Handler
  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      let url = "";
      if (activeTab === "generalStore") {
        url = "/api/vendor/store-policies";
      } else if (activeTab === "privacy") {
        url = "/api/vendor/privacy-policies";
      } else {
        url = `/api/vendor/policies/${activeTab}`;
      }

      if (editingItem) {
        url += `/${editingItem.id}`;
      }

      const method = editingItem ? "PATCH" : "POST";
      const body =
        activeTab === "generalStore"
          ? storePolicyForm
          : activeTab === "privacy"
          ? privacyPolicyForm
          : activeTab === "refund"
          ? refundForm
          : activeTab === "return"
          ? returnForm
          : warrantyForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Failed to save ${activeTab} policy`);
      }

      setModalOpen(false);
      fetchPolicies();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Toggle Active
  const handleToggleActive = async (item: any, type: string) => {
    try {
      let url = "";
      if (type === "generalStore") url = `/api/vendor/store-policies/${item.id}`;
      else if (type === "privacy") url = `/api/vendor/privacy-policies/${item.id}`;
      else url = `/api/vendor/policies/${type}/${item.id}`;

      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      if (res.ok) fetchPolicies();
    } catch {
      // ignore
    }
  };

  // Delete Handler
  const handleDeletePolicy = async (id: string, type: string) => {
    if (!confirm(`Are you sure you want to delete this policy?`)) return;
    try {
      let url = "";
      if (type === "generalStore") url = `/api/vendor/store-policies/${id}`;
      else if (type === "privacy") url = `/api/vendor/privacy-policies/${id}`;
      else url = `/api/vendor/policies/${type}/${id}`;

      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) fetchPolicies();
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Store &amp; Product Policies</h2>
        <p className="text-gray-600 text-sm">
          Create, manage, and assign normalized Store Policies, Privacy Policies, Refund, Return, and Warranty rules stored in PostgreSQL.
        </p>
      </div>

      {/* Part 5 — Active Policy Assignments Selector */}
      <form onSubmit={handleAssignPolicies} className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-200/60 space-y-4 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" /> Active Storefront Assignments
            </h3>
            <p className="text-xs text-gray-600">Select which active Store Policy and Privacy Policy are currently published to your public storefront.</p>
          </div>
          {assignMessage && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full animate-fade-in">
              ✓ {assignMessage}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Active Store Policy</label>
            <select
              value={selectedStorePolicyId}
              onChange={(e) => setSelectedStorePolicyId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- No Active Store Policy Selected --</option>
              {policies.generalStore.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.isActive ? "(Active)" : "(Inactive)"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Active Privacy Policy</label>
            <select
              value={selectedPrivacyPolicyId}
              onChange={(e) => setSelectedPrivacyPolicyId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- No Active Privacy Policy Selected --</option>
              {policies.privacy.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.isActive ? "(Active)" : "(Inactive)"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={assigning}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl px-5 h-10 gap-2"
          >
            {assigning && <Loader2 className="h-4 w-4 animate-spin" />} Save Storefront Assignments
          </Button>
        </div>
      </form>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("generalStore")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
            activeTab === "generalStore"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Award className="h-4 w-4" /> Store Policies ({policies.generalStore.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("privacy")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
            activeTab === "privacy"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <ShieldCheck className="h-4 w-4" /> Privacy Policies ({policies.privacy.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("refund")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
            activeTab === "refund"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <RotateCcw className="h-4 w-4" /> Refund Policies ({policies.refund.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("return")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
            activeTab === "return"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <ShieldCheck className="h-4 w-4" /> Return Policies ({policies.return.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("warranty")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
            activeTab === "warranty"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Award className="h-4 w-4" /> Warranty Policies ({policies.warranty.length})
        </button>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleOpenCreate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 rounded-xl"
        >
          <Plus className="h-4 w-4" /> Create{" "}
          {activeTab === "generalStore"
            ? "Store Policy"
            : activeTab === "privacy"
            ? "Privacy Policy"
            : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Policy`}
        </Button>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-3xl border text-center">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-600">Loading policy configurations...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div>
          {/* GENERAL STORE POLICY TAB */}
          {activeTab === "generalStore" && (
            <div className="space-y-4">
              {policies.generalStore.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center space-y-2">
                  <Award className="h-10 w-10 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-extrabold text-gray-900">No Store Policies</h3>
                  <p className="text-xs text-gray-500">Create reusable Store Policies (General, Electronics, Fashion, Wholesale) to assign to your storefront.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {policies.generalStore.map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl border border-gray-200 p-5 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-gray-900 text-base">{item.name}</h4>
                          {policies.currentStorePolicyId === item.id && (
                            <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                              PUBLISHED
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item, "generalStore")}
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            item.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.isActive ? "● Active" : "○ Inactive"}
                        </button>
                      </div>

                      {item.description && <p className="text-xs text-gray-600 leading-relaxed font-medium">{item.description}</p>}

                      {item.termsConditions && (
                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs text-gray-700 space-y-1">
                          <strong className="text-gray-900 font-bold block">Terms &amp; Conditions:</strong>
                          <p className="line-clamp-2">{item.termsConditions}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-gray-500 border-t pt-3">
                        <span>Effective: <strong>{item.effectiveDate || "Immediate"}</strong></span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(item)}
                            className="h-8 w-8 p-0 text-gray-600 hover:text-emerald-700"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePolicy(item.id, "generalStore")}
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
          )}

          {/* PRIVACY POLICY TAB */}
          {activeTab === "privacy" && (
            <div className="space-y-4">
              {policies.privacy.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center space-y-2">
                  <ShieldCheck className="h-10 w-10 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-extrabold text-gray-900">No Privacy Policies</h3>
                  <p className="text-xs text-gray-500">Create custom Privacy Policies (Standard, GDPR, Cookies, Marketing) to assign to your storefront.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {policies.privacy.map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl border border-gray-200 p-5 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-gray-900 text-base">{item.name}</h4>
                          {policies.currentPrivacyPolicyId === item.id && (
                            <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                              PUBLISHED
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item, "privacy")}
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            item.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.isActive ? "● Active" : "○ Inactive"}
                        </button>
                      </div>

                      {item.introduction && <p className="text-xs text-gray-600 leading-relaxed font-medium">{item.introduction}</p>}

                      {item.infoCollected && (
                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs text-gray-700 space-y-1">
                          <strong className="text-gray-900 font-bold block">Information Collected:</strong>
                          <p className="line-clamp-2">{item.infoCollected}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-gray-500 border-t pt-3">
                        <span>Effective: <strong>{item.effectiveDate || "Immediate"}</strong></span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(item)}
                            className="h-8 w-8 p-0 text-gray-600 hover:text-emerald-700"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePolicy(item.id, "privacy")}
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
          )}
          {activeTab === "refund" && (
            <div className="space-y-4">
              {policies.refund.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center space-y-2">
                  <RotateCcw className="h-10 w-10 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-extrabold text-gray-900">No Refund Policies</h3>
                  <p className="text-xs text-gray-500">Create reusable refund policies to assign to your products.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {policies.refund.map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl border border-gray-200 p-5 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-extrabold text-gray-900 text-base">{item.name}</h4>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item, "refund")}
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            item.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.isActive ? "● Active" : "○ Inactive"}
                        </button>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400 font-bold uppercase text-[10px] block">Eligibility</span>
                          <strong className="text-gray-900 font-extrabold">{item.eligibilityPeriod}</strong>
                        </div>
                        <div>
                          <span className="text-gray-400 font-bold uppercase text-[10px] block">Refund Type</span>
                          <strong className="text-emerald-700 font-extrabold">{item.refundType}</strong>
                        </div>
                      </div>

                      {item.description && <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>}

                      <div className="flex items-center justify-end gap-2 border-t pt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(item)}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-emerald-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePolicy(item.id, "refund")}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RETURN TAB */}
          {activeTab === "return" && (
            <div className="space-y-4">
              {policies.return.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center space-y-2">
                  <ShieldCheck className="h-10 w-10 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-extrabold text-gray-900">No Return Policies</h3>
                  <p className="text-xs text-gray-500">Create reusable return policies for customer product returns.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {policies.return.map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl border border-gray-200 p-5 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-extrabold text-gray-900 text-base">{item.name}</h4>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item, "return")}
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            item.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.isActive ? "● Active" : "○ Inactive"}
                        </button>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400 font-bold uppercase text-[10px] block">Return Window</span>
                          <strong className="text-gray-900 font-extrabold">{item.returnWindow}</strong>
                        </div>
                        <div>
                          <span className="text-gray-400 font-bold uppercase text-[10px] block">Shipping Paid By</span>
                          <strong className="text-emerald-700 font-extrabold">{item.shippingResponsibility}</strong>
                        </div>
                      </div>

                      {item.description && <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>}

                      <div className="flex items-center justify-end gap-2 border-t pt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(item)}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-emerald-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePolicy(item.id, "return")}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WARRANTY TAB */}
          {activeTab === "warranty" && (
            <div className="space-y-4">
              {policies.warranty.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center space-y-2">
                  <Award className="h-10 w-10 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-extrabold text-gray-900">No Warranty Policies</h3>
                  <p className="text-xs text-gray-500">Create warranty policies for electronics, hardware, and store goods.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {policies.warranty.map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl border border-gray-200 p-5 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-extrabold text-gray-900 text-base">{item.name}</h4>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item, "warranty")}
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            item.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.isActive ? "● Active" : "○ Inactive"}
                        </button>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400 font-bold uppercase text-[10px] block">Warranty Type</span>
                          <strong className="text-emerald-700 font-extrabold">{item.warrantyType}</strong>
                        </div>
                        <div>
                          <span className="text-gray-400 font-bold uppercase text-[10px] block">Duration</span>
                          <strong className="text-gray-900 font-extrabold">{item.warrantyDuration}</strong>
                        </div>
                      </div>

                      {item.coverage && <p className="text-xs text-gray-600 leading-relaxed">{item.coverage}</p>}

                      <div className="flex items-center justify-end gap-2 border-t pt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(item)}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-emerald-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePolicy(item.id, "warranty")}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-xl border border-gray-200 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-extrabold text-gray-900">
                {editingItem ? `Edit ${activeTab.toUpperCase()} Policy` : `Create ${activeTab.toUpperCase()} Policy`}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePolicy} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {/* STORE POLICY FORM */}
              {activeTab === "generalStore" && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Policy Name *</label>
                    <Input
                      required
                      placeholder="e.g. Standard Store Policy, Electronics Store Policy"
                      value={storePolicyForm.name}
                      onChange={(e) => setStorePolicyForm({ ...storePolicyForm, name: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      placeholder="General overview of this store policy..."
                      value={storePolicyForm.description}
                      onChange={(e) => setStorePolicyForm({ ...storePolicyForm, description: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Terms &amp; Conditions</label>
                    <textarea
                      rows={3}
                      placeholder="Detailed buyer agreement and general transaction terms..."
                      value={storePolicyForm.termsConditions}
                      onChange={(e) => setStorePolicyForm({ ...storePolicyForm, termsConditions: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Customer Responsibilities</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Providing accurate address..."
                        value={storePolicyForm.customerResponsibilities}
                        onChange={(e) => setStorePolicyForm({ ...storePolicyForm, customerResponsibilities: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Seller Responsibilities</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Dispatching within 48h..."
                        value={storePolicyForm.sellerResponsibilities}
                        onChange={(e) => setStorePolicyForm({ ...storePolicyForm, sellerResponsibilities: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Order Acceptance &amp; Cancellation Rules</label>
                    <textarea
                      rows={2}
                      placeholder="Rules on order confirmation and cancellation windows..."
                      value={storePolicyForm.cancellationRules}
                      onChange={(e) => setStorePolicyForm({ ...storePolicyForm, cancellationRules: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Dispute Resolution</label>
                    <textarea
                      rows={2}
                      placeholder="How disputes are handled (arbitration, refund process)..."
                      value={storePolicyForm.disputeResolution}
                      onChange={(e) => setStorePolicyForm({ ...storePolicyForm, disputeResolution: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Effective Date</label>
                    <Input
                      type="date"
                      value={storePolicyForm.effectiveDate}
                      onChange={(e) => setStorePolicyForm({ ...storePolicyForm, effectiveDate: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                </>
              )}

              {/* PRIVACY POLICY FORM */}
              {activeTab === "privacy" && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Policy Name *</label>
                    <Input
                      required
                      placeholder="e.g. Standard Customer Privacy Policy"
                      value={privacyPolicyForm.name}
                      onChange={(e) => setPrivacyPolicyForm({ ...privacyPolicyForm, name: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Introduction</label>
                    <textarea
                      rows={2}
                      placeholder="Introduction regarding customer data privacy..."
                      value={privacyPolicyForm.introduction}
                      onChange={(e) => setPrivacyPolicyForm({ ...privacyPolicyForm, introduction: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Information Collected</label>
                    <textarea
                      rows={2}
                      placeholder="What data is collected (Name, Address, Payment info)..."
                      value={privacyPolicyForm.infoCollected}
                      onChange={(e) => setPrivacyPolicyForm({ ...privacyPolicyForm, infoCollected: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">How Information Is Used</label>
                    <textarea
                      rows={2}
                      placeholder="Order processing, customer support, marketing..."
                      value={privacyPolicyForm.howInfoUsed}
                      onChange={(e) => setPrivacyPolicyForm({ ...privacyPolicyForm, howInfoUsed: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Third-Party Services</label>
                      <textarea
                        rows={2}
                        placeholder="Logistics partners, payment gateways..."
                        value={privacyPolicyForm.thirdPartyServices}
                        onChange={(e) => setPrivacyPolicyForm({ ...privacyPolicyForm, thirdPartyServices: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Security Measures</label>
                      <textarea
                        rows={2}
                        placeholder="SSL encryption, PCI-DSS compliance..."
                        value={privacyPolicyForm.securityMeasures}
                        onChange={(e) => setPrivacyPolicyForm({ ...privacyPolicyForm, securityMeasures: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Customer Rights &amp; Contact Info</label>
                    <textarea
                      rows={2}
                      placeholder="Data deletion requests, contact email for privacy concerns..."
                      value={privacyPolicyForm.contactInfo}
                      onChange={(e) => setPrivacyPolicyForm({ ...privacyPolicyForm, contactInfo: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Effective Date</label>
                    <Input
                      type="date"
                      value={privacyPolicyForm.effectiveDate}
                      onChange={(e) => setPrivacyPolicyForm({ ...privacyPolicyForm, effectiveDate: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                </>
              )}

              {/* REFUND FORM */}
              {activeTab === "refund" && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Policy Name *</label>
                    <Input
                      required
                      placeholder="e.g. Standard 14-Day Full Refund"
                      value={refundForm.name}
                      onChange={(e) => setRefundForm({ ...refundForm, name: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Eligibility Period</label>
                      <Input
                        placeholder="e.g. 7 days, 14 days, 30 days"
                        value={refundForm.eligibilityPeriod}
                        onChange={(e) => setRefundForm({ ...refundForm, eligibilityPeriod: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Refund Type</label>
                      <select
                        value={refundForm.refundType}
                        onChange={(e) => setRefundForm({ ...refundForm, refundType: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="FULL_REFUND">Full Refund</option>
                        <option value="PARTIAL_REFUND">Partial Refund</option>
                        <option value="STORE_CREDIT">Store Credit</option>
                        <option value="EXCHANGE_ONLY">Exchange Only</option>
                        <option value="NO_REFUND">No Refund</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Description &amp; Terms</label>
                    <textarea
                      rows={2}
                      placeholder="Describe refund eligibility criteria..."
                      value={refundForm.description}
                      onChange={(e) => setRefundForm({ ...refundForm, description: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </>
              )}

              {/* RETURN FORM */}
              {activeTab === "return" && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Policy Name *</label>
                    <Input
                      required
                      placeholder="e.g. Hassle-Free 30-Day Returns"
                      value={returnForm.name}
                      onChange={(e) => setReturnForm({ ...returnForm, name: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Return Window</label>
                      <Input
                        placeholder="e.g. 14 days"
                        value={returnForm.returnWindow}
                        onChange={(e) => setReturnForm({ ...returnForm, returnWindow: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Shipping Paid By</label>
                      <select
                        value={returnForm.shippingResponsibility}
                        onChange={(e) => setReturnForm({ ...returnForm, shippingResponsibility: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="CUSTOMER">Customer Pays Return Shipping</option>
                        <option value="MERCHANT">Merchant / Store Pays</option>
                        <option value="FREE">Free Returns</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Description &amp; Instructions</label>
                    <textarea
                      rows={2}
                      placeholder="Describe return packaging and label instructions..."
                      value={returnForm.description}
                      onChange={(e) => setReturnForm({ ...returnForm, description: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </>
              )}

              {/* WARRANTY FORM */}
              {activeTab === "warranty" && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Policy Name *</label>
                    <Input
                      required
                      placeholder="e.g. 12-Month Official Store Warranty"
                      value={warrantyForm.name}
                      onChange={(e) => setWarrantyForm({ ...warrantyForm, name: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Warranty Type</label>
                      <select
                        value={warrantyForm.warrantyType}
                        onChange={(e) => setWarrantyForm({ ...warrantyForm, warrantyType: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="STORE">Store Guarantee</option>
                        <option value="MANUFACTURER">Manufacturer Warranty</option>
                        <option value="EXTENDED">Extended Protection</option>
                        <option value="NONE">No Warranty</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Warranty Duration</label>
                      <Input
                        placeholder="e.g. 12 Months, 2 Years"
                        value={warrantyForm.warrantyDuration}
                        onChange={(e) => setWarrantyForm({ ...warrantyForm, warrantyDuration: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Coverage Summary</label>
                    <textarea
                      rows={2}
                      placeholder="Describe what is covered under this warranty..."
                      value={warrantyForm.coverage}
                      onChange={(e) => setWarrantyForm({ ...warrantyForm, coverage: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="rounded-xl font-bold">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingItem ? "Update Policy" : "Save Policy"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
