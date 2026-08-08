"use client";

import { useEffect, useState } from "react";
import { DollarSign, Store, TrendingUp, Wallet, Loader2 } from "lucide-react";

export default function AdminFinancePage() {
  const [finance, setFinance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFinance() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/finance");
        if (res.ok) {
          const data = await res.json();
          setFinance(data);
        }
      } catch (err) {
        console.error("Failed to fetch finance:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFinance();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p className="text-xs font-semibold text-slate-400">Loading financial ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-emerald-400" /> Platform Financial Ledger & Payouts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real backend marketplace transaction volume, 5% platform commissions, and merchant payout allocations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gross Delivered Volume</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100 font-mono">
            ${(finance?.grossVolume || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500">Total delivered order volume processed through platform</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AfriCart Commission (5%)</span>
            <DollarSign className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono">
            ${(finance?.platformRevenue || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500">Net platform revenue earned from marketplace transactions</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Vendor Net Payout Pool</span>
            <Wallet className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100 font-mono">
            ${(finance?.vendorPayoutsTotal || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500">95% allocated for distribution to active vendor accounts</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm">Financial Allocation Parameters</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-500 font-bold block">Commission Model</span>
            <span className="font-bold text-slate-200 mt-1 block">5.0% Standard Flat Fee</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-500 font-bold block">Active Merchant Outlets</span>
            <span className="font-bold text-emerald-400 mt-1 block">{finance?.activeStoresCount || 0} Active Stores</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-500 font-bold block">Settled Transactions</span>
            <span className="font-bold text-blue-400 mt-1 block">{finance?.completedOrdersCount || 0} Orders</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-500 font-bold block">Settlement Frequency</span>
            <span className="font-bold text-slate-200 mt-1 block">Weekly Automatic MoMo / Bank</span>
          </div>
        </div>
      </div>
    </div>
  );
}
