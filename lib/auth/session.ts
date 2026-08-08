import { db } from "@/lib/db";
import crypto from "crypto";

export interface SessionData {
  id: string;
  userId: string;
  expiresAt: Date;
  revokedAt: Date | null;
  userAgent: string | null;
  ipAddress: string | null;
}

/**
 * Hash refresh token identifier securely
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Create a new server-side session in database
 */
export async function createServerSession(
  userId: string,
  userAgent?: string | null,
  ipAddress?: string | null
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await db.session.create({
    data: {
      userId,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      expiresAt,
    },
  });

  return session;
}

/**
 * Verify an active session against PostgreSQL database
 */
export async function verifyServerSession(sessionId: string) {
  if (!sessionId) return null;

  try {
    const session = await db.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            status: true,
            userRoles: {
              include: { role: true },
            },
          },
        },
      },
    });

    if (!session) return null;

    // Check if session has been revoked or expired
    if (session.revokedAt || new Date() > session.expiresAt) {
      return null;
    }

    // Check if user account has been suspended or banned
    if (session.user.status === "BANNED" || session.user.status === "SUSPENDED") {
      return null;
    }

    // Touch lastUsedAt asynchronously
    db.session.update({
      where: { id: sessionId },
      data: { lastUsedAt: new Date() },
    }).catch(() => {});

    return {
      session,
      user: session.user,
      roles: session.user.userRoles.map((ur) => ur.role.name),
    };
  } catch (error) {
    console.error("Error verifying server session:", error);
    return null;
  }
}

/**
 * Revoke a specific server session (e.g. on user logout)
 */
export async function revokeServerSession(sessionId: string) {
  if (!sessionId) return;
  try {
    await db.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  } catch (err) {
    console.error("Failed to revoke session:", err);
  }
}

/**
 * Revoke all active sessions for a user (e.g. on password change, reset, or admin suspension)
 */
export async function revokeAllUserSessions(userId: string) {
  if (!userId) return;
  try {
    await db.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  } catch (err) {
    console.error("Failed to revoke all user sessions:", err);
  }
}
