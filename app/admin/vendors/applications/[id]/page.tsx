"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Eye,
  ArrowLeft,
  Store,
  User,
  Building,
  CreditCard,
  Clock,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentViewerModal } from "@/components/admin/document-viewer-modal";
import { ActionReasonModal } from "@/components/admin/action-reason-modal";
import { VendorApplicationDetailDTO } from "@/modules/admin/dto";

export default function VendorApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: storeId } = use(params);
  const router = useRouter();

  const [application, setApplication] = useState<VendorApplicationDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState(false);

  // Document Viewer Modal State
  const [viewerDoc, setViewerDoc] = useState<{ title: string; url: string | null } | null>(null);

  // Action Reason Modal State
  const [reasonModal, setReasonModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    variant: "danger" | "warning";
    actionType: "REJECT" | "REQUEST_CHANGES" | "SUSPEND";
  }>({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "",
    variant: "danger",
    actionType: "REJECT",
  });

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/vendors/applications/${storeId}`);
      if (!res.ok) {
        throw new Error("Failed to load vendor application profile");
      }
      const data = await res.json();
      setApplication(data.application);
    } catch (err: any) {
      setError(err?.message || "Failed to load application");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [storeId]);

  // APPROVE VENDOR
  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this vendor application? The store will become ACTIVE and live on AfriCart.")) {
      return;
    }

    try {
      setProcessingAction(true);
      setActionError(null);
      setActionSuccess(null);

      const res = await fetch(`/api/admin/vendors/${storeId}/approve`, {
        method: "PATCH",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Approval failed");
      }

      setActionSuccess("Vendor application approved successfully! Store is now ACTIVE.");
      await fetchDetail();
    } catch (err: any) {
      setActionError(err?.message || "Failed to approve vendor application");
    } finally {
      setProcessingAction(false);
    }
  };

  // REJECT / REQUEST CHANGES / SUSPEND SUBMIT
  const handleReasonSubmit = async (reason: string) => {
    const { actionType } = reasonModal;
    let endpoint = "";

    if (actionType === "REJECT") {
      endpoint = `/api/admin/vendors/${storeId}/reject`;
    } else if (actionType === "REQUEST_CHANGES") {
      endpoint = `/api/admin/vendors/${storeId}/request-changes`;
    } else if (actionType === "SUSPEND") {
      endpoint = `/api/admin/vendors/${storeId}/suspend`;
    }

    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Operation failed");
    }

    setActionSuccess(
      actionType === "REJECT"
        ? "Vendor application has been REJECTED."
        : actionType === "REQUEST_CHANGES"
        ? "Changes have been requested from the vendor."
        : "Vendor store has been SUSPENDED."
    );

    await fetchDetail();
  };

  // REACTIVATE SUSPENDED VENDOR
  const handleReactivate = async () => {
    if (!confirm("Reactivate this suspended vendor store? The store will become active again.")) return;

    try {
      setProcessingAction(true);
      setActionError(null);

      const res = await fetch(`/api/admin/vendors/${storeId}/reactivate`, {
        method: "PATCH",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Reactivation failed");
      }

      setActionSuccess("Vendor store reactivated successfully!");
      await fetchDetail();
    } catch (err: any) {
      setActionError(err?.message || "Failed to reactivate vendor");
    } finally {
      setProcessingAction(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p className="text-xs font-semibold text-slate-400">Loading vendor verification profile...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="bg-red-950/40 border border-red-800 p-8 rounded-3xl text-center max-w-xl mx-auto space-y-4 my-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h3 className="text-xl font-bold text-slate-100">Application Profile Not Found</h3>
        <p className="text-xs text-slate-400">{error || "Could not retrieve vendor application details."}</p>
        <Link href="/admin/vendors/applications">
          <Button className="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Applications
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/vendors/applications"
          className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Vendor Applications
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Current Application Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              application.storeStatus === "ACTIVE"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : application.storeStatus === "PENDING_APPROVAL"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : application.storeStatus === "REJECTED"
                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                : application.storeStatus === "CHANGES_REQUESTED"
                ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {application.storeStatus}
          </span>
        </div>
      </div>

      {/* Main Action Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">{application.storeName}</h1>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              /{application.storeSlug}
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <span>Owner: <strong className="text-slate-200">{application.firstName} {application.lastName}</strong> ({application.email})</span>
            <span>•</span>
            <span>Category: <strong className="text-emerald-400">{application.businessCategory}</strong></span>
          </p>
        </div>

        {/* Dynamic Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {application.storeStatus === "PENDING_APPROVAL" || application.storeStatus === "CHANGES_REQUESTED" ? (
            <>
              <Button
                onClick={() =>
                  setReasonModal({
                    isOpen: true,
                    title: "Request Changes from Vendor",
                    description: "Provide instructions for what the vendor needs to correct or upload before approval.",
                    confirmText: "Send Change Request",
                    variant: "warning",
                    actionType: "REQUEST_CHANGES",
                  })
                }
                disabled={processingAction}
                className="bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-bold px-4 h-10"
              >
                <AlertTriangle className="w-4 h-4 mr-1.5" /> Request Changes
              </Button>

              <Button
                onClick={() =>
                  setReasonModal({
                    isOpen: true,
                    title: "Reject Vendor Application",
                    description: "Provide the official reason why this application is being rejected.",
                    confirmText: "Confirm Rejection",
                    variant: "danger",
                    actionType: "REJECT",
                  })
                }
                disabled={processingAction}
                className="bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-xl text-xs font-bold px-4 h-10"
              >
                <XCircle className="w-4 h-4 mr-1.5" /> Reject Application
              </Button>

              <Button
                onClick={handleApprove}
                disabled={processingAction}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold px-6 h-10 shadow-lg shadow-emerald-600/20"
              >
                {processingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1.5" />}
                Approve Vendor Store
              </Button>
            </>
          ) : application.storeStatus === "ACTIVE" ? (
            <Button
              onClick={() =>
                setReasonModal({
                  isOpen: true,
                  title: "Suspend Vendor Store",
                  description: "Specify the administrative reason for suspending this active store.",
                  confirmText: "Suspend Store",
                  variant: "danger",
                  actionType: "SUSPEND",
                })
              }
              disabled={processingAction}
              className="bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-xl text-xs font-bold px-5 h-10"
            >
              <XCircle className="w-4 h-4 mr-1.5" /> Suspend Store
            </Button>
          ) : application.storeStatus === "SUSPENDED" ? (
            <Button
              onClick={handleReactivate}
              disabled={processingAction}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold px-6 h-10"
            >
              Reactivate Vendor Store
            </Button>
          ) : (
            <Button
              onClick={handleApprove}
              disabled={processingAction}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold px-5 h-10"
            >
              Re-Approve Vendor Application
            </Button>
          )}
        </div>
      </div>

      {/* Notifications / Alerts */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-emerald-300 text-xs font-bold flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}
      {actionError && (
        <div className="p-4 bg-red-950/60 border border-red-800 rounded-2xl text-red-300 text-xs font-bold flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-red-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Rejection / Changes Requested Reason History Alert */}
      {application.rejectionReason && (
        <div className="bg-amber-950/40 border border-amber-800/80 rounded-3xl p-6 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Latest Administrative Reason / Instructions
          </h4>
          <p className="text-xs text-amber-200/90 whitespace-pre-line leading-relaxed">
            {application.rejectionReason}
          </p>
          {application.reviewedAt && (
            <p className="text-[10px] text-amber-400/60 pt-1 font-mono">
              Recorded at: {new Date(application.reviewedAt).toLocaleString()} {application.reviewerName ? `by ${application.reviewerName}` : ""}
            </p>
          )}
        </div>
      )}

      {/* Grid Section 1: Verification Documents (CRITICAL) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" /> Submitted Verification Documents
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect uploaded identity and business credentials before approving
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Document 1: Government ID */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-200 text-sm">Government ID Document</h4>
                <p className="text-[11px] text-slate-500">National ID, Passport, or Driver's License</p>
              </div>
              {application.idDocumentUrl ? (
                <span className="text-[10px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                  Uploaded
                </span>
              ) : (
                <span className="text-[10px] font-extrabold bg-slate-800 text-slate-500 px-2.5 py-0.5 rounded-full">
                  Missing
                </span>
              )}
            </div>

            {application.idDocumentUrl ? (
              <div className="space-y-3">
                <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center group relative">
                  <img
                    src={application.idDocumentUrl}
                    alt="Government ID Document"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      onClick={() => setViewerDoc({ title: "Government ID Document", url: application.idDocumentUrl })}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
                    >
                      <Eye className="w-4 h-4 mr-1.5" /> Fullscreen Inspect
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => setViewerDoc({ title: "Government ID Document", url: application.idDocumentUrl })}
                  variant="outline"
                  className="w-full bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-bold rounded-xl"
                >
                  <Eye className="w-4 h-4 mr-2 text-emerald-400" /> Open Full Document Viewer
                </Button>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs bg-slate-900/50 rounded-xl border border-slate-800/80">
                No identity document uploaded by vendor.
              </div>
            )}
          </div>

          {/* Document 2: Business Certificate */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-200 text-sm">Business Registration Certificate</h4>
                <p className="text-[11px] text-slate-500">Official Certificate of Incorporation / Tax Doc</p>
              </div>
              {application.businessCertificateUrl ? (
                <span className="text-[10px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                  Uploaded
                </span>
              ) : (
                <span className="text-[10px] font-extrabold bg-slate-800 text-slate-500 px-2.5 py-0.5 rounded-full">
                  Missing
                </span>
              )}
            </div>

            {application.businessCertificateUrl ? (
              <div className="space-y-3">
                <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center group relative">
                  <img
                    src={application.businessCertificateUrl}
                    alt="Business Registration Certificate"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      onClick={() => setViewerDoc({ title: "Business Registration Certificate", url: application.businessCertificateUrl })}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
                    >
                      <Eye className="w-4 h-4 mr-1.5" /> Fullscreen Inspect
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => setViewerDoc({ title: "Business Registration Certificate", url: application.businessCertificateUrl })}
                  variant="outline"
                  className="w-full bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-bold rounded-xl"
                >
                  <Eye className="w-4 h-4 mr-2 text-emerald-400" /> Open Full Document Viewer
                </Button>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs bg-slate-900/50 rounded-xl border border-slate-800/80">
                No business registration certificate uploaded.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Section 2: Personal, Business, & Store Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-4 h-4 text-emerald-400" /> Owner Information
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 font-bold block uppercase text-[10px]">Full Name</span>
              <span className="font-bold text-slate-200">{application.firstName} {application.lastName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block uppercase text-[10px]">Email Address</span>
              <span className="font-mono text-slate-300">{application.email}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block uppercase text-[10px]">Phone Number</span>
              <span className="font-mono text-slate-300">{application.phone || "Not provided"}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block uppercase text-[10px]">User Account Status</span>
              <span className="font-bold text-emerald-400">{application.userStatus}</span>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building className="w-4 h-4 text-emerald-400" /> Business Details
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 font-bold block uppercase text-[10px]">Registered Business Name</span>
              <span className="font-bold text-slate-200">{application.businessName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block uppercase text-[10px]">Business Type</span>
              <span className="text-slate-300">{application.businessType || "Individual"}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block uppercase text-[10px]">Primary Category</span>
              <span className="font-bold text-emerald-400">{application.businessCategory}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block uppercase text-[10px]">Authorized Categories ({application.categories.length})</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {application.categories.map((c) => (
                  <span key={c.id} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-bold block uppercase text-[10px]">Registration / Tax ID</span>
              <span className="font-mono text-slate-300">
                Reg: {application.registrationNumber || "N/A"} | Tax: {application.taxId || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Payout & Financial Profile */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
            <CreditCard className="w-4 h-4 text-emerald-400" /> Payout Profile
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 font-bold block uppercase text-[10px]">Payout Method</span>
              <span className="font-bold text-slate-200">{application.payoutMethod || "Mobile Money"}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block uppercase text-[10px]">Provider / Network</span>
              <span className="text-slate-300">{application.payoutProvider || "MTN MoMo"}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block uppercase text-[10px]">Account Number</span>
              <span className="font-mono text-slate-300">{application.payoutAccountNumber || "Not configured"}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block uppercase text-[10px]">Account Holder Name</span>
              <span className="font-bold text-slate-200">{application.payoutAccountName || "Not configured"}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block uppercase text-[10px]">Submission Date</span>
              <span className="font-mono text-slate-400">{new Date(application.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {viewerDoc && (
        <DocumentViewerModal
          isOpen={!!viewerDoc}
          onClose={() => setViewerDoc(null)}
          title={viewerDoc.title}
          documentUrl={viewerDoc.url}
          vendorName={`${application.firstName} ${application.lastName}`}
        />
      )}

      {/* Action Reason Prompt Modal */}
      <ActionReasonModal
        isOpen={reasonModal.isOpen}
        onClose={() => setReasonModal((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={handleReasonSubmit}
        title={reasonModal.title}
        description={reasonModal.description}
        confirmButtonText={reasonModal.confirmText}
        variant={reasonModal.variant}
      />
    </div>
  );
}
