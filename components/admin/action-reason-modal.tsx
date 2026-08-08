"use client";

import { useState } from "react";
import { X, AlertTriangle, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  title: string;
  description: string;
  confirmButtonText: string;
  variant?: "danger" | "warning";
}

export function ActionReasonModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  confirmButtonText,
  variant = "danger",
}: ActionReasonModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 5) {
      setError("Please provide a detailed reason (at least 5 characters).");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(reason.trim());
      setReason("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Operation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                isDanger
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">{title}</h3>
              <p className="text-xs text-slate-400">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Reason / Admin Notes <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
              placeholder="Specify the exact reason or instructions for the vendor..."
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 rounded-xl text-sm min-h-[120px] p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              This message will be recorded in the audit logs and sent to the vendor as an official notification.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold px-5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || reason.trim().length < 5}
              className={`rounded-xl text-xs font-bold px-6 text-white ${
                isDanger
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-amber-600 hover:bg-amber-700 text-slate-950"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Send className="w-4 h-4" /> {confirmButtonText}
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
