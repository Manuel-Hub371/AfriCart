"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminAuthService } from "@/lib/auth/admin-service";
import { Mail, Lock, Eye, EyeOff, User, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";

export default function AdminRegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await adminAuthService.register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      setDone(res.message || "Your administrator access request was submitted.");
    } catch (err: any) {
      setError(err?.message || "Your request could not be submitted. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl shadow-emerald-950/40">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-xl font-extrabold text-white mb-2">Request Submitted</h1>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">{done}</p>
          <p className="text-xs text-slate-500 mb-6">
            Once approved, you will be able to sign in from the administrator gateway. You can check
            with an existing administrator about the status of your request.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link href="/admin/login">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs">
                Back to Sign In
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full text-slate-400 hover:text-slate-200 rounded-xl font-bold text-xs">
                Return to Storefront
              </Button>
            </Link>
          </div>
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
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Request Admin Access
          </h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Submitting a request does <span className="text-amber-400 font-bold">not</span> grant access.
            An existing administrator must approve it.
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-300 font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  First Name
                </label>
                <Input
                  type="text"
                  placeholder="Jane"
                  value={form.firstName}
                  onChange={update("firstName")}
                  className="h-11 rounded-xl bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Last Name
                </label>
                <Input
                  type="text"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={update("lastName")}
                  className="h-11 rounded-xl bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={update("email")}
                  className="pl-10 h-11 rounded-xl bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={update("password")}
                  className="pl-10 pr-10 h-11 rounded-xl bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  required
                  minLength={8}
                  disabled={submitting}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={update("confirmPassword")}
                  className="pl-10 pr-10 h-11 rounded-xl bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  required
                  minLength={8}
                  disabled={submitting}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 rounded-xl font-black text-sm shadow-lg shadow-emerald-600/25 transition-all"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...
                </span>
              ) : (
                <>
                  <User className="w-4 h-4" /> Submit Access Request
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-5">
            Already an administrator?{" "}
            <Link href="/admin/login" className="font-bold text-emerald-400 hover:text-emerald-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}