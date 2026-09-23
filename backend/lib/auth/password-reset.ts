import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/authentication";
import { hashToken, revokeAllUserSessions } from "@/lib/auth/session";

export type ConsumePasswordResetResult =
  | { ok: true }
  | { ok: false; reason: "INVALID" | "ERROR"; message: string };

/**
 * Validate a password-reset token and atomically apply the new password.
 *
 * Shared by the customer (`/api/auth/reset-password`) and admin
 * (`/api/admin/auth/reset-password`) flows so both surfaces behave identically:
 *  - Only the SHA-256 hash of the raw token is ever looked up (raw token is never stored).
 *  - The password change, token consumption and audit write happen in one transaction.
 *  - All active server sessions for the user are revoked afterwards (logout everywhere).
 *
 * Returns `{ ok: true }` on success or a discriminated union describing the failure.
 */
export async function consumePasswordResetToken(args: {
  token: string;
  newPassword: string;
  ipAddress?: string | null;
}): Promise<ConsumePasswordResetResult> {
  const tokenHash = hashToken(args.token);

  let resetRecord;
  try {
    resetRecord = await db.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
  } catch (err) {
    console.error("Password reset — could not look up reset token:", err);
    return {
      ok: false,
      reason: "ERROR",
      message: "An error occurred resetting your password.",
    };
  }

  if (
    !resetRecord ||
    resetRecord.usedAt ||
    new Date() > resetRecord.expiresAt ||
    resetRecord.user.deletedAt
  ) {
    return { ok: false, reason: "INVALID", message: "Invalid or expired password reset token" };
  }

  let newPasswordHash: string;
  try {
    newPasswordHash = await hashPassword(args.newPassword);
  } catch (err) {
    console.error("Password reset — could not hash new password:", err);
    return {
      ok: false,
      reason: "ERROR",
      message: "An error occurred resetting your password.",
    };
  }

  try {
    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: resetRecord!.userId },
        data: { passwordHash: newPasswordHash },
      });

      await tx.passwordResetToken.update({
        where: { id: resetRecord!.id },
        data: { usedAt: new Date() },
      });

      await tx.auditLog.create({
        data: {
          actorId: resetRecord!.userId,
          action: "PASSWORD_RESET_COMPLETED",
          targetResource: `User:${resetRecord!.userId}`,
          metadata: { ipAddress: args.ipAddress || null },
        },
      });
    });
  } catch (err) {
    console.error("Password reset — transaction failed:", err);
    return {
      ok: false,
      reason: "ERROR",
      message: "An error occurred resetting your password.",
    };
  }

  await revokeAllUserSessions(resetRecord.userId);
  return { ok: true };
}