"use client";

import { usePathname } from "next/navigation";
import { AdminLayout } from "./admin-layout";

// Public administrator gateway pages. These sit physically under /admin/* so the
// URLs are /admin/login, /admin/register, /admin/forgot-password and
// /admin/reset-password, but they must NEVER be wrapped by the protected admin
// shell (which requires an existing ADMIN session and bounces guests to the
// customer login). They render inside the dedicated public gateway layout at
// app/admin/(auth)/layout.tsx instead.
const PUBLIC_GATEWAY_ROUTES = [
  "/admin/login",
  "/admin/register",
  "/admin/forgot-password",
  "/admin/reset-password",
];

/**
 * Decides which admin shell a route renders under:
 *   - public gateway routes  -> plain children (public (auth) layout applies)
 *   - everything else        -> <AdminLayout> (protected ADMIN-only shell)
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  const isPublicGateway = PUBLIC_GATEWAY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPublicGateway) {
    return <>{children}</>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}