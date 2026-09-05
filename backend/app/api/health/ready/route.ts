import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { isCloudinaryConfigured } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

/**
 * Readiness probe. Verifies dependencies the backend needs to serve traffic:
 *   - PostgreSQL reachable (SELECT 1)
 *   - Cloudinary configured (informational; media uploads require it)
 * Response is 200 only when the database is reachable, 503 otherwise.
 */
export async function GET() {
  const started = Date.now();
  let dbOk = false;
  let dbError: string | null = null;

  try {
    await db.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (err: any) {
    dbError = err?.message || "Unknown DB error";
  }

  const durationMs = Date.now() - started;
  const cloudinaryConfigured = isCloudinaryConfigured();
  const ready = dbOk;

  if (!ready) {
    logger.error("Readyness check failed: database unreachable", { error: dbError, durationMs });
  }

  return NextResponse.json(
    {
      status: ready ? "ok" : "degraded",
      service: "africart-api",
      checks: {
        database: dbOk ? "ok" : "error",
        cloudinary: cloudinaryConfigured ? "configured" : "not_configured",
      },
      timestamp: new Date().toISOString(),
      durationMs,
    },
    { status: ready ? 200 : 503 },
  );
}