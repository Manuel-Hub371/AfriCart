"use client";

import { useEffect, useState } from "react";
import { Package, ExternalLink, Loader2 } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/products?limit=50");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-3">
            <Package className="w-6 h-6 text-emerald-400" /> Marketplace Product Catalog Oversight
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global catalog inventory across all active vendor stores.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          Total Products: {products.length}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-xs font-semibold text-slate-400">Loading catalog products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-4 px-6">Product Item</th>
                  <th className="py-4 px-6">Merchant Store</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Stock</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-9 h-9 object-cover rounded-lg border border-slate-800" />
                        ) : (
                          <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 font-bold">P</div>
                        )}
                        <div>
                          <p className="font-bold text-slate-100">{p.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">ID: {p.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-400">{p.storeName}</td>
                    <td className="py-4 px-6 text-slate-300">{p.category}</td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-100">GH₵{p.price.toFixed(2)}</td>
                    <td className="py-4 px-6 font-mono text-slate-300">{p.stock} units</td>
                    <td className="py-4 px-6 font-bold text-emerald-400">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs">No products in catalog.</div>
        )}
      </div>
    </div>
  );
}
