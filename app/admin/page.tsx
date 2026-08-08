"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Store,
  FileCheck,
  Package,
  ShoppingBag,
  DollarSign,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminMetricsDTO } from "@/modules/admin/dto";

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<AdminMetricsDTO | null>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashRes, logsRes] = await Promise.all([
        fetch("/api/admin/dashboard"),
        fetch("/api/admin/audit-logs?limit=5"),
      ]);

      if (!dashRes.ok) {
        throw new Error("Failed to fetch dashboard metrics");
      }

      const dashData = await dashRes.json();
      setMetrics(dashData.metrics);

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setRecentLogs(logsData.logs || []);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load admin metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        <p className="text-sm font-semibold text-slate-400">Loading real-time database metrics...</p>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="bg-red-950/40 border border-red-800 p-8 rounded-3xl text-center max-w-xl mx-auto space-y-4 my-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
        <h3 className="text-xl font-bold text-slate-100">Database Metric Load Failure</h3>
        <p className="text-sm text-slate-400">{error || "Could not retrieve platform state."}</p>
        <Button onClick={fetchDashboardData} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold">
          <RefreshCw className="w-4 h-4 mr-2" /> Retry Fetch
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            Platform Command Center
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full uppercase tracking-wider">
              Live Production State
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Authoritative marketplace metrics aggregated directly from the database.
          </p>
        </div>
        <Button
          onClick={fetchDashboardData}
          variant="outline"
          className="bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 rounded-xl text-xs font-bold self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-2 text-emerald-400" /> Refresh Data
        </Button>
      </div>

      {/* Critical Verification Alert Banner */}
      {metrics.pendingApplications > 0 && (
        <div className="bg-amber-950/50 border border-amber-800/80 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-amber-950/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-200">
                {metrics.pendingApplications} Vendor {metrics.pendingApplications === 1 ? "Application" : "Applications"} Awaiting Review
              </h3>
              <p className="text-xs text-amber-300/80 mt-0.5">
                Vendors cannot operate or list products until their store applications and verification documents are reviewed.
              </p>
            </div>
          </div>
          <Link href="/admin/vendors/applications">
            <Button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs px-5 shrink-0 shadow-md">
              Review Applications <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Primary Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Pending Applications */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Applications</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-100 mt-4 font-mono">{metrics.pendingApplications}</p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Requires Admin Verification</span>
            <Link href="/admin/vendors/applications" className="text-emerald-400 font-bold hover:underline">
              View List →
            </Link>
          </div>
        </div>

        {/* Metric 2: Active Stores */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Stores</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-100 mt-4 font-mono">{metrics.activeStores}</p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">{metrics.approvedVendors} Approved Vendors</span>
            <Link href="/admin/stores" className="text-emerald-400 font-bold hover:underline">
              Manage →
            </Link>
          </div>
        </div>

        {/* Metric 3: Total Users */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Accounts</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-100 mt-4 font-mono">{metrics.totalUsers}</p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">{metrics.totalVendors} Vendor Profiles</span>
            <Link href="/admin/users" className="text-emerald-400 font-bold hover:underline">
              Inspect Users →
            </Link>
          </div>
        </div>

        {/* Metric 4: Platform Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Delivered GMV</span>
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 mt-4 font-mono">
            ${metrics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">{metrics.totalOrders} Total Orders</span>
            <Link href="/admin/finance" className="text-emerald-400 font-bold hover:underline">
              Financial Breakdown →
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Status Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Rejected Applications</span>
          <p className="text-xl font-bold text-red-400 mt-1 font-mono">{metrics.rejectedApplications}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Changes Requested</span>
          <p className="text-xl font-bold text-amber-400 mt-1 font-mono">{metrics.changesRequestedApplications}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Suspended Stores</span>
          <p className="text-xl font-bold text-slate-300 mt-1 font-mono">{metrics.suspendedStores}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Catalog Products</span>
          <p className="text-xl font-bold text-blue-400 mt-1 font-mono">{metrics.totalProducts}</p>
        </div>
      </div>

      {/* Recent Admin Audit Activity */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Recent Administrative Audit Trail
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Recorded administrative decisions and security actions</p>
          </div>
          <Link href="/admin/audit-logs">
            <Button variant="ghost" className="text-xs text-emerald-400 hover:text-emerald-300 font-bold">
              View Full Audit Log →
            </Button>
          </Link>
        </div>

        {recentLogs.length > 0 ? (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-emerald-400 font-mono font-bold text-[10px] uppercase">
                    {log.action}
                  </span>
                  <span className="font-semibold text-slate-200">{log.actor}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-slate-400 font-mono">{log.targetResource}</span>
                </div>
                <span className="text-slate-500 font-mono text-[11px]">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-6">No administrative audit events recorded yet.</p>
        )}
      </div>
    </div>
  );
}
