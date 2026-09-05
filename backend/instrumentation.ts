// Server lifecycle hooks (Next.js App Router).
// - register(): runs once when the server starts. Installs graceful shutdown
//   so SIGTERM/SIGINT disconnect Prisma cleanly before exit.
// - onRequestError(): production-safe error logging (no sensitive fields).

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { logger } = await import("@/lib/logger");
    const { db } = await import("@/lib/db");

    const shutdown = (signal: string) => {
      logger.info(`Received ${signal}, disconnecting database and shutting down`);
      db.$disconnect()
        .catch((err: unknown) =>
          logger.warn("Failed to disconnect database during shutdown", {
            error: err instanceof Error ? err.message : String(err),
          }),
        )
        .finally(() => process.exit(0));
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  }
}

export async function onRequestError(error: unknown, request: Request, context?: any) {
  const { logger } = await import("@/lib/logger");
  const method = request?.method || context?.request?.method || "unknown";
  const path = context?.request?.path || request?.url || "unknown";
  logger.error("request error", {
    method,
    path,
    message: error instanceof Error ? error.message : String(error),
  });
}