"use client";

import { useEffect, useState } from "react";
import { Users, ShieldCheck, Loader2 } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/users?limit=50");
        if (res.ok) {
          const data = await res.json();
          setUsers(data.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-3">
            <Users className="w-6 h-6 text-emerald-400" /> Platform User Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registered user accounts, assigned RBAC roles, and authentication statuses.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          Total Users: {users.length}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-xs font-semibold text-slate-400">Loading user accounts...</p>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-4 px-6">User Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Assigned Roles</th>
                  <th className="py-4 px-6">Account Status</th>
                  <th className="py-4 px-6">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-100">{u.name}</td>
                    <td className="py-4 px-6 text-slate-300 font-mono">{u.email}</td>
                    <td className="py-4 px-6 text-slate-400 font-mono">{u.phone || "—"}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r: string) => (
                          <span
                            key={r}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r === "ADMIN"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : r === "VENDOR"
                                ? "bg-blue-950 text-blue-400 border border-blue-800"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-400">{u.status}</td>
                    <td className="py-4 px-6 text-slate-400 font-mono">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs">No user accounts found.</div>
        )}
      </div>
    </div>
  );
}
