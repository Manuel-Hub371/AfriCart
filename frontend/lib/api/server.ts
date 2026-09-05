// Server-only API client.
//
// Used by Server Components (SSR/ISR) to read data over HTTP from the backend API
// instead of importing backend modules directly.
//
// Base URL resolution (server side):
//   - API_INTERNAL_URL set        -> preferred (e.g. internal backend URL in a split deploy)
//   - NEXT_PUBLIC_API_URL set     -> fallback (external backend origin)
//   - neither set                 -> monolith mode; isApiSplit() returns false and pages
//                                    use the in-process data adapters in lib/data/* instead.
//
// When the frontend/API are split (Phase 7), configure API_INTERNAL_URL or
// NEXT_PUBLIC_API_URL and the in-process fallback branches are removed.

// Only an absolute http(s) URL indicates a separate backend origin (split).
// A relative value (e.g. "/api") or empty means same-origin monolith -> run in-process.
function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

const API_BASE = isAbsoluteUrl(
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || ""
)
  ? (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "")
  : "";

/** True when the frontend should reach the backend over HTTP (split/separate origin). */
export function isApiSplit(): boolean {
  return Boolean(API_BASE);
}

export interface ServerFetchOptions extends Omit<RequestInit, "cache"> {
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
}

/**
 * Fetch from the backend API on the server.
 * Supports Next.js fetch caching/revalidation for ISR pages.
 * Bounded by a default timeout (API_FETCH_TIMEOUT_MS, default 15s) so a
 * slow/unreachable backend can never hang a `next build` prerender — callers
 * catch the abort and degrade gracefully (e.g. empty homepage sections).
 */
export async function serverApiFetch(
  path: string,
  options: ServerFetchOptions = {},
): Promise<Response> {
  const { cache, revalidate, tags, signal: callerSignal, ...init } = options;
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  // Abort long-pending requests. Respect the caller's signal if provided.
  const timeoutMs = Number(process.env.API_FETCH_TIMEOUT_MS) || 15000;
  const controller = callerSignal ? null : new AbortController();
  const timer = controller
    ? setTimeout(() => controller.abort(), timeoutMs)
    : undefined;

  try {
    return await fetch(url, {
      ...init,
      ...(controller ? { signal: controller.signal } : {}),
      ...(cache ? { cache } : revalidate !== undefined
        ? { next: { revalidate: revalidate === false ? 0 : revalidate, tags } }
        : {}),
    });
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** Throwing variant that parses JSON and throws on non-2xx. */
export async function serverApiFetchJson<T = any>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const res = await serverApiFetch(path, options);
  if (!res.ok) {
    throw new Error(`API request failed (${res.status}) for ${path}`);
  }
  return (await res.json()) as T;
}
