import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAllowedOrigin, buildCorsHeaders, handleCorsPreflight } from "@/lib/cors";
import { logger } from "@/lib/logger";

/**
 * Per-request logging for the API boundary.
 * Logs method, path, a generated/echoed request ID and the outcome.
 * Never logs query strings (they can carry tokens), cookies, headers, or bodies.
 */
function logApiRequest(request: NextRequest, requestId: string, outcome: string) {
  logger.info("api request", {
    requestId,
    method: request.method,
    path: request.nextUrl.pathname,
    outcome,
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
  const requestOrigin = request.headers.get("origin");

  // CORS for the split frontend. Same-origin, no cross-origin Origin, or an
  // allowed origin pass through. Disallowed origins receive no CORS headers,
  // so the browser blocks the response.
  if (request.method === "OPTIONS") {
    const preflight = handleCorsPreflight(requestOrigin);
    if (!preflight) {
      logApiRequest(request, requestId, "preflight_denied");
      return new Response(null, { status: 403 });
    }
    preflight.headers.set("x-request-id", requestId);
    logApiRequest(request, requestId, "preflight_allowed");
    return preflight;
  }

  const response = NextResponse.next();
  response.headers.set("x-request-id", requestId);

  if (requestOrigin && isAllowedOrigin(requestOrigin)) {
    buildCorsHeaders(requestOrigin, response.headers);
  }

  logApiRequest(request, requestId, "forwarding");
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};