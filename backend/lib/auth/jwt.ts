import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length >= 32) {
    return new TextEncoder().encode(secret);
  }
  throw new Error(
    "JWT_SECRET is required. Set a strong JWT_SECRET (>= 32 chars) via environment variables."
  );
}

// Resolved lazily on first use (not at module load) so importing this module
// during a build/prerender without JWT_SECRET set never crashes the process.
let cachedSecretKey: Uint8Array | null = null;
function secretKey(): Uint8Array {
  if (!cachedSecretKey) {
    cachedSecretKey = getSecretKey();
  }
  return cachedSecretKey;
}

export interface JWTPayload {
  userId: string;
  sessionId?: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  role?: string;
  permissions: string[];
}

/**
 * Generate a short-lived access token (15 minutes)
 */
export async function generateAccessToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secretKey());
}

/**
 * Generate a long-lived refresh token (7 days)
 */
export async function generateRefreshToken(payload: Partial<JWTPayload> & { userId: string }): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

/**
 * Verify a JWT token (works in Edge Runtime)
 */
export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload;
  } catch (error) {
    return null;
  }
}
