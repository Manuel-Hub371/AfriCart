"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { UserRole } from "@/lib/auth/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles,
  redirectTo = "/auth/login" 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
      // Store intended destination
      sessionStorage.setItem("redirectAfterLogin", pathname);
      router.push(redirectTo);
      return;
    }

    // Authenticated but wrong role - redirect to unauthorized or their dashboard
    if (!allowedRoles.includes(user.role)) {
      const userDashboard = getUserDashboard(user.role);
      router.push(userDashboard);
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, router, redirectTo, pathname]);

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

  // Not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Wrong role
  if (!allowedRoles.includes(user.role)) {
    return null;
  }

  // Authorized
  return <>{children}</>;
}

function getUserDashboard(role: UserRole): string {
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
