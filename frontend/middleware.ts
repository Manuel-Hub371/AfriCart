import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Session verification is delegated to the backend API (GET /api/auth/me).
// This keeps JWT_SECRET out of the frontend build: the middleware never
// verifies tokens itself. The user's cookies are forwarded to the backend,
// which resolves the session and applies cookie rotation. The backend base URL
// is resolved from API_INTERNAL_URL (server-side) or NEXT_PUBLIC_API_URL.

interface SessionUser {
  id?: string;
  userId?: string;
  role?: string | null;
  roles?: string[] | null;
}

function getApiBase(): string {
  const url =
    process.env.API_INTERNAL_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "";
  if (/^https?:\/\//i.test(url)) return url.replace(/\/+$/, "");
  // Local dev fallback: the backend runs on port 3001 by default. This keeps
  // route guards working even if the two env vars above are left unset.
  return process.env.NODE_ENV === "production" ? "" : "http://localhost:3001";
}

async function getSessionUser(request: NextRequest): Promise<SessionUser | null> {
  const base = getApiBase();
  const cookie = request.headers.get("cookie");
  if (!base || !cookie) return null;

  try {
    const res = await fetch(`${base}/api/auth/me`, {
      headers: { cookie },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const user = data?.user;
    return user ? { ...user } : null;
  } catch {
    return null;
  }
}

function getSafeRedirectUrl(redirectParam: string | null): string {
  if (!redirectParam) return "/profile";
  // Only permit valid relative paths starting with "/" and not containing "//" or protocol schemes
  if (redirectParam.startsWith("/") && !redirectParam.startsWith("//") && !redirectParam.includes("://")) {
    return redirectParam;
  }
  return "/profile";
}

/**
 * Redirect response that can never be cached by a browser OR a shared cache/CDN.
 *
 * The previous middleware build served plain 307 responses that intermediaries
 * could hold onto (some browsers/proxies cache 307s heuristically). Once cached,
 * a stale redirect keeps sending users to /auth/login even after the code is
 * fixed. Every middleware redirect now carries explicit no-store headers so a
 * stale redirect can never be stored again.
 */
function redirectNoStore(url: URL | string, request: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL(url, request.url));
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await getSessionUser(request);

  const isAuthRoute =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    pathname.startsWith("/auth/welcome") ||
    pathname.startsWith("/auth/vendor-registration");

  // Public administrator gateway pages. These must never require a session —
  // an existing admin logs in here and a prospective admin registers here.
  const isAdminAuthRoute =
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/register") ||
    pathname.startsWith("/admin/forgot-password") ||
    pathname.startsWith("/admin/reset-password");

  const isCustomerRoute =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout");

  const isVendorRoute =
    pathname.startsWith("/vendor");

  const isAdminRoute =
    pathname.startsWith("/admin");

  const userId = session?.userId || session?.id;
  const roles = Array.isArray(session?.roles)
    ? session!.roles!.map((r: string) => String(r).toUpperCase())
    : [];
  const singleRole = String(session?.role || "").toUpperCase();
  const isAdminUser = roles.includes("ADMIN") || singleRole === "ADMIN";

  // 1. Guard customer, vendor, and admin routes
  if (isCustomerRoute || isVendorRoute || (isAdminRoute && !isAdminAuthRoute)) {
    if (!session || !userId) {
      // Administrators are redirected to the dedicated admin gateway; everyone
      // else goes to the customer login with the original destination preserved.
      const loginUrl =
        isAdminRoute && !isAdminAuthRoute
          ? new URL("/admin/login", request.url)
          : new URL("/auth/login", request.url);
      const safeRedirect = getSafeRedirectUrl(pathname);
      loginUrl.searchParams.set("redirect", safeRedirect);
      return redirectNoStore(loginUrl, request);
    }

    // 2. Guard Admin routes specifically (Requires ADMIN role)
    if (isAdminRoute && !isAdminAuthRoute) {
      if (!isAdminUser) {
        return redirectNoStore("/profile", request);
      }
    }

    // 3. Guard Vendor routes specifically
    if (isVendorRoute) {
      const isVendorOrAdmin =
        roles.includes("VENDOR") ||
        roles.includes("ADMIN") ||
        singleRole === "VENDOR" ||
        singleRole === "ADMIN";

      if (roles.length > 0 && !isVendorOrAdmin && singleRole === "CUSTOMER") {
        return redirectNoStore("/profile", request);
      }
    }
  }

  // 4. Redirect authenticated users away from authentication pages
  if (isAuthRoute && session && userId) {
    if (isAdminUser) {
      return redirectNoStore("/admin/dashboard", request);
    } else if (roles.includes("VENDOR") || singleRole === "VENDOR") {
      return redirectNoStore("/vendor", request);
    } else {
      return redirectNoStore("/profile", request);
    }
  }

  // 5. Signed-in administrators are sent straight to the dashboard if they
  //    reopen an admin gateway page (login / register / forgot / reset).
  if (isAdminAuthRoute && session && userId && isAdminUser) {
    return redirectNoStore("/admin/dashboard", request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/vendor/:path*",
    "/admin/:path*",
    "/cart",
    "/checkout",
    "/auth/login",
    "/auth/register",
    "/auth/welcome",
    "/auth/vendor-registration",
  ],
};