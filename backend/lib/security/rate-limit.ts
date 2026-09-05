/**
 * Production Rate Limiter Utility for Authentication & API Throttling
 * Implements sliding-window token bucket algorithm per IP / identifier.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

// Cleanup stale memory records every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of memoryStore.entries()) {
    if (now > record.resetAt) {
      memoryStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  limit?: number;       // Maximum requests allowed within the window (default: 5)
  windowMs?: number;    // Window duration in milliseconds (default: 60,000ms / 1 min)
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { success: boolean; remaining: number; resetAt: number } {
  const limit = options.limit ?? 5;
  const windowMs = options.windowMs ?? 60 * 1000;

  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  const record = memoryStore.get(key);

  if (!record || now > record.resetAt) {
    // Initialize new window
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    memoryStore.set(key, newRecord);
    return { success: true, remaining: limit - 1, resetAt: newRecord.resetAt };
  }

  if (record.count >= limit) {
    // Rate limit exceeded
    return { success: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  memoryStore.set(key, record);
  return { success: true, remaining: limit - record.count, resetAt: record.resetAt };
}
