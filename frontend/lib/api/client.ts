// Centralized API client.
//
// Resolves the backend base URL at runtime:
//   - NEXT_PUBLIC_API_URL set (absolute) -> cross-origin (frontend/API split). Sends
//     credentials (HttpOnly cookies) with each request so auth works across origins.
//   - NEXT_PUBLIC_API_URL empty/relative -> same-origin. The frontend proxies /api/*
//     to the backend via next.config rewrites, so requests still reach the API.
//
// All API calls from the browser/SSR should go through this client so that the
// frontend never hardcodes deployment URLs and CORS/credentials stay consistent.

const RAW_API_URL = (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL)
  ? process.env.NEXT_PUBLIC_API_URL.trim()
  : "";

// Only an absolute http(s) URL indicates a separate backend origin (split).
// A relative value (e.g. "/api") or empty means same-origin monolith -> use
// relative /api paths and rely on same-origin cookies.
function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

const API_BASE = isAbsoluteUrl(RAW_API_URL) ? RAW_API_URL.replace(/\/+$/, "") : "";

function resolveUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}

export interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: unknown | BodyInit;
}

/**
 * Perform a request against the backend API.
 * - Automatically prefixes the base URL (NEXT_PUBLIC_API_URL when set).
 * - Sends credentials (cookies) when the API is cross-origin.
 * - JSON-encodes object bodies and sets the Content-Type header.
 * - Does NOT throw on HTTP error by default; callers inspect res.ok / res.status.
 */
export async function apiFetch(path: string, options: ApiOptions = {}): Promise<Response> {
  const { body, headers, ...rest } = options;

  const init: RequestInit = { ...rest };

  if (API_BASE) {
    init.credentials = "include";
  }

  if (body !== undefined) {
    const isJsonBody = typeof body !== "string" && !(body instanceof FormData)
      && !(body instanceof Blob) && !(body instanceof ArrayBuffer);
    if (isJsonBody) {
      init.method = init.method || "POST";
      init.headers = {
        "Content-Type": "application/json",
        ...(headers as Record<string, string> | undefined),
      };
      init.body = JSON.stringify(body);
    } else {
      init.body = body as BodyInit;
      if (headers) init.headers = headers as HeadersInit;
    }
  }

  return fetch(resolveUrl(path), init);
}

/**
 * Parse a Response body as JSON without throwing the cryptic
 * "Unexpected token '<', ... is not valid JSON" error when the API returns an
 * HTML error/404 page instead of JSON. Returns null when the body is empty or
 * not valid JSON.
 */
export async function parseApiResponse<T = any>(res: Response): Promise<T | null> {
  const text = await res.text().catch(() => "");
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/**
 * Reason a non-JSON (usually HTML) API response was received so the UI can
 * surface an actionable message instead of a JSON parse error.
 */
export function describeBadApiResponse(path: string, res: Response): string {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/html") || contentType.includes("text/plain")) {
    return `The API endpoint "${path}" returned an HTML page instead of JSON (HTTP ${res.status || "unknown"}). ` +
      `Make sure the backend server is running and that NEXT_PUBLIC_API_URL / API_INTERNAL_URL point to it.`;
  }
  return `The API request to "${path}" failed with an unexpected response (HTTP ${res.status || "unknown"}).`;
}

/** Fetch that throws on non-2xx responses, returning parsed JSON. */
export async function apiFetchOrThrow<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const res = await apiFetch(path, options);
  const data = await parseApiResponse<any>(res);
  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data);
  }
  if (data === null) {
    throw new ApiError(describeBadApiResponse(path, res), res.status, null);
  }
  return data as T;
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const apiClient = {
  get: <T = any>(path: string, options: ApiOptions = {}) =>
    apiFetchOrThrow<T>(path, { ...options, method: "GET" }),
  post: <T = any>(path: string, body?: unknown, options: ApiOptions = {}) =>
    apiFetchOrThrow<T>(path, { ...options, method: "POST", body }),
  put: <T = any>(path: string, body?: unknown, options: ApiOptions = {}) =>
    apiFetchOrThrow<T>(path, { ...options, method: "PUT", body }),
  patch: <T = any>(path: string, body?: unknown, options: ApiOptions = {}) =>
    apiFetchOrThrow<T>(path, { ...options, method: "PATCH", body }),
  del: <T = any>(path: string, options: ApiOptions = {}) =>
    apiFetchOrThrow<T>(path, { ...options, method: "DELETE" }),
};
