"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminSidebar } from "./admin-sidebar";
import { Bell, ShieldCheck, Search, Store } from "lucide-react";
import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
        {/* Admin Sidebar */}
        <AdminSidebar />

        {/* Main Admin Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
          {/* Top Navbar */}
          <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Authorized Admin Mode
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/vendor"
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5 text-emerald-400" /> Vendor View
              </Link>
              <Link
                href="/"
                target="_blank"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/80 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                Storefront Live ↗
              </Link>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-950">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
