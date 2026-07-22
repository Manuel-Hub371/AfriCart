import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "africart_super_secret_jwt_key_at_least_32_characters_long_for_security_12345!";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface JWTPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
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
    .sign(secretKey);
}

/**
 * Generate a long-lived refresh token (7 days)
 */
export async function generateRefreshToken(payload: { userId: string }): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

/**
 * Verify a JWT token (works in Edge Runtime)
 */
export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}
