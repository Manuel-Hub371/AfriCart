"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/auth/auth-layout";
import { GuestOnlyRoute } from "@/components/auth/guest-only-route";
import { useAuth } from "@/lib/auth/context";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
      // Redirect handled by login function
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GuestOnlyRoute>
      <AuthLayout>
        <div className="max-w-md w-full mx-auto">
          {/* Back Button */}
          <Link 
            href="/auth/welcome"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 mb-4 transition-colors bg-white/80 border border-gray-200 px-3 py-1 rounded-full backdrop-blur-xs shadow-2xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </Link>

          {/* Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 md:p-10 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-primary rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-black text-lg sm:text-xl">A</span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-gradient">AfriCart</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-gray-900 mb-1 tracking-tight">Welcome Back</h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Sign in to continue to your account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold">
                {error}
              </div>
            )}

            {/* Social Login */}
            <div className="space-y-3 mb-5">
              <Button
                type="button"
                variant="outline"
                className="w-full h-10 sm:h-12 border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50 rounded-xl text-xs sm:text-sm font-bold transition-all text-gray-700"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </div>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400 font-medium">or sign in with email</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1">
                  Email Address or Phone
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter email or phone"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-10 sm:h-12 rounded-xl text-xs sm:text-sm border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 h-10 sm:h-12 rounded-xl text-xs sm:text-sm border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={formData.rememberMe}
                    onChange={(e) => 
                      setFormData({ ...formData, rememberMe: e.target.checked })
                    }
                    className="w-3.5 h-3.5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label 
                    htmlFor="remember"
                    className="text-xs text-gray-600 cursor-pointer font-medium"
                  >
                    Remember me
                  </label>
                </div>
                <Link 
                  href="/auth/forgot-password"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-primary text-white h-10 sm:h-12 rounded-xl font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Register Link */}
            <p className="text-center text-xs text-gray-600 mt-5">
              Don&apos;t have an account?{" "}
              <Link 
                href="/auth/register"
                className="font-bold text-emerald-600 hover:text-emerald-700"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Footer Note */}
          <p className="text-[10px] text-center text-gray-400 mt-4">
            Protected by reCAPTCHA. Google{" "}
            <Link href="/privacy" className="text-emerald-600 hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="text-emerald-600 hover:underline">
              Terms of Service
            </Link>{" "}
            apply.
          </p>
        </div>
      </AuthLayout>
    </GuestOnlyRoute>
  );
}
