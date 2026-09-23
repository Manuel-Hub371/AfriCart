"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminAuthService } from "@/lib/auth/admin-service";
import { Mail, Loader2, MailCheck, ShieldCheck, AlertTriangle } from "lucide-react";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await adminAuthService.requestPasswordReset(email.trim());
      setDone(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl shadow-emerald-950/40">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
            <MailCheck className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-xl font-extrabold text-white mb-2">Reset Link Sent</h1>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            If an administrator account exists for{" "}
            <span className="text-emerald-400 font-semibold">{email}</span>, a password reset link has
            been emailed. The link expires after one hour.
          </p>
          <Link href="/admin/login">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs">
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-emerald-950/40 overflow-hidden">
        <div className="px-8 pt-8 pb-6 text-center border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-2xl mx-auto shadow-lg shadow-emerald-500/25 mb-3">
            A
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Forgot Password
          </h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Reset links are only issued to existing administrator accounts.
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-300 font-semibold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type="email"
                  placeholder="admin@africart.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  required
                  disabled={submitting}
                  autoComplete="username"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 rounded-xl font-black text-sm shadow-lg shadow-emerald-600/25 transition-all"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending Link...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-5">
            Remembered your password?{" "}
            <Link href="/admin/login" className="font-bold text-emerald-400 hover:text-emerald-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}