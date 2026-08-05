"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Building2, Smartphone, Plus, Trash2, CreditCard, DollarSign } from "lucide-react";

export interface PaymentModule {
  id: string;
  type: "bank" | "momo" | "paypal" | "stripe" | "crypto";
  name: string;
  providerName: string; // e.g., "GCB Bank" or "MTN MoMo" or "PayPal Business"
  accountNumber: string; // e.g., Account No or Phone No or PayPal Email
  accountHolder: string;
  isPrimary: boolean;
}

interface PaymentSettingsFormProps {
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

export function PaymentSettingsForm({ onSave, initialData }: PaymentSettingsFormProps) {
  const [taxId, setTaxId] = useState(initialData?.taxId || "TIN-GH-9847192");
  const [paymentModules, setPaymentModules] = useState<PaymentModule[]>(
    initialData?.paymentModules || [
      {
        id: "pm-1",
        type: "bank",
        name: "Corporate Bank Account",
        providerName: "GCB Bank Ghana",
        accountNumber: "1029384756102",
        accountHolder: "Manuel Darko",
        isPrimary: true,
      },
      {
        id: "pm-2",
        type: "momo",
        name: "MTN Mobile Money Payout",
        providerName: "MTN MoMo",
        accountNumber: "0549820094",
        accountHolder: "Manuel Darko",
        isPrimary: false,
      },
    ]
  );

  const [saving, setSaving] = useState(false);

  const handleAddModule = () => {
    setPaymentModules((prev) => [
      ...prev,
      {
        id: `pm-${Date.now()}`,
        type: "momo",
        name: "New Payment Method",
        providerName: "MTN MoMo",
        accountNumber: "",
        accountHolder: "",
        isPrimary: prev.length === 0,
      },
    ]);
  };

  const handleUpdateModule = (id: string, field: keyof PaymentModule, value: any) => {
    setPaymentModules((prev) =>
      prev.map((pm) => {
        if (pm.id === id) {
          return { ...pm, [field]: value };
        }
        if (field === "isPrimary" && value === true) {
          return { ...pm, isPrimary: false };
        }
        return pm;
      })
    );
  };

  const handleRemoveModule = (id: string) => {
    setPaymentModules((prev) => prev.filter((pm) => pm.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        taxId,
        paymentModules,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Multiple Payment &amp; Payout Modules</h2>
        <p className="text-gray-600 text-sm">
          Add and manage multiple active payment methods (Bank accounts, Mobile Money numbers, PayPal, Crypto) to receive store payouts.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Configured Payment Modules ({paymentModules.length})</h3>
          <Button
            type="button"
            onClick={handleAddModule}
            variant="outline"
            className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Payment Module
          </Button>
        </div>

        {paymentModules.map((pm, idx) => (
          <div key={pm.id} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-gray-900 text-sm">Module #{idx + 1}</span>
                {pm.isPrimary && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold uppercase">
                    Primary Payout
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!pm.isPrimary && (
                  <Button
                    type="button"
                    onClick={() => handleUpdateModule(pm.id, "isPrimary", true)}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-600 hover:text-emerald-600"
                  >
                    Set as Primary
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={() => handleRemoveModule(pm.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-900 text-xs">Payment Type</label>
                <select
                  value={pm.type}
                  onChange={(e) => handleUpdateModule(pm.id, "type", e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 focus:outline-none bg-white"
                >
                  <option value="bank">Direct Bank Transfer</option>
                  <option value="momo">Mobile Money (MoMo / Telecel / AT)</option>
                  <option value="paypal">PayPal International</option>
                  <option value="stripe">Stripe / Card Gateway</option>
                  <option value="crypto">Cryptocurrency / Web3 Wallet</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-900 text-xs">Module Label Name</label>
                <Input
                  type="text"
                  value={pm.name}
                  onChange={(e) => handleUpdateModule(pm.id, "name", e.target.value)}
                  placeholder="e.g. Primary Corporate Account"
                  className="bg-white rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-900 text-xs">Bank / Provider Name</label>
                <Input
                  type="text"
                  value={pm.providerName}
                  onChange={(e) => handleUpdateModule(pm.id, "providerName", e.target.value)}
                  placeholder="e.g. GCB Bank / MTN MoMo"
                  className="bg-white rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-900 text-xs">Account Number / Phone / Email</label>
                <Input
                  type="text"
                  value={pm.accountNumber}
                  onChange={(e) => handleUpdateModule(pm.id, "accountNumber", e.target.value)}
                  placeholder="e.g. 1029384756102 or 0549820094"
                  className="bg-white rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-gray-900 text-xs">Account Holder Name</label>
                <Input
                  type="text"
                  value={pm.accountHolder}
                  onChange={(e) => handleUpdateModule(pm.id, "accountHolder", e.target.value)}
                  placeholder="Full name registered on account"
                  className="bg-white rounded-xl text-sm"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="space-y-2 pt-4 border-t">
          <label className="font-bold text-gray-900 text-sm">Tax Identification Number (TIN / VAT ID)</label>
          <Input
            type="text"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            className="rounded-xl border-gray-200 text-sm"
          />
        </div>
      </div>

      <div className="pt-4 border-t flex justify-end">
        <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6">
          <Save className="h-4 w-4 mr-2" /> {saving ? "Saving..." : "Save Payment Modules"}
        </Button>
      </div>
    </form>
  );
}
