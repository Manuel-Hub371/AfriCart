"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { authService } from "@/lib/auth/service";

type VerifyState = "verifying" | "success" | "error";

function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") || "your account";
  const [state, setState] = useState<VerifyState>("verifying");
  const [message, setMessage] = useState("Verifying your email address...");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function verify() {
      if (!token || token.length < 20) {
        setMessage("This verification link is invalid. Please use the link from your email.");
        setState("error");
        return;
      }
      try {
        await authService.verifyEmail(token);
        setState("success");
      } catch (err: any) {
        setMessage(err?.message || "We could not verify this email. The link may be invalid or expired.");
        setState("error");
      }
    }

    verify();
  }, [token]);

  return (
    <AuthLayout>
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-8 transition-colors"
        >
          <Mail className="h-4 w-4" />
          Back to login
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {state === "success" ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : state === "error" ? (
                <XCircle className="h-8 w-8 text-red-500" />
              ) : (
                <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {state === "success" ? "Email Verified" : state === "error" ? "Verification Failed" : "Verifying Email"}
            </h1>
            <p className="text-gray-600">
              {state === "success" ? (
                <>
                  Your email <span className="font-semibold text-gray-900">{email}</span> has been verified.
                </>
              ) : (
                message
              )}
            </p>
          </div>

          {state === "success" && (
            <Link href="/profile" className="block">
              <Button className="w-full gradient-primary text-white h-12 rounded-xl shadow-lg">
                Continue to your profile
              </Button>
            </Link>
          )}

          {state === "error" && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-gray-700 text-center">
                If the link expired, contact support or use a new one.{" "}
                <Link href="/auth/login" className="font-semibold text-green-600 hover:underline">
                  Sign in instead
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailPageWrapper() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPage />
    </Suspense>
  );
}