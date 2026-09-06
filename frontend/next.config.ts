import type { NextConfig } from "next";

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

// Resolve the backend base URL for the same-origin /api proxy. Prefers the
// server-side API_INTERNAL_URL, falls back to an absolute NEXT_PUBLIC_API_URL,
// then to the local dev backend so the frontend NEVER serves its own HTML 404
// for /api/* when the backend base is missing or relative.
function resolveBackendBase(): string {
  const internal = (process.env.API_INTERNAL_URL || "").trim().replace(/\/+$/, "");
  if (internal) return internal;

  const publicUrl = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/+$/, "");
  if (isAbsoluteUrl(publicUrl)) return publicUrl;

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3001";
  }

  return "";
}

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Trace files relative to this app only (avoids the repo-root/multi-lockfile
  // inference warning when the app is built inside the monorepo).
  outputFileTracingRoot: __dirname,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    webpackBuildWorker: false,
    workerThreads: false,
    cpus: 1,
  },
  // Proxy /api/* to the backend origin. This guarantees JSON (never the
  // frontend's HTML 404) even when NEXT_PUBLIC_API_URL is empty, set to a
  // relative value like "/api", or misconfigured — while staying inert when the
  // browser talks to the backend directly (split architecture).
  async rewrites() {
    const backendBase = resolveBackendBase();
    if (!backendBase) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${backendBase}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
