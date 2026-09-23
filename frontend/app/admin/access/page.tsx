"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Inbox,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch, parseApiResponse } from "@/lib/api/client";

interface AdminAccessRequest {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
}

export default function AdminAccessPage() {
  const [requests, setRequests] = useState<AdminAccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch("/api/admin/auth/requests");
      if (!res.ok) throw new Error("Failed to load admin access requests");
      const data = await parseApiResponse<{ data?: { items?: AdminAccessRequest[] } }>(res);
      setRequests(data?.data?.items || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load admin access requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const refresh = () => {
    setNotice(null);
    setRejectingId(null);
    setRejectReason("");
    fetchRequests();
  };

  const approve = async (request: AdminAccessRequest) => {
    setBusyId(request.id);
    setError(null);
    setNotice(null);
    try {
      const res = await apiFetch(`/api/admin/auth/requests/${request.id}/approve`, {
        method: "POST",
      });
      const data = await parseApiResponse<any>(res);
      if (!res.ok) throw new Error(data?.error || "Approval failed");
      setNotice(`Access granted to ${request.firstName} ${request.lastName}.`);
      refresh();
    } catch (err: any) {
      setError(err?.message || "Approval failed");
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (request: AdminAccessRequest) => {
    if (!rejectReason.trim()) {
      setError("Add a reason before rejecting the request.");
      return;
    }
    setBusyId(request.id);
    setError(null);
    setNotice(null);
    try {
      const res = await apiFetch(`/api/admin/auth/requests/${request.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason.trim() }),
      });
      const data = await parseApiResponse<any>(res);
      if (!res.ok) throw new Error(data?.error || "Rejection failed");
      setNotice(`Request from ${request.firstName} ${request.lastName} was rejected.`);
      refresh();
    } catch (err: any) {
      setError(err?.message || "Rejection failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-emerald-400" /> Admin Access Requests
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review people requesting administrator access. No role is granted on registration — you decide.
          </p>
        </div>
        <Button
          onClick={refresh}
          variant="outline"
          disabled={loading}
          className="bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 rounded-xl text-xs font-bold self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-2 text-emerald-400 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950/50 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 font-semibold flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> {notice}
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-300 font-semibold flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
          <p className="text-sm font-semibold text-slate-400">Loading access requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-1">No Pending Requests</h3>
          <p className="text-xs text-slate-400">
            New administrator access requests will appear here for your review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 rounded-full bg-emerald-700/20 border border-emerald-600/40 text-emerald-300 font-bold flex items-center justify-center text-sm shrink-0">
                  {request.firstName?.[0]}
                  {request.lastName?.[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-100 truncate">
                    {request.firstName} {request.lastName}
                  </p>
                  <p className="text-xs text-emerald-400 font-mono truncate">{request.email}</p>
                  <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Requested {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                {rejectingId === request.id ? (
                  <div className="flex flex-col gap-2 w-full sm:w-72">
                    <input
                      type="text"
                      placeholder="Rejection reason (required)"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="h-9 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-600 text-xs px-3 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => reject(request)}
                        disabled={busyId === request.id}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold h-9"
                      >
                        {busyId === request.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />} Confirm Reject
                      </Button>
                      <Button
                        onClick={() => {
                          setRejectingId(null);
                          setRejectReason("");
                        }}
                        disabled={busyId === request.id}
                        variant="ghost"
                        className="text-slate-400 hover:text-slate-200 rounded-lg text-xs font-bold h-9"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => approve(request)}
                      disabled={busyId === request.id}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold px-5 h-10"
                    >
                      {busyId === request.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}{" "}
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        setRejectingId(request.id);
                        setRejectReason("");
                        setError(null);
                      }}
                      disabled={busyId === request.id}
                      variant="outline"
                      className="bg-slate-800 hover:bg-red-950/60 text-red-400 border-slate-700 hover:border-red-800 rounded-xl text-xs font-bold px-5 h-10"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}