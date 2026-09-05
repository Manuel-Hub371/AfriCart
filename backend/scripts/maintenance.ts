// Scheduled maintenance job for the AfriCart API.
//
// Safe to run on any schedule (Render Cron Job, manual, CI): every operation is
// idempotent, bounded, observable and non-destructive beyond deleting records
// that are (a) explicitly consumed (usedAt set) or (b) expired past their TTL.
//
// Current jobs:
//   1. Prune expired/used email verification tokens.
//   2. Prune expired/used password reset tokens.
//
// Usage:
//   npm run job:maintenance            (requires DATABASE_URL in the environment)
//   --env <file> can load a KEY=VALUE env file (e.g. --env ../.env)

import { readFileSync, existsSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

function setFromEnvFile(filePath: string): void {
  if (!existsSync(filePath)) return;
  for (const rawLine of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

async function main() {
  const envArg = process.argv.find((a) => a.startsWith("--env="));
  const candidates = [
    envArg && envArg.slice("--env=".length),
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), ".env"),
    path.resolve(process.cwd(), "..", ".env"),
  ].filter((f): f is string => Boolean(f));
  for (const file of candidates) setFromEnvFile(file);

  if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL is required (use --env=<file> or the environment).");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const now = new Date();
  const started = Date.now();

  const [expiredEmailTokens, expiredResetTokens] = await Promise.all([
    prisma.emailVerificationToken.deleteMany({ where: { OR: [{ usedAt: { not: null } }, { expiresAt: { lt: now } }] } }),
    prisma.passwordResetToken.deleteMany({ where: { OR: [{ usedAt: { not: null } }, { expiresAt: { lt: now } }] } }),
  ]);

  console.log(
    JSON.stringify({
      level: "info",
      msg: "maintenance job completed",
      ts: new Date().toISOString(),
      durationMs: Date.now() - started,
      deleted: {
        emailVerificationTokens: expiredEmailTokens.count,
        passwordResetTokens: expiredResetTokens.count,
      },
    }),
  );

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Maintenance job aborted:", err);
  process.exit(1);
});