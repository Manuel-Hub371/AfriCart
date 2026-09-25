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

    // Marketplace self-heal: if the database has no publicly visible store yet
    // (e.g. a fresh or legacy-empty production DB), seed the demo vendor + store
    // + products so the live discovery pages never render an empty catalog. This
    // is additive/idempotent and never touches existing records. Runs on EVERY
    // server start, so an empty marketplace repairs itself after any redeploy or
    // restart — independent of the build-time db:seed step.
    try {
      const { ensureDemoMarketplaceIfEmpty } = await import("@/lib/db/marketplace-bootstrap");
      const result = await ensureDemoMarketplaceIfEmpty(db);
      if (result.seeded) {
        logger.info("Marketplace bootstrap: seeded demo marketplace (database had no public stores).");
      }
    } catch (bootstrapErr) {
      logger.warn("Marketplace bootstrap skipped (non-fatal)", {
        error: bootstrapErr instanceof Error ? bootstrapErr.message : String(bootstrapErr),
      });
    }
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