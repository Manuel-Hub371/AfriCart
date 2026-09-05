// Migration tool: move legacy Base64 media stored in PostgreSQL to Cloudinary.
//
// Scope: records whose image fields still hold `data:<mime>;base64,<payload>`
// Data-URIs (the previous deprecated storage path). Each such value is uploaded
// to Cloudinary and the stored value is replaced with the secure URL.
//
// Safety:
//   - DRY RUN by default (side-effect free: nothing is uploaded or written).
//     Use `--apply` to upload and persist changes.
//   - Idempotent & resumable: values already migrated (http(s) URLs) are skipped,
//     so interrupted runs can simply be re-run.
//   - Non-destructive: every original value is written to a timestamped backup
//     JSON file before any database updates. No data is ever deleted.
//   - Observable: every action is logged with model, record id, field and
//     (when applied) the new Cloudinary public id; a run summary is printed.
//   - Never wired into build/deploy hooks — it is a manual, explicit operation.
//
// Usage:
//   npx tsx scripts/migrate-media-cloudinary.ts              # dry run
//   npx tsx scripts/migrate-media-cloudinary.ts --apply      # upload + write changes
//
// Env required: DATABASE_URL and CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET.
// A KEY=VALUE env file can be supplied with `--env <path>` (e.g. --env ../.env).

import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { isCloudinaryConfigured, uploadToCloudinary } from "../lib/cloudinary";

// ---------------------------------------------------------------- env loader

function setFromEnvFile(filePath: string): boolean {
  if (!existsSync(filePath)) return false;
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
  return true;
}

// --------------------------------------------------------------- data URIs

function isDataUri(value: unknown): boolean {
  return typeof value === "string" && value.toLowerCase().startsWith("data:");
}

function decodeDataUri(value: string): { mimeType: string; buffer: Buffer } | null {
  try {
    const comma = value.indexOf(",");
    if (comma < 0) return null;
    const header = value.slice(5, comma); // strip leading "data:"
    if (!/;base64$/i.test(header)) return null; // only base64 payloads handled
    const mimeType = header.split(";")[0] || "application/octet-stream";
    const buffer = Buffer.from(value.slice(comma + 1), "base64");
    if (buffer.length === 0) return null;
    return { mimeType, buffer };
  } catch {
    return null;
  }
}

// ------------------------------------------------------------------ config

const SCALAR_FIELDS = [
  { model: "user", field: "avatar" },
  { model: "store", field: "logo" },
  { model: "store", field: "banner" },
  { model: "category", field: "image" },
  { model: "marketingCampaign", field: "banner" },
] as const;

const ARRAY_FIELDS = [
  { model: "product", field: "images" },
  { model: "productVariant", field: "images" },
  { model: "review", field: "images" },
] as const;

interface PendingChange {
  model: string;
  id: string;
  field: string;
  index?: number; // present for array entries
  oldValue: string;
  newValue: string;
}

interface FailedChange {
  model: string;
  id: string;
  field: string;
  index?: number;
  error: string;
}

