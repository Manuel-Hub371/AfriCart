"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";

interface GuestOnlyRouteProps {
  children: React.ReactNode;
}

/**
 * Wrapper for routes that should only be accessible to guests (non-authenticated users)
 * Example: Login, Register pages
 */
export function GuestOnlyRoute({ children }: GuestOnlyRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // If user is already authenticated, redirect to their dashboard
    if (isAuthenticated && user) {
      const redirectTo = getUserDashboard(user.role);
      
      // Check if there's a stored redirect URL
      const storedRedirect = sessionStorage.getItem("redirectAfterLogin");
      if (storedRedirect) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(storedRedirect);
      } else {
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Already authenticated - will redirect
  if (isAuthenticated && user) {
    return null;
  }

  // Guest user - show content
  return <>{children}</>;
}

function getUserDashboard(role: string): string {
  switch (role) {
    case "customer":
      return "/";
    case "vendor":
      return "/vendor";
    case "admin":
      return "/admin";
    default:
      return "/";
  }
}
