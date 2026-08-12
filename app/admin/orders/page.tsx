"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/orders?limit=50");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-emerald-400" /> Platform Order Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real order flow across all customer purchases and vendor fulfillments.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          Total Orders: {orders.length}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-xs font-semibold text-slate-400">Loading orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Fulfilling Merchant</th>
                  <th className="py-4 px-6">Items</th>
                  <th className="py-4 px-6">Total Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-100">#{o.orderId}</td>
                    <td className="py-4 px-6 text-slate-200">
                      <div>{o.customerName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{o.customerEmail}</div>
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-400">{o.storeName}</td>
                    <td className="py-4 px-6 font-mono text-slate-300">{o.itemCount} items</td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-100">GH₵{o.totalAmount.toFixed(2)}</td>
                    <td className="py-4 px-6 font-bold text-emerald-400">{o.status}</td>
                    <td className="py-4 px-6 text-slate-400 font-mono">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs">No orders recorded in system.</div>
        )}
      </div>
    </div>
  );
}
