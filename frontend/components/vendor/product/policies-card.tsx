"use client";

import { Card } from "@/components/ui/card";
import { ShieldCheck, RotateCcw, Award, Plus, AlertCircle } from "lucide-react";
import Link from "next/link";

interface PoliciesCardProps {
  refundPolicies?: any[];
  returnPolicies?: any[];
  warrantyPolicies?: any[];
  refundPolicyId?: string | null;
  returnPolicyId?: string | null;
  warrantyPolicyId?: string | null;
  onChangeRefundPolicyId?: (id: string | null) => void;
  onChangeReturnPolicyId?: (id: string | null) => void;
  onChangeWarrantyPolicyId?: (id: string | null) => void;
}

export default function PoliciesCard({
  refundPolicies = [],
  returnPolicies = [],
  warrantyPolicies = [],
  refundPolicyId = null,
  returnPolicyId = null,
  warrantyPolicyId = null,
  onChangeRefundPolicyId,
  onChangeReturnPolicyId,
  onChangeWarrantyPolicyId,
}: PoliciesCardProps) {
  const activeRefunds = refundPolicies.filter((p) => p.isActive !== false);
  const activeReturns = returnPolicies.filter((p) => p.isActive !== false);
  const activeWarranties = warrantyPolicies.filter((p) => p.isActive !== false);

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" /> Product Protection &amp; Terms
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Assign reusable Refund, Return, and Warranty policies created in your Store Settings.
          </p>
        </div>
        <Link href="/vendor/store?section=policies">
          <span className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" /> Manage Policies
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Refund Policy Dropdown */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <RotateCcw className="h-3.5 w-3.5 text-emerald-600" /> Refund Policy
          </label>
          {activeRefunds.length > 0 ? (
            <select
              value={refundPolicyId || ""}
              onChange={(e) => onChangeRefundPolicyId && onChangeRefundPolicyId(e.target.value || null)}
              className="w-full h-11 px-3 rounded-xl border border-gray-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">No Refund Policy Selected</option>
              {activeRefunds.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.eligibilityPeriod || "Standard"})
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
              <span>No refund policies.</span>
              <Link href="/vendor/store?section=policies" className="font-bold underline text-amber-800">
                + Create
              </Link>
            </div>
          )}
        </div>

        {/* Return Policy Dropdown */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Return Policy
          </label>
          {activeReturns.length > 0 ? (
            <select
              value={returnPolicyId || ""}
              onChange={(e) => onChangeReturnPolicyId && onChangeReturnPolicyId(e.target.value || null)}
              className="w-full h-11 px-3 rounded-xl border border-gray-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">No Return Policy Selected</option>
              {activeReturns.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.returnWindow || "Standard"})
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
              <span>No return policies.</span>
              <Link href="/vendor/store?section=policies" className="font-bold underline text-amber-800">
                + Create
              </Link>
            </div>
          )}
        </div>

        {/* Warranty Policy Dropdown */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-emerald-600" /> Warranty Policy
          </label>
          {activeWarranties.length > 0 ? (
            <select
              value={warrantyPolicyId || ""}
              onChange={(e) => onChangeWarrantyPolicyId && onChangeWarrantyPolicyId(e.target.value || null)}
              className="w-full h-11 px-3 rounded-xl border border-gray-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">No Warranty Policy Selected</option>
              {activeWarranties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.warrantyDuration || "No duration"})
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
              <span>No warranty policies.</span>
              <Link href="/vendor/store?section=policies" className="font-bold underline text-amber-800">
                + Create
              </Link>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
