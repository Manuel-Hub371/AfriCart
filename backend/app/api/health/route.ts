import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Liveness probe for load balancers / Render health checks.
 * Lightweight by design: it must NOT depend on the database or external
 * services. Deep dependency health is reported by /api/health/ready.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "africart-api",
    timestamp: new Date().toISOString(),
  });
}