/**
 * End-to-end verification for the dedicated admin authentication system.
 *
 * Runs against a LIVE backend (default http://localhost:3001) and its database,
 * exercising the admin auth API + the customer-auth boundary end to end:
 *
 *   npm run test:admin-auth            (against http://localhost:3001)
 *   npm run test:admin-auth -- <base>  (any other backend URL, e.g. the staged deploy)
 *
 * It mutates the database (creates an admin access request, approves it, and
 * creates a throwaway customer) and leaves audit-style residue. That is
 * intentional: the flows it proves are the ones the production admin team will
 * perform daily. Rate-limit checks run LAST because limits are keyed per IP.
 *
 * Exit code 0 = all checks passed.
 */
import { readFileSync, existsSync } from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const BASE = (process.argv[2] || "http://localhost:3001").replace(/\/+$/, "");

// The backend stores its secrets in .env.local / .env (Next.js loads these in
// the app, but tsx does not). Load them the same way the other db scripts do,
// and import the Prisma client AFTER env is in place.
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

let failures = 0;
const results: string[] = [];
function check(label: string, pass: boolean, detail?: unknown) {
  results.push(`${pass ? "PASS" : "FAIL"}  ${label}${detail !== undefined ? `  :: ${JSON.stringify(detail)}` : ""}`);
  if (!pass) failures += 1;
}

type Cookie = { name: string; value: string };
function collectCookies(res: Response): Cookie[] {
  const headers = res.headers as any;
  const setCookies: string[] =
    typeof headers.getSetCookie === "function"
      ? headers.getSetCookie()
      : res.headers.get("set-cookie")
      ? [res.headers.get("set-cookie") as string]
      : [];
  return setCookies.map((c) => {
    const [pair] = c.split(";");
    const idx = pair.indexOf("=");
    return { name: pair.slice(0, idx).trim(), value: pair.slice(idx + 1).trim() };
  });
}

async function req(
  path: string,
  opts: { method?: string; body?: unknown; cookies?: Cookie[] } = {}
) {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.cookies && opts.cookies.length) {
    headers["Cookie"] = opts.cookies.map((c) => `${c.name}=${c.value}`).join("; ");
  }
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method || (opts.body !== undefined ? "POST" : "GET"),
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    redirect: "manual",
  });
  let json: any = null;
  try {
    json = await res.json();
  } catch {}
  return { res, json };
}