// -------------------------------------------------------------------- main

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const envArg = args.find((a) => a.startsWith("--env="));

  const candidateEnvFiles = [
    envArg && envArg.slice("--env=".length),
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), ".env"),
    path.resolve(process.cwd(), "..", ".env"),
  ].filter((f): f is string => Boolean(f));
  for (const file of candidateEnvFiles) setFromEnvFile(file);

  if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL is required (use --env=<file> or the environment).");
    process.exit(1);
  }
  if (!isCloudinaryConfigured()) {
    console.error(
      "ERROR: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are all required.",
    );
    process.exit(1);
  }

  console.log(`Media migration to Cloudinary — ${apply ? "APPLY mode" : "DRY RUN (nothing will be written)"}`);
  if (apply) {
    console.log("WARNING: take a database backup before running in apply mode.");
  }

  const prisma = new PrismaClient();
  const changes: PendingChange[] = [];
  const failed: FailedChange[] = [];

  async function handleScalarValue(
    model: string,
    id: string,
    field: string,
    value: string,
  ) {
    const decoded = decodeDataUri(value);
    if (!decoded) {
      failed.push({ model, id, field, error: "unparsable base64 data URI" });
      return;
    }
    if (!apply) {
      console.log(
        `[dry-run] ${model}.${field} ${id} — base64 value found (${decoded.buffer.length} bytes), would upload`,
      );
      changes.push({ model, id, field, oldValue: value, newValue: "(upload on --apply)" });
      return;
    }
    const result = await uploadToCloudinary(decoded.buffer, decoded.mimeType, model);
    console.log(`[upload] ${model}.${field} ${id} -> ${result.publicId} (${decoded.buffer.length} bytes)`);
    changes.push({ model, id, field, oldValue: value, newValue: result.secureUrl });
  }

  async function handleArrayEntry(
    model: string,
    id: string,
    field: string,
    index: number,
    value: string,
  ) {
    const decoded = decodeDataUri(value);
    if (!decoded) {
      failed.push({ model, id, field, index, error: "unparsable base64 data URI" });
      return;
    }
    if (!apply) {
      console.log(
        `[dry-run] ${model}.${field}[${index}] ${id} — base64 value found (${decoded.buffer.length} bytes), would upload`,
      );
      changes.push({ model, id, field, index, oldValue: value, newValue: "(upload on --apply)" });
      return;
    }
    const result = await uploadToCloudinary(decoded.buffer, decoded.mimeType, model);
    console.log(
      `[upload] ${model}.${field}[${index}] ${id} -> ${result.publicId} (${decoded.buffer.length} bytes)`,
    );
    changes.push({ model, id, field, index, oldValue: value, newValue: result.secureUrl });
  }

  // Scalar fields
  for (const spec of SCALAR_FIELDS) {
    const rows = await (prisma as any)[spec.model].findMany({
      select: { id: true, [spec.field]: true },
    });
    for (const row of rows as { id: string; [k: string]: any }[]) {
      const value = row[spec.field];
      if (typeof value === "string" && isDataUri(value)) {
        await handleScalarValue(spec.model, row.id, spec.field, value);
      }
    }
  }

  // Array fields (Json arrays of image URLs)
  for (const spec of ARRAY_FIELDS) {
    const rows = await (prisma as any)[spec.model].findMany({
      select: { id: true, [spec.field]: true },
    });
    for (const row of rows as { id: string; [k: string]: any }[]) {
      const raw = row[spec.field];
      if (raw === null || raw === undefined) continue;
      const values: unknown[] = Array.isArray(raw) ? raw : [raw];
      if (!values.every((v) => typeof v === "string")) continue;

      for (let i = 0; i < values.length; i++) {
        const value = values[i] as string;
        if (isDataUri(value)) {
          await handleArrayEntry(spec.model, row.id, spec.field, i, value);
        }
      }
    }
  }

  // Persist: write backup, then write changes.
  if (apply && changes.length > 0) {
    const backupPath = path.join(
      process.cwd(),
      `.media-migration-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
    );
    writeFileSync(
      backupPath,
      JSON.stringify(
        changes.map((c) => ({ model: c.model, id: c.id, field: c.field, index: c.index, oldValue: c.oldValue })),
        null,
        2,
      ),
      "utf8",
    );
    console.log(`Backup written: ${backupPath}`);

    const scalarChanges = changes.filter((c) => c.index === undefined);
    for (const change of scalarChanges) {
      await (prisma as any)[change.model].update({
        where: { id: change.id },
        data: { [change.field]: change.newValue },
      });
    }

    // Array changes grouped per record, preserving element order.
    const byRecord = new Map<string, PendingChange[]>();
    for (const change of changes.filter((c) => c.index !== undefined)) {
      const key = `${change.model}:${change.id}:${change.field}`;
      if (!byRecord.has(key)) byRecord.set(key, []);
      byRecord.get(key)!.push(change);
    }
    for (const [key, recordChanges] of byRecord) {
      const [model, id, field] = key.split(":");
      const current = ((await (prisma as any)[model].findUnique({
        where: { id },
        select: { [field]: true },
      })) as any)[field] as unknown[];
      const updated = [...current];
      for (const c of recordChanges) {
        updated[c.index!] = c.newValue;
      }
      await (prisma as any)[model].update({ where: { id }, data: { [field]: updated } });
    }
  }

  await prisma.$disconnect();

  console.log("\n--- Summary ---");
  console.log(`Base64 values found: ${changes.length} (${apply ? "applied" : "would be migrated"})`);
  console.log(`Failures: ${failed.length}`);
  for (const f of failed) {
    console.log(`  FAILED ${f.model}.${f.field}${f.index !== undefined ? `[${f.index}]` : ""} ${f.id}: ${f.error}`);
  }
  if (!apply) {
    console.log("DRY RUN only — re-run with --apply to upload and persist changes.");
  }
}

main().catch((err) => {
  console.error("Migration aborted:", err);
  process.exit(1);
});