import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth/jwt";

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

  // 1. Guard customer and vendor routes
  if (isCustomerRoute || isVendorRoute) {
    if (!session) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Guard Vendor routes specifically (requires VENDOR role)
    if (isVendorRoute) {
      const roles = session.roles || [];
      const hasVendorRole = roles.includes("VENDOR") || roles.includes("ADMIN");
      
      if (!hasVendorRole) {
        // User is customer but not vendor, redirect to customer dashboard
        return NextResponse.redirect(new URL("/profile", request.url));
      }
    }
  }

  // 3. Redirect authenticated users away from authentication pages
  if (isAuthRoute && session) {
    const roles = session.roles || [];
    if (roles.includes("VENDOR") || roles.includes("ADMIN")) {
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
    "/cart",
    "/checkout",
    "/auth/login",
    "/auth/register",
    "/auth/welcome",
    "/auth/vendor-registration"
  ]
};
