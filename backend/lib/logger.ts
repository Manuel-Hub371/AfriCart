// Lightweight structured logger for server-side code (API routes, services, jobs).
// Avoids pulling a heavy dependency. In production, logs are JSON lines which are
// easy to parse by log aggregators.

type LogLevel = "debug" | "info" | "warn" | "error";

const LEVELS: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function configuredLevel(): LogLevel {
  const value = (process.env.LOG_LEVEL || "info").toLowerCase() as LogLevel;
  return LEVELS[value] !== undefined ? value : "info";
}

function shouldLog(level: LogLevel): boolean {
  return LEVELS[level] >= LEVELS[configuredLevel()];
}

function format(level: LogLevel, message: string, meta?: unknown): string {
  const entry: Record<string, unknown> = {
    level,
    ts: new Date().toISOString(),
    msg: message,
  };
  if (meta !== undefined) {
    entry.meta = meta;
  }
  return JSON.stringify(entry);
}

export const logger = {
  debug(message: string, meta?: unknown) {
    if (!shouldLog("debug")) return;
    // eslint-disable-next-line no-console
    console.log(format("debug", message, meta));
  },
  info(message: string, meta?: unknown) {
    if (!shouldLog("info")) return;
    // eslint-disable-next-line no-console
    console.log(format("info", message, meta));
  },
  warn(message: string, meta?: unknown) {
    if (!shouldLog("warn")) return;
    // eslint-disable-next-line no-console
    console.warn(format("warn", message, meta));
  },
  error(message: string, meta?: unknown) {
    if (!shouldLog("error")) return;
    // eslint-disable-next-line no-console
    console.error(format("error", message, meta));
  },
};

export const isProd = process.env.NODE_ENV === "production";
