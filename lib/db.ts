import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/**
 * Execute a database query or transaction with automatic retry on connection drop/close
 */
export async function withDbRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 300
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      const isConnectionClosed =
        error?.code === "P1001" ||
        error?.code === "P1017" ||
        error?.code === "P2024" ||
        error?.code === "P2028" ||
        error?.message?.includes("Server has closed the connection") ||
        error?.message?.includes("Can't reach database server") ||
        error?.message?.includes("Connection closed");

      if (isConnectionClosed && attempt < retries) {
        console.warn(`[Prisma Connection Closed] Retrying query attempt ${attempt}/${retries}...`);
        await new Promise((res) => setTimeout(res, delayMs * attempt));
        continue;
      }
      throw error;
    }
  }
}
