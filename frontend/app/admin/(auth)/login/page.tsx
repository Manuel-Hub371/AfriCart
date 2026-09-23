"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/context";
import { adminAuthService } from "@/lib/auth/admin-service";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2, AlertTriangle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { refreshUser, isAuthenticated, user, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If a session already exists (and it is an admin), go straight to the dashboard.
  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated && user) {
      const isAdmin =
        String(user.role || "").toLowerCase() === "admin" ||
        (Array.isArray(user.roles) && user.roles.some((r) => String(r).toUpperCase() === "ADMIN"));
      if (isAdmin) {
        router.replace("/admin/dashboard");
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await adminAuthService.login({ email: email.trim(), password });
      // Re-sync the platform-wide auth context with the freshly issued session
      // so the admin shell (which reads useAuth()) shows the right user.
      await refreshUser();
      router.push("/admin/dashboard");
    } catch (err: any) {
      const msg = err?.message || "Invalid administrator credentials.";
      // Surface actionable errors (rate limiting / service issues) verbatim;
      // fold everything else back into the generic non-enumerating message.
      if (/too many|429|rate limit/i.test(msg) || /connection|database|internal error/i.test(msg)) {
        setError(msg);
      } else {
        setError("Invalid administrator credentials.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-emerald-950/40 overflow-hidden">
        {/* Card header */}
        <div className="px-8 pt-8 pb-6 text-center border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-2xl mx-auto shadow-lg shadow-emerald-500/25 mb-3">
            A
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Administrator Sign In
          </h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Restricted entry — an account with the <span className="text-emerald-400 font-bold">ADMIN</span> role is required.
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

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  required
                  disabled={submitting}
                  autoComplete="current-password"
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

            <div className="flex items-center justify-between pt-0.5">
              <Link href="/admin/forgot-password" className="text-xs font-bold text-emerald-400 hover:text-emerald-300">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 rounded-xl font-black text-sm shadow-lg shadow-emerald-600/25 transition-all"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                </span>
              ) : (
                "Sign In to Dashboard"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-center text-xs text-slate-400">
              Need administrator access?{" "}
              <Link href="/admin/register" className="font-bold text-emerald-400 hover:text-emerald-300">
                Request access
              </Link>
            </p>
            <p className="text-center text-[10px] text-slate-600 mt-2">
              Requests are reviewed and approved by an existing administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}