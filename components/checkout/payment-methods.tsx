"use client";

import { useState } from "react";
import { Smartphone, Check, Plus, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PaymentMethodsProps {
  savedPaymentMethods: any[];
  selectedPaymentMethod: any | null;
  onSelectPaymentMethod: (pm: any) => void;
  onAddNewPaymentMethod: (data: { provider: string; phone: string; accountName: string; isDefault?: boolean }) => Promise<void>;
}

export default function PaymentMethods({
  savedPaymentMethods,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  onAddNewPaymentMethod,
}: PaymentMethodsProps) {
  const [showAddForm, setShowAddForm] = useState(savedPaymentMethods.length === 0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newProvider, setNewProvider] = useState("MTN");
  const [newPhone, setNewPhone] = useState("");
  const [newAccountName, setNewAccountName] = useState("");

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone.trim() || !newAccountName.trim()) {
      setError("Please enter phone number and account name");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onAddNewPaymentMethod({
        provider: newProvider,
        phone: newPhone,
        accountName: newAccountName,
        isDefault: true,
      });
      setShowAddForm(false);
      setNewPhone("");
      setNewAccountName("");
    } catch (err: any) {
      setError(err.message || "Failed to save payment method");
    } finally {
      setIsSaving(false);
    }
  };

  const getProviderBadge = (provider: string) => {
    const p = (provider || "").toLowerCase();
    if (p.includes("mtn")) return { name: "MTN MoMo", bg: "bg-amber-100 text-amber-900 border-amber-300" };
    if (p.includes("telecel") || p.includes("voda")) return { name: "Telecel Cash", bg: "bg-red-100 text-red-900 border-red-300" };
    return { name: "AT Money", bg: "bg-blue-100 text-blue-900 border-blue-300" };
  };

  return (
    <div className="space-y-6">
      {/* Mobile Money Only Header Banner */}
      <div className="flex items-center justify-between p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-2xs shrink-0">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
              Mobile Money Payment
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                Official AfriCart Channel
              </span>
            </h3>
            <p className="text-xs text-gray-600">Fast, instant authorization via MTN MoMo, Telecel Cash & AT Money</p>
          </div>
        </div>
      </div>

      {/* Saved Payment Methods List from Customer Dashboard */}
      {savedPaymentMethods.length > 0 && !showAddForm && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Select Saved Payment Method ({savedPaymentMethods.length})
            </label>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add New MoMo Account
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedPaymentMethods.map((pm) => {
              const badge = getProviderBadge(pm.provider || pm.details?.provider);
              const isSelected = selectedPaymentMethod?.id === pm.id;
              const phoneDisplay = pm.phone || pm.accountNumber || pm.details?.phone || "024 XXX XXXX";
              const holderDisplay = pm.accountName || pm.details?.accountName || "Account Holder";

              return (
                <div
                  key={pm.id}
                  onClick={() => onSelectPaymentMethod(pm)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-600/30 shadow-xs"
                      : "bg-white border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300 bg-white"}`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md border ${badge.bg}`}>
                        {badge.name}
                      </span>
                    </div>
                    {pm.isDefault && (
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5">
                    <p className="text-xs font-bold text-gray-900">{holderDisplay}</p>
                    <p className="text-xs text-gray-600 font-medium tracking-wide mt-0.5">{phoneDisplay}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add New Payment Method Inline Form */}
      {(showAddForm || savedPaymentMethods.length === 0) && (
        <form onSubmit={handleCreateNew} className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200/80 pb-2.5">
            <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
              Add Mobile Money Payment Method
            </h4>
            {savedPaymentMethods.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-700"
              >
                Use Saved Method
              </button>
            )}
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Network Provider *
              </label>
              <select
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value)}
                className="w-full h-9 px-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              >
                <option value="MTN">MTN Mobile Money</option>
                <option value="Telecel">Telecel Cash (Vodafone)</option>
                <option value="AT">AT Money (AirtelTigo)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Mobile Number *
              </label>
              <Input
                required
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="024 XXX XXXX"
                className="h-9 text-xs rounded-xl bg-white border-gray-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Account Holder Name *
              </label>
              <Input
                required
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                placeholder="Name as registered on SIM card"
                className="h-9 text-xs rounded-xl bg-white border-gray-200"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              Saves automatically to your Customer Dashboard profile
            </p>
            <Button
              type="submit"
              disabled={isSaving}
              className="h-8 px-4 text-xs font-bold gap-1 rounded-xl gradient-primary text-white"
            >
              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              <span>{isSaving ? "Saving..." : "Save & Use for Order"}</span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
