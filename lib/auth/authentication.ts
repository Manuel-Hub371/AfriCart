import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { 
  generateAccessToken as jwtGenerateAccessToken, 
  generateRefreshToken as jwtGenerateRefreshToken, 
  verifyToken as jwtVerifyToken, 
  JWTPayload 
} from "./jwt";

export type { JWTPayload };

/**
 * Hash a plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 * Compare plain text password with hashed password
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate access token
 */
export async function generateAccessToken(payload: JWTPayload): Promise<string> {
  return jwtGenerateAccessToken(payload);
}

/**
 * Generate refresh token
 */
export async function generateRefreshToken(payload: Partial<JWTPayload> & { userId: string }): Promise<string> {
  return jwtGenerateRefreshToken(payload);
}

/**
 * Verify token
 */
export async function verifyToken(token: string): Promise<any> {
  return jwtVerifyToken(token);
}

/**
 * Helper to set cookies in API route handler responses
 */
export async function setAuthCookies(payload: JWTPayload) {
  const cookieStore = await cookies();
  
  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set("afriCart_accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  cookieStore.set("afriCart_refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Helper to clear auth cookies on logout
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  
  cookieStore.set("afriCart_accessToken", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  cookieStore.set("afriCart_refreshToken", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
}

/**
 * Helper to set cookies on a NextResponse (e.g. inside middleware)
 */
export function setResponseCookies(response: NextResponse, accessToken: string, refreshToken: string) {
  const isProd = process.env.NODE_ENV === "production";

  response.cookies.set("afriCart_accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });

  response.cookies.set("afriCart_refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

/**
 * Format user database record to API response structure (includes legacy role compatibility)
 */
export function formatUserResponse(user: any, rawRoles: string[], permissions: string[]) {
  const hasVendorProfile = !!user.vendorProfile;
  const store = user.vendorProfile?.stores?.[0];

  const roles = [...new Set([
    ...rawRoles,
    ...(hasVendorProfile ? ["VENDOR"] : [])
  ])];

  const isAdmin = roles.some((r) => r.toUpperCase() === "ADMIN");
  const isVendor = roles.some((r) => r.toUpperCase() === "VENDOR") || hasVendorProfile;

  const legacyRole = isAdmin 
    ? "admin" 
    : (isVendor ? "vendor" : "customer");

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar || null,
    phone: user.phone || "",
    roles,
    role: legacyRole,
    permissions,
    storeName: store?.name || undefined,
    storeStatus: hasVendorProfile 
      ? (store?.status === "ACTIVE" || user.vendorProfile.identityVerificationStatus === "VERIFIED" ? "approved" : "pending") 
      : undefined,
    createdAt: user.createdAt.toISOString()
  };
}

/**
 * Get authenticated user ID from session cookies in API route handlers
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("afriCart_accessToken")?.value;
    const refreshToken = cookieStore.get("afriCart_refreshToken")?.value;

    if (accessToken) {
      const decodedAccess = await verifyToken(accessToken);
      if (decodedAccess?.userId) return decodedAccess.userId;
    }

    if (refreshToken) {
      const decodedRefresh = await verifyToken(refreshToken);
      if (decodedRefresh?.userId) return decodedRefresh.userId;
    }

    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Require authenticated Admin user in API route handlers
 * Returns admin user object or null if unauthenticated / non-admin
 */
export async function getAuthenticatedAdminUser(): Promise<{ id: string; email: string; firstName: string; lastName: string } | null> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return null;

  try {
    const { db } = await import("@/lib/db");
    const user = await db.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: {
        userRoles: {
          include: { role: true }
        }
      }
    });

    if (!user) return null;

    const roles = user.userRoles.map((ur) => ur.role.name.toUpperCase());
    const isAdmin = roles.includes("ADMIN");

    if (!isAdmin) return null;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  } catch (err) {
    console.error("Failed to verify admin user:", err);
    return null;
  }
}