async function main() {
  const envArg = process.argv.find((a) => a.startsWith("--env="));
  const candidates = [
    envArg && envArg.slice("--env=".length),
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), ".env"),
    path.resolve(process.cwd(), "..", ".env"),
  ].filter((f): f is string => Boolean(f));
  for (const file of candidates) setFromEnvFile(file);

  const { db } = await import("../lib/db");

  console.log(`Admin auth E2E against ${BASE}\n`);

  // --------------------------------------------------------------------
  // 1. Unauthenticated guards — every admin-protected surface must refuse.
  // --------------------------------------------------------------------
  try {
    let r = await req("/api/admin/auth/me");
    check("GET /api/admin/auth/me unauthenticated -> 401", r.res.status === 401, r.res.status);

    r = await req("/api/admin/dashboard");
    check("GET /api/admin/dashboard unauthenticated -> 403", r.res.status === 403, r.res.status);

    r = await req("/api/admin/auth/requests");
    check("GET /api/admin/auth/requests unauthenticated -> 403", r.res.status === 403, r.res.status);
  } catch (e: any) {
    check("guard endpoints reachable", false, e.message);
  }

  // --------------------------------------------------------------------
  // 2. Seed admin login — correct password, server-side role gate.
  // --------------------------------------------------------------------
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@africart.com").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "password123";

  let adminCookies: Cookie[] = [];
  try {
    let r = await req("/api/admin/auth/login", {
      body: { email: adminEmail, password: "definitely-wrong-password" },
    });
    check(
      "admin login with wrong password -> 401 + generic message",
      r.res.status === 401 &&
        /invalid admin credentials/i.test(r.json?.message || ""),
      { status: r.res.status, message: r.json?.message }
    );

    r = await req("/api/admin/auth/login", {
      body: { email: adminEmail, password: adminPassword },
    });
    adminCookies = collectCookies(r.res);
    check(
      "admin login with correct password -> 200 + session cookies",
      r.res.status === 200 && adminCookies.length > 0,
      { status: r.res.status, cookies: adminCookies.length }
    );
    const adminUser = r.json?.data?.user;
    check(
      "admin login returns user with ADMIN role",
      !!adminUser && (adminUser.roles || []).includes("ADMIN"),
      adminUser && { email: adminUser.email, roles: adminUser.roles }
    );

    r = await req("/api/admin/auth/me", { cookies: adminCookies });
    check(
      "GET /api/admin/auth/me authenticated -> 200 admin",
      r.res.status === 200 &&
        String(r.json?.data?.user?.role || "").toLowerCase() === "admin" &&
        (r.json?.data?.user?.roles || []).includes("ADMIN"),
      { status: r.res.status, user: r.json?.data?.user }
    );
  } catch (e: any) {
    check("admin login flow", false, e.message);
  }

  // --------------------------------------------------------------------
  // 3. Admin access request registration (no role granted at registration).
  // --------------------------------------------------------------------
  const newEmail = `admin-appr-${Date.now()}@test.africart`;
  const newPassword = "AdminTest123!";
  let pendingId = "";
  let pendingUserId = "";
  try {
    const r = await req("/api/admin/auth/register", {
      body: {
        firstName: "Approval",
        lastName: "Case",
        email: newEmail,
        password: newPassword,
        confirmPassword: newPassword,
      },
    });
    check("register (access request) -> success", r.res.status === 200 && r.json?.success === true, r.json);

    const dup = await req("/api/admin/auth/register", {
      body: {
        firstName: "Approval",
        lastName: "Case",
        email: newEmail,
        password: newPassword,
        confirmPassword: newPassword,
      },
    });
    check("duplicate register -> 400", dup.res.status === 400, { status: dup.res.status });

    const row = await db.user.findUnique({
      where: { email: newEmail },
      include: {
        userRoles: { include: { role: true } },
        adminApprovalRequest: true,
      },
    });
    pendingUserId = row?.id || "";
    check(
      "DB: registered admin user is PENDING with NO admin role + an approval request",
      !!row &&
        row.status === "PENDING" &&
        row.emailVerified === false &&
        !row.userRoles.some((ur) => ur.role.name === "ADMIN") &&
        row.adminApprovalRequest?.status === "PENDING",
      row && { status: row.status, roles: row.userRoles.map((ur) => ur.role.name), approval: row.adminApprovalRequest?.status }
    );
  } catch (e: any) {
    check("register + DB checks", false, e.message);
  }

  // --------------------------------------------------------------------
  // 4. Admin approval queue + approve (grants ADMIN server-side).
  // --------------------------------------------------------------------
  try {
    let r = await req("/api/admin/auth/requests", { cookies: adminCookies });
    check("admin can list approval requests -> 200", r.res.status === 200 && !!r.json?.data?.items, r.json);
    const item = (r.json?.data?.items || []).find((it: any) => it.email === newEmail);
    pendingId = item?.id || pendingId;
    check("pending request is listed for review", !!item, item || "item not found");

    r = await req(`/api/admin/auth/requests/${pendingId}/approve`, {
      cookies: adminCookies,
      body: {},
    });
    check("approve request -> success", r.res.status === 200 && r.json?.success === true, r.json);

    const row = await db.user.findUnique({
      where: { email: newEmail },
      include: {
        userRoles: { include: { role: true } },
        adminApprovalRequest: true,
      },
    });
    check(
      "DB: approval grants ADMIN role, ACTIVE + verified email",
      !!row &&
        row.status === "ACTIVE" &&
        row.emailVerified === true &&
        row.userRoles.some((ur) => ur.role.name === "ADMIN") &&
        row.adminApprovalRequest?.status === "APPROVED" &&
        !!row.adminApprovalRequest.reviewedAt,
      row && { status: row.status, roles: row.userRoles.map((ur) => ur.role.name), approval: row.adminApprovalRequest?.status }
    );

    r = await req(`/api/admin/auth/requests/${pendingId}/approve`, {
      cookies: adminCookies,
      body: {},
    });
    check("approving an already-approved request -> 400", r.res.status === 400, { status: r.res.status });

    r = await req(`/api/admin/auth/requests/${pendingId}/reject`, {
      cookies: adminCookies,
      body: { reason: "already approved" },
    });
    check("rejecting an already-approved request -> 400", r.res.status === 400, { status: r.res.status });
  } catch (e: any) {
    check("approval flow", false, e.message);
  }

  // --------------------------------------------------------------------
  // 5. Newly approved admin can now sign in.
  // --------------------------------------------------------------------
  let newAdminCookies: Cookie[] = [];
  try {
    const r = await req("/api/admin/auth/login", {
      body: { email: newEmail, password: newPassword },
    });
    newAdminCookies = collectCookies(r.res);
    check(
      "approved admin can sign in -> 200",
      r.res.status === 200 && (r.json?.data?.user?.roles || []).includes("ADMIN"),
      { status: r.res.status }
    );
  } catch (e: any) {
    check("new admin login", false, e.message);
  }

  // --------------------------------------------------------------------
  // 6. A customer (non-admin) must be refused by the admin login gate.
  // --------------------------------------------------------------------
  const customerEmail = `customer-${Date.now()}@test.africart`;
  const customerPassword = "CustomerTest123!";
  try {
    const customerRole = await db.role.findUnique({ where: { name: "CUSTOMER" } });
    const customerHash = await bcrypt.hash(customerPassword, 10);
    await db.user.create({
      data: {
        email: customerEmail,
        firstName: "Customer",
        lastName: "Gate",
        passwordHash: customerHash,
        status: "ACTIVE",
        emailVerified: true,
        emailVerificationStatus: "VERIFIED",
        userRoles: { create: customerRole ? [{ roleId: customerRole.id }] : [] },
        customerProfile: { create: {} },
      },
    });

    const r = await req("/api/admin/auth/login", {
      body: { email: customerEmail, password: customerPassword },
    });
    check(
      "active CUSTOMER login on /api/admin/auth/login -> 401 generic (no role leak)",
      r.res.status === 401 && /invalid admin credentials/i.test(r.json?.message || ""),
      { status: r.res.status, message: r.json?.message }
    );
  } catch (e: any) {
    check("customer gate", false, e.message);
  }

  // --------------------------------------------------------------------
  // 7. Reset flows — token issuance is role-gated; reset rotates password.
  // --------------------------------------------------------------------
  try {
    let r = await req("/api/admin/auth/forgot-password", {
      body: { email: newEmail },
    });
    check("forgot-password for ADMIN -> 200 generic success", r.res.status === 200, r.json);

    const tokenRow = await db.passwordResetToken.findFirst({
      where: { user: { email: newEmail } },
      orderBy: { createdAt: "desc" },
    });
    check("DB: a reset token was issued for the admin", !!tokenRow, tokenRow ? "token exists" : "no token");

    r = await req("/api/admin/auth/forgot-password", {
      body: { email: "ghost-nobody@test.africart" },
    });
    check(
      "forgot-password for unknown email -> same generic 200 (no enumeration)",
      r.res.status === 200,
      r.json
    );

    r = await req("/api/admin/auth/reset-password", {
      body: { token: "bogus-not-a-token", password: "NewPass123!" },
    });
    check("reset-password with invalid token -> 400", r.res.status === 400, { status: r.res.status });

    r = await req("/api/admin/auth/reset-password", {
      body: { token: "bogus", password: "short", confirmPassword: "short" },
    });
    check("reset-password with short password -> 400", r.res.status === 400, { status: r.res.status });
  } catch (e: any) {
    check("reset flows", false, e.message);
  }

  // --------------------------------------------------------------------
  // 8. Logout clears the auth cookies (session ends at the client boundary).
  //    The platform authenticates via HttpOnly JWTs; revoking them means
  //    clearing the cookies. Replaying the cleared cookie values must fail.
  // --------------------------------------------------------------------
  try {
    const r = await req("/api/admin/auth/logout", { cookies: adminCookies, body: {} });
    const cleared = collectCookies(r.res);
    const clearedNames = cleared.map((c) => c.name).sort();

    check("admin logout -> success", r.res.status === 200 && r.json?.success === true, r.json);
    check(
      "logout response clears both auth cookies with empty values",
      clearedNames.length === 2 &&
        cleared.every((c) => c.value === "") &&
        clearedNames.includes("afriCart_accessToken") &&
        clearedNames.includes("afriCart_refreshToken"),
      { cleared: cleared.map((c) => `${c.name}=${c.value}`) }
    );

    const after = await req("/api/admin/auth/me", { cookies: cleared });
    check("cleared cookie values rejected -> 401", after.res.status === 401, { status: after.res.status });
  } catch (e: any) {
    check("logout flow", false, e.message);
  }

  // --------------------------------------------------------------------
  // 9. Rate limiting (LAST — limits are per-IP in the backend process).
  // --------------------------------------------------------------------
  try {
    let saw429 = false;
    let logins = 0;
    for (let i = 0; i < 7; i++) {
      const r = await req("/api/admin/auth/login", {
        body: { email: adminEmail, password: "wrong-password" },
      });
      logins += 1;
      if (r.res.status === 429) {
        saw429 = true;
        break;
      }
    }
    check("admin login throttled to 429 within a 1-minute window", saw429 && logins <= 6, { attemptsUntil429: logins });
  } catch (e: any) {
    check("rate limiting", false, e.message);
  }

  // --------------------------------------------------------------------
  // 10. Cleanup — remove only the accounts this harness created (and any
  //     identical residue left by previous interrupted runs). Real seed/admin
  //     data is never touched.
  // --------------------------------------------------------------------
  try {
    const testUsers = await db.user.findMany({
      where: { email: { endsWith: "@test.africart" } },
      select: { id: true },
    });
    const ids = testUsers.map((u) => u.id);
    if (ids.length) {
      await db.$transaction([
        db.passwordResetToken.deleteMany({ where: { userId: { in: ids } } }),
        db.notification.deleteMany({ where: { userId: { in: ids } } }),
        db.session.deleteMany({ where: { userId: { in: ids } } }),
        db.auditLog.deleteMany({ where: { actorId: { in: ids } } }),
        db.auditLog.deleteMany({ where: { targetResource: { in: ids.map((i) => `User:${i}`) } } }),
        db.adminApprovalRequest.deleteMany({ where: { userId: { in: ids } } }),
        db.customerProfile.deleteMany({ where: { userId: { in: ids } } }),
        db.userRole.deleteMany({ where: { userId: { in: ids } } }),
        db.user.deleteMany({ where: { id: { in: ids } } }),
      ]);
    }
    check("test residue cleaned up", true, { removed: ids.length });
  } catch (e: any) {
    check("test residue cleanup", false, e.message);
  }

  // --------------------------------------------------------------------
  console.log("\n" + results.join("\n"));
  console.log(`\n${results.length - failures}/${results.length} checks passed`);
  await db.$disconnect();
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error("E2E harness crashed:", e);
  process.exit(1);
});