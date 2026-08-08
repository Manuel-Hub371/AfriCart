"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/audit-logs?limit=100");
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
        }
      } catch (err) {
        console.error("Failed to fetch audit logs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-emerald-400" /> Platform Security & Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log of all administrative decisions, vendor approvals, rejections, and system state mutations.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          Logged Events: {logs.length}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-xs font-semibold text-slate-400">Loading audit records...</p>
          </div>
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Actor / Admin</th>
                  <th className="py-4 px-6">Action Event</th>
                  <th className="py-4 px-6">Target Resource</th>
                  <th className="py-4 px-6">Metadata Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 text-slate-400 text-[11px]">
                      {new Date(l.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-200">{l.actor}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700 text-[10px] font-bold">
                        {l.action}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-300">{l.targetResource}</td>
                    <td className="py-4 px-6 text-slate-400 text-[11px]">
                      {l.metadata ? JSON.stringify(l.metadata) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs">No audit logs recorded yet.</div>
        )}
      </div>
    </div>
  );
}
