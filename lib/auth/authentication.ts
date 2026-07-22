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
export async function generateRefreshToken(payload: { userId: string }): Promise<string> {
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
  const refreshToken = await generateRefreshToken({ userId: payload.userId });

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
export function formatUserResponse(user: any, roles: string[], permissions: string[]) {
  const legacyRole = roles.includes("ADMIN") 
    ? "admin" 
    : (roles.includes("VENDOR") ? "vendor" : "customer");
  
  const hasVendorProfile = !!user.vendorProfile;
  const store = user.vendorProfile?.stores?.[0];

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone || "",
    roles,
    role: legacyRole,
    permissions,
    storeName: store?.name || undefined,
    storeStatus: hasVendorProfile 
      ? (user.vendorProfile.verificationStatus === "VERIFIED" ? "approved" : "pending") 
      : undefined,
    createdAt: user.createdAt.toISOString()
  };
}
