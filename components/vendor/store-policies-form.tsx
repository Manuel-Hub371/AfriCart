"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, ShieldCheck, RotateCcw, Truck, FileText, Layers } from "lucide-react";
import { ReusablePoliciesManager } from "@/components/vendor/reusable-policies-manager";

interface StorePoliciesFormProps {
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

export function StorePoliciesForm({ onSave, initialData }: StorePoliciesFormProps) {
  const [privacyPolicy, setPrivacyPolicy] = useState(
    initialData?.privacyPolicy ||
      "Your privacy is essential to us. We do not share your personal data with third parties except for order fulfillment."
  );
  const [termsConditions, setTermsConditions] = useState(
    initialData?.termsConditions ||
      "By purchasing from our store, you agree to our standard terms of service and buyer protection rules."
  );

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setPrivacyPolicy(initialData.privacyPolicy || privacyPolicy);
      setTermsConditions(initialData.termsConditions || termsConditions);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        privacyPolicy,
        termsConditions,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Dynamic Reusable Product Policies Manager */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
        <ReusablePoliciesManager />
      </div>

      {/* Global Terms & Privacy Policy */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-8">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-1">Global Store Terms &amp; Privacy</h2>
          <p className="text-gray-600 text-sm">
            Set default privacy policies and legal terms displayed on your public storefront.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-bold text-gray-900 text-sm">
              <FileText className="h-4 w-4 text-emerald-600" /> Store Privacy Policy
            </label>
            <textarea
              rows={4}
              value={privacyPolicy}
              onChange={(e) => setPrivacyPolicy(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="Detail how customer data is processed..."
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-bold text-gray-900 text-sm">
              <FileText className="h-4 w-4 text-emerald-600" /> Terms &amp; Conditions
            </label>
            <textarea
              rows={4}
              value={termsConditions}
              onChange={(e) => setTermsConditions(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="Detail standard purchase agreements and liability limits..."
            />
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-11 font-bold">
            <Save className="h-4 w-4 mr-2" /> {saving ? "Saving..." : "Save Store Terms"}
          </Button>
        </div>
      </form>
    </div>
  );
}
