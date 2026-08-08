"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileCheck,
  Store,
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  ShieldAlert,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = [
    {
      title: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: "Vendor Applications",
      href: "/admin/vendors/applications",
      icon: FileCheck,
      badge: "Verification",
    },
    {
      title: "All Vendors",
      href: "/admin/vendors",
      icon: Store,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Stores",
      href: "/admin/stores",
      icon: Store,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      title: "Finance & Payouts",
      href: "/admin/finance",
      icon: DollarSign,
    },
    {
      title: "Audit Logs",
      href: "/admin/audit-logs",
      icon: ShieldAlert,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col justify-between min-h-screen border-r border-slate-800 shrink-0">
      <div>
        {/* Header / Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
              A
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight block leading-none">
                AfriCart
              </span>
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3 h-3" /> Admin Control
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-400"}`} />
                  <span>{item.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-emerald-200 opacity-80" />}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-700/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shrink-0">
              {user?.firstName?.[0] || "A"}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-100 truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName}` : "Administrator"}
              </p>
              <p className="text-[10px] text-emerald-400 font-mono truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            title="Logout"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
