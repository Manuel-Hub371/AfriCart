"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Store as StoreIcon, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminStoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStores() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/stores?limit=50");
        if (res.ok) {
          const data = await res.json();
          setStores(data.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch stores:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStores();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-3">
            <StoreIcon className="w-6 h-6 text-emerald-400" /> Store Directory Oversight
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Full oversight of merchant storefronts, product catalogs, and order volumes.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          Total Stores: {stores.length}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-xs font-semibold text-slate-400">Loading stores...</p>
          </div>
        ) : stores.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-4 px-6">Store Name</th>
                  <th className="py-4 px-6">Slug</th>
                  <th className="py-4 px-6">Owner</th>
                  <th className="py-4 px-6">Products</th>
                  <th className="py-4 px-6">Orders</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {stores.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-100">{s.name}</td>
                    <td className="py-4 px-6 text-slate-400 font-mono">/{s.slug}</td>
                    <td className="py-4 px-6 text-slate-300">{s.owner}</td>
                    <td className="py-4 px-6 font-mono text-emerald-400">{s.productCount}</td>
                    <td className="py-4 px-6 font-mono text-blue-400">{s.orderCount}</td>
                    <td className="py-4 px-6 font-bold text-emerald-400">{s.status}</td>
                    <td className="py-4 px-6 text-right">
                      <Link href={`/admin/vendors/applications/${s.id}`}>
                        <Button className="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold px-3 py-1 h-7">
                          Inspect <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs">No stores available.</div>
        )}
      </div>
    </div>
  );
}
