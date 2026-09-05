// CORS support for cross-origin requests (frontend/API split).
//
// Same-origin monolith requests are unaffected: CORS headers are only applied when
// the request carries an `Origin` header from an explicitly allowed origin.
// Never uses a wildcard `*` with credentials.
//
// Allowed origins (comma-separated) come from the ALLOWED_ORIGINS env var.
// Falls back to NEXT_PUBLIC_APP_URL and localhost for convenience.

function getAllowedOrigins(): string[] {
  const env = process.env.ALLOWED_ORIGINS;
  if (env) {
    const parsed = env.split(",").map((s) => s.trim()).filter(Boolean);
    if (parsed.length > 0) return parsed;
  }
  const defaults = [process.env.NEXT_PUBLIC_APP_URL, "http://localhost:3000"].filter(
    (v): v is string => Boolean(v),
  );
  return defaults;
}

export function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin) return false;
  return getAllowedOrigins().includes(origin);
}

export const CORS_ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
export const CORS_ALLOWED_HEADERS = "Content-Type, Authorization, X-Requested-With";

export function buildCorsHeaders(origin: string | null | undefined, headers = new Headers()): Headers {
  if (!isAllowedOrigin(origin)) return headers;
  headers.set("Access-Control-Allow-Origin", origin as string);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Methods", CORS_ALLOWED_METHODS.join(", "));
  headers.set("Access-Control-Allow-Headers", CORS_ALLOWED_HEADERS);
  headers.set("Vary", "Origin");
  return headers;
}

/**
 * Returns a 204 preflight response if the origin is allowed, otherwise null.
 * Returns a Response even for disallowed origins with a 403 to be explicit.
 */
export function handleCorsPreflight(requestOrigin: string | null | undefined): Response | null {
  if (!isAllowedOrigin(requestOrigin)) {
    return new Response(null, { status: 403 });
  }
  return new Response(null, {
    status: 204,
    headers: buildCorsHeaders(requestOrigin),
  });
}
