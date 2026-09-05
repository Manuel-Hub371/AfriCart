import crypto from "crypto";
import { hashToken } from "@/lib/auth/session";
import type { Prisma } from "@prisma/client";

/**
 * Create a one-time email verification token for a user inside an existing
 * transaction. Only the SHA-256 hash of the raw token is persisted; the raw
 * token is returned once (it is emailed to the user and never stored).
 * Expires in 24 hours.
 */
export async function createEmailVerificationToken(
  tx: Prisma.TransactionClient,
  userId: string,
): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await tx.emailVerificationToken.create({
    data: { userId, tokenHash, expiresAt },
  });

  return rawToken;
}