import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Trace files relative to this app only (avoids the repo-root/multi-lockfile
  // inference warning when the app is built inside the monorepo).
  outputFileTracingRoot: __dirname,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    webpackBuildWorker: false,
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
