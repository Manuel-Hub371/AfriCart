"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VendorApplicationItemDTO } from "@/modules/admin/dto";

export default function VendorApplicationsPage() {
  const [applications, setApplications] = useState<VendorApplicationItemDTO[]>([]);
  const [statusFilter, setStatusFilter] = useState("PENDING_APPROVAL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        status: statusFilter,
        search: searchQuery,
        page: page.toString(),
        limit: "15",
      });

      const res = await fetch(`/api/admin/vendors/applications?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch vendor applications");
      }

      const data = await res.json();
      setApplications(data.items || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCount(data.pagination?.total || 0);
    } catch (err: any) {
      setError(err?.message || "Failed to load vendor applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchApplications();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 w-fit">
            <Clock className="w-3.5 h-3.5" /> Pending Approval
          </span>
        );
      case "ACTIVE":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active / Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1.5 w-fit">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case "CHANGES_REQUESTED":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1.5 w-fit">
            <AlertTriangle className="w-3.5 h-3.5" /> Changes Requested
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1.5 w-fit">
            Suspended
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 w-fit">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-3">
            <FileCheck className="w-6 h-6 text-emerald-400" /> Vendor Applications & Verification
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review submitted vendor applications, inspect business documents, and grant or deny selling privileges.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          Showing {applications.length} of {totalCount} records
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          {[
            { id: "PENDING_APPROVAL", label: "Pending Review" },
            { id: "CHANGES_REQUESTED", label: "Changes Requested" },
            { id: "ACTIVE", label: "Approved" },
            { id: "REJECTED", label: "Rejected" },
            { id: "ALL", label: "All Statuses" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full lg:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search vendor name, store, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs rounded-xl h-10"
            />
          </div>
          <Button type="submit" className="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold h-10 px-4">
            Search
          </Button>
        </form>
      </div>

      {/* Applications Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-xs font-medium">Fetching vendor applications...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400 text-xs font-semibold">{error}</div>
        ) : applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-4 px-6">Vendor / Owner</th>
                  <th className="py-4 px-6">Business & Store Name</th>
                  <th className="py-4 px-6">Categories</th>
                  <th className="py-4 px-6">Submitted Date</th>
                  <th className="py-4 px-6">Documents</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors group">
                    {/* Vendor / Owner */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-100 text-sm">{app.vendorName}</div>
                      <div className="text-slate-400 text-[11px] font-mono mt-0.5">{app.vendorEmail}</div>
                      {app.vendorPhone && <div className="text-slate-500 text-[10px]">{app.vendorPhone}</div>}
                    </td>

                    {/* Business & Store */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-emerald-400">{app.storeName}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        {app.businessName} • <span className="text-slate-500">{app.businessType || "Individual"}</span>
                      </div>
                      <div className="text-slate-500 text-[10px]">
                        {app.city}, {app.country}
                      </div>
                    </td>

                    {/* Categories */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {app.categories.map((cat) => (
                          <span
                            key={cat}
                            className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">
                      {new Date(app.submittedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Verification Documents */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        {app.hasIdDocument ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold flex items-center gap-1">
                            <FileText className="w-3 h-3" /> ID Doc
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-500 text-[10px]">No ID</span>
                        )}

                        {app.hasBusinessCert ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Cert
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-500 text-[10px]">No Cert</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">{getStatusBadge(app.status)}</td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <Link href={`/admin/vendors/applications/${app.id}`}>
                        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold px-3.5 py-1.5 h-8">
                          Review Verification <ExternalLink className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <FileCheck className="w-12 h-12 mx-auto text-slate-600 opacity-50" />
            <p className="text-sm font-semibold text-slate-400">No vendor applications matching current criteria.</p>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                variant="outline"
                className="bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-bold rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                variant="outline"
                className="bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-bold rounded-xl"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
