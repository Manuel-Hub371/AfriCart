# AfriCart Architecture

AfriCart is a multi-vendor marketplace split into **two independently deployable Next.js 15 applications** plus a managed PostgreSQL database and Cloudinary for media. Each workspace is a self-contained npm project with its own `package.json`, lockfile, and deployment target.

## Topology

```
frontend/                   Next.js UI (port 3000)
  app/                      App-Router pages only (no API routes)
  lib/api/client.ts         central fetch client -> backend origin
  -> deploys to Vercel / Netlify (static SSG/ISR + edge)

backend/                    Next.js API (port 3001)
  app/api/**                Route handlers only (no pages) -> REST API
  lib/                      auth, security, cloudinary, logger, email
  modules/                  feature services + repositories (Prisma)
  prisma/                   schema + migrations
  scripts/                  maintenance & migration tooling
  -> deploys to Render (long-running Node web service)

PostgreSQL                  Render managed DB (africart-db)
Cloudinary                  media storage (origin for user-uploaded files)
```

The frontend never imports from `backend/`, never reads `DATABASE_URL`/`JWT_SECRET`/Cloudinary keys, and never calls `/api` on its own origin. All data access goes through `backend/` over the network.

## Environments

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | frontend | Backend origin (dev `http://localhost:3001`) |
| `ALLOWED_ORIGINS` | backend | Comma-separated allowlist for credentialed CORS |
| `COOKIE_SAME_SITE` | backend | `lax` (same-site dev) or `none` (cross-origin prod) |
| `JWT_SECRET` | backend | Signs access/refresh JWTs; server fails fast if missing |
| `DATABASE_URL` | backend | Prisma connection string; never exposed to frontend |
| `CLOUDINARY_*`, email keys | backend | Media upload + transactional email (`sync: false` in render.yaml) |

Copy `.env.example` to `.env.local` in each workspace. All `.env*` files are gitignored except `.env.example`.

## Development

```bash
npm run dev:api    # backend on http://localhost:3001
npm run dev        # frontend on http://localhost:3000 (delegates to frontend/)
```

Validate split boundaries before merging in this mode:

- `npm --prefix backend run lint` and `npm --prefix frontend run lint` (no errors; frontend has pre-existing `<img>` warnings)
- `npx --prefix backend tsc --noEmit` and `npx --prefix frontend tsc --noEmit`
- Full prod builds: `npm run build` (backend first, then frontend)

## Database

- One-time baseline migration `0_init` reconciles the legacy `prisma db push` state. On a db-push-era database, resolve the baseline once: `npx prisma migrate resolve --applied 0_init`, then keep using `prisma migrate deploy` thereafter.
- `npm run db:migrate` (root/backend) = `prisma migrate deploy`. Never use `prisma db push` in production.
- `npm run db:seed` seeds development data.
- `npm run db:migrate:media` migrates legacy base64 image columns to Cloudinary (dry-run by default; pass `--apply` plus `--env=<file>` to persist; writes a backup JSON before any change and is resumable).

## Background Jobs

In-process timers exist only in rate limiting and best-seller caching; there is no durable job broker. A nightly maintenance job (`job:maintenance`) prunes expired/used auth tokens (email verification, password reset). Render runs it as a cron service (`africart-maintenance`, `0 3 * * *`).

## Health & Observability

- `GET /api/health` — liveness (`{status:"ok", service:"africart-api", timestamp}`), no DB dependency; used by the Render health check.
- `GET /api/health/ready` — readiness: pings the database (`SELECT 1`) and reports Cloudinary configuration status.
- Every request is logged (method, path, request id, outcome) and returns an `x-request-id` header.
- On SIGTERM/SIGINT the server disconnects Prisma cleanly.

## Security Baseline

- Credentialed CORS locked to `ALLOWED_ORIGINS`; no wildcard.
- Auth cookies: `HttpOnly`, `Secure` in production and any `SameSite=None` set, access token 15 min / refresh 7 days, logout clears both.
- Fixed-window rate limits on login (5/min), forgot-password (3/min), reset-password (5/min), verify-email (10/min) and vendor product writes (20/min).
- Audit log records registration, login, logout, email verification, role upgrades, password resets, and all admin/vendor moderation actions.
- Media upload: mime allowlist + 50 MB cap; production never falls back to base64 storage.
- Secrets are never committed; only `.env.example` files are tracked.

## Payments — Simulation Only

Checkout writes `paymentStatus: "PAID"` immediately. **No payment gateway is wired.** Mobile Money / card capture is a documented Phase 11 blocker; the simulated `PAID` flag exists for development flows only and must not be treated as a real money flow. See the warning marker in `backend/modules/orders/repository.ts`.

## Deploy

- `render.yaml` defines the backend (web `africart-api`, health `/api/health`), the maintenance cron, and the Postgres database. Frontend deploys on Vercel/Netlify with the env values documented in the render.yaml file comments.
- Both apps set `outputFileTracingRoot` so self-hosted builds trace their own workspace only.
- Live cross-origin auth and media-migration runs happen against deployed/branch environments (needs reachable DB + Cloudinary/email credentials).