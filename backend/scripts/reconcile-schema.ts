// Reconcile a database to match the Prisma schema WITHOUT destructive changes.
//
// Why this exists:
//   The production database was created with `prisma db push` before migrations
//   existed. `0_init` was later recorded as applied via `migrate resolve`, so
//   `prisma migrate deploy` NEVER creates schema objects from that baseline.
//   Any table/column/enum in 0_init that is missing from such a database stays
//   missing forever — which is why login 500s (LoginHistory/Session/
//   PasswordResetToken writes) and other failures happen in production while
//   working against a fresh database locally.
//
// What it does:
//   Replays the baseline migration (prisma/migrations/0_init/migration.sql)
//   with idempotent, non-destructive semantics:
//     - CREATE TYPE        -> wrapped in DO $$ ... EXCEPTION duplicate_object
//     - CREATE TABLE       -> CREATE TABLE IF NOT EXISTS (full original DDL)
//     - missing COLUMNS    -> ALTER TABLE ... ADD COLUMN IF NOT EXISTS
//     - CREATE INDEX       -> CREATE [UNIQUE] INDEX IF NOT EXISTS
//   Foreign-key constraints are intentionally skipped: a freshly created table
//   already carries them, and an existing table already has them. Existing data
//   is never dropped or altered.
//
// Usage:
//   npm run db:reconcile             -> runs against DATABASE_URL
//   npm run db:reconcile -- --env=../.env
//   --print-only                     -> prints the statements without executing
//
// Safe to run on every deploy. No-op against a schema-complete database.

import { readFileSync, existsSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const log = (level: string, msg: string, extra?: Record<string, unknown>) =>
  console.log(
    JSON.stringify({
      level,
      msg,
      ts: new Date().toISOString(),
      ...extra,
    })
  );

function setFromEnvFile(filePath: string): void {
  if (!existsSync(filePath)) return;
  for (const rawLine of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

interface ParsedMigrate {
  enums: string[];
  tables: { name: string; ddl: string; columns: string[] }[];
  indexes: string[];
}

function parseMigration(sqlPath: string): ParsedMigrate {
  const sql = readFileSync(sqlPath, "utf8").replace(/\r\n/g, "\n");

  const enums: string[] = [];
  for (const m of sql.matchAll(/CREATE TYPE "([^"]+)" AS ENUM \(([\s\S]*?)\);/g)) {
    const name = m[1];
    const values = m[2];
    enums.push(`DO $$ BEGIN CREATE TYPE "${name}" AS ENUM (${values}); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
  }

  const tables: ParsedMigrate["tables"] = [];
  const tableRe = /CREATE TABLE "([^"]+)" \((\n[\s\S]*?\n)\);/g;
  for (const m of sql.matchAll(tableRe)) {
    const name = m[1];
    const body = m[2];
    const columns: string[] = [];
    for (const line of body.split(/\r?\n/)) {
      const cm = line.match(/^\s*"([^"]+)"\s+([^,]+),?$/);
      if (cm) columns.push(`"${cm[1]}" ${cm[2].replace(/,+$/, "").trim()}`);
    }
    tables.push({
      name,
      ddl: `CREATE TABLE IF NOT EXISTS "${name}" (\n${body}\n);`,
      columns,
    });
  }

  const indexes: string[] = [];
  for (const m of sql.matchAll(/CREATE (UNIQUE )?INDEX "([^"]+)" ON ([^;]+);/g)) {
    indexes.push(`CREATE ${m[1] ?? ""}INDEX IF NOT EXISTS "${m[2]}" ON ${m[3]};`);
  }

  return { enums, tables, indexes };
}

async function execute(prisma: PrismaClient, statements: string[]): Promise<{ ok: number; failed: string[] }> {
  let ok = 0;
  const failed: string[] = [];
  for (const stmt of statements) {
    try {
      await prisma.$executeRawUnsafe(stmt);
      ok += 1;
    } catch (err) {
      failed.push(stmt);
      log("warn", "statement failed — skipped (non-fatal)", {
        statement: stmt,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  return { ok, failed };
}

async function main() {
  const printOnly = process.argv.includes("--print-only");
  const envArg = process.argv.find((a) => a.startsWith("--env="));
  const candidates = [
    envArg && envArg.slice("--env=".length),
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), ".env"),
    path.resolve(process.cwd(), "..", ".env"),
  ].filter((f): f is string => Boolean(f));
  for (const file of candidates) setFromEnvFile(file);

  if (!process.env.DATABASE_URL && !printOnly) {
    console.error("ERROR: DATABASE_URL is required (use --env=<file> or the environment).");
    process.exit(1);
  }

  const migrationPath = path.join(process.cwd(), "prisma", "migrations", "0_init", "migration.sql");
  if (!existsSync(migrationPath)) {
    console.error("ERROR: migration not found at", migrationPath);
    process.exit(1);
  }

  const { enums, tables, indexes } = parseMigration(migrationPath);

  const statements: string[] = [
    ...enums,
    ...tables.map((t) => t.ddl),
    ...tables.flatMap((t) => t.columns.map((col) => `ALTER TABLE "${t.name}" ADD COLUMN IF NOT EXISTS ${col};`)),
    ...indexes,
  ];

  log("info", "reconciliation plan", {
    enums: enums.length,
    tables: tables.length,
    columns: tables.reduce((sum, t) => sum + t.columns.length, 0),
    indexes: indexes.length,
    totalStatements: statements.length,
    printOnly,
  });

  if (printOnly) {
    for (const stmt of statements) console.log(stmt);
    return;
  }

  const prisma = new PrismaClient();
  const started = Date.now();
  try {
    const { ok, failed } = await execute(prisma, statements);
    await prisma.$disconnect();

    log("info", ok > 0 ? "reconciliation complete" : "database already in sync (no changes needed)", {
      applied: ok,
      skipped: failed.length,
      durationMs: Date.now() - started,
      desiredTables: tables.length,
    });
    if (failed.length > 0) {
      log("warn", "some statements could not be applied — review the warnings above", {
        failedCount: failed.length,
      });
    }
  } catch (err) {
    console.error("reconcile-schema aborted:", err);
    process.exit(1);
  } finally {
    void prisma.$disconnect();
  }
}

void main();