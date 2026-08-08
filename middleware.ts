import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth/jwt";

function getSafeRedirectUrl(redirectParam: string | null): string {
  if (!redirectParam) return "/profile";
  // Only permit valid relative paths starting with "/" and not containing "//" or protocol schemes
  if (redirectParam.startsWith("/") && !redirectParam.startsWith("//") && !redirectParam.includes("://")) {
    return redirectParam;
  }
  return "/profile";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("afriCart_accessToken")?.value;
  const refreshToken = request.cookies.get("afriCart_refreshToken")?.value;

  let session: any = null;

  if (accessToken) {
    session = await verifyToken(accessToken);
  }

  // If access token is expired or missing, check if the refresh token is still valid
  if (!session && refreshToken) {
    session = await verifyToken(refreshToken);
  }

  const isAuthRoute = 
    pathname.startsWith("/auth/login") || 
    pathname.startsWith("/auth/register") || 
    pathname.startsWith("/auth/welcome") || 
    pathname.startsWith("/auth/vendor-registration");

  const isCustomerRoute = 
    pathname.startsWith("/profile") || 
    pathname.startsWith("/cart") || 
    pathname.startsWith("/checkout");

  const isVendorRoute = 
    pathname.startsWith("/vendor");

  const isAdminRoute = 
    pathname.startsWith("/admin");

  // 1. Guard customer, vendor, and admin routes
  if (isCustomerRoute || isVendorRoute || isAdminRoute) {
    if (!session || !session.userId) {
      const loginUrl = new URL("/auth/login", request.url);
      const safeRedirect = getSafeRedirectUrl(pathname);
      loginUrl.searchParams.set("redirect", safeRedirect);
      return NextResponse.redirect(loginUrl);
    }

    const roles = Array.isArray(session.roles)
      ? session.roles.map((r: string) => String(r).toUpperCase())
      : [];
    const singleRole = String(session.role || "").toUpperCase();

    // 2. Guard Admin routes specifically (Requires ADMIN role)
    if (isAdminRoute) {
      const isAdmin = roles.includes("ADMIN") || singleRole === "ADMIN";
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/profile", request.url));
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
        return NextResponse.redirect(new URL("/profile", request.url));
      }
    }
  }

  // 4. Redirect authenticated users away from authentication pages
  if (isAuthRoute && session && session.userId) {
    const roles = Array.isArray(session.roles)
      ? session.roles.map((r: string) => String(r).toUpperCase())
      : [];
    const singleRole = String(session.role || "").toUpperCase();

    if (roles.includes("ADMIN") || singleRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else if (roles.includes("VENDOR") || singleRole === "VENDOR") {
      return NextResponse.redirect(new URL("/vendor", request.url));
    } else {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
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
    "/auth/vendor-registration"
  ]
};
