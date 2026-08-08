import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comparePassword, setAuthCookies, formatUserResponse } from "@/lib/auth/authentication";
import { getPermissionsForRoles } from "@/lib/auth/authorization/permissions";
import { createServerSession } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";

function parseUserAgent(uaString: string | null) {
  if (!uaString) return { browser: "Unknown", os: "Unknown", deviceType: "Unknown" };
  
  let browser = "Unknown";
  let os = "Unknown";
  let deviceType = "Desktop";

  const ua = uaString.toLowerCase();

  // Browser
  if (ua.includes("edg/")) browser = "Edge";
  else if (ua.includes("chrome/")) browser = "Chrome";
  else if (ua.includes("firefox/")) browser = "Firefox";
  else if (ua.includes("safari/")) browser = "Safari";
  else if (ua.includes("opera/") || ua.includes("opr/")) browser = "Opera";

  // OS
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac os") || ua.includes("macintosh")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS";

  // Device type
  if (ua.includes("mobile") || ua.includes("iphone") || (ua.includes("android") && ua.includes("mobile"))) {
    deviceType = "Mobile";
  } else if (ua.includes("ipad") || ua.includes("tablet") || (ua.includes("android") && !ua.includes("mobile"))) {
    deviceType = "Tablet";
  }

  return { browser, os, deviceType };
}

export async function POST(req: Request) {
  let userIdForLog: string | null = null;
  const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
  const userAgent = req.headers.get("user-agent") || null;
  const { browser, os, deviceType } = parseUserAgent(userAgent);
  // IP country can be resolved from custom CDN headers if available (e.g. Cloudflare CF-IPCountry)
  const country = req.headers.get("cf-ipcountry") || req.headers.get("x-vercel-ip-country") || null;

  // Rate Limiting (5 attempts per minute per IP)
  const rateLimit = checkRateLimit(`login:${ipAddress}`, { limit: 5, windowMs: 60 * 1000 });
  if (!rateLimit.success) {
    return NextResponse.json(
      { message: "Too many login attempts. Please try again in 1 minute." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user (support both email and phone lookup)
    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { phone: email.trim() }
        ],
        deletedAt: null
      },
      include: {
        userRoles: {
          include: {
            role: true
          }
        },
        vendorProfile: {
          include: {
            stores: {
              where: { deletedAt: null },
              take: 1
            }
          }
        }
      }
    });

    if (!user) {
      // Record failed login
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    userIdForLog = user.id;

    // Verify Password
    const passwordMatch = await comparePassword(password, user.passwordHash);
    
    // Log in LoginHistory
    await db.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent,
        browser,
        os,
        deviceType,
        country,
        success: passwordMatch
      }
    });

    if (!passwordMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Verify user account status
    if (user.status === "BANNED" || user.status === "SUSPENDED") {
      return NextResponse.json({ 
        message: `Your account has been ${user.status.toLowerCase()}. Please contact customer support.` 
      }, { status: 403 });
    }

    // Extract user roles and permissions
    const roles = user.userRoles.map(ur => ur.role.name);
    const permissions = getPermissionsForRoles(roles);

    // Write Audit Log
    await db.auditLog.create({
      data: {
        actorId: user.id,
        action: "USER_LOGIN",
        targetResource: `User:${user.id}`,
        metadata: {
          browser,
          os,
          deviceType,
          ipAddress
        }
      }
    });

    // Create Server-Side Session in Database
    const session = await createServerSession(user.id, userAgent, ipAddress);

    const formattedUser = formatUserResponse(user, roles, permissions);

    // Generate cookies with embedded sessionId
    await setAuthCookies({
      userId: user.id,
      sessionId: session.id,
      email: user.email,
      firstName: user.firstName || user.email.split("@")[0],
      lastName: user.lastName || "",
      roles,
      role: formattedUser.role,
      permissions
    });

    return NextResponse.json({
      success: true,
      user: formattedUser
    });

  } catch (error: any) {
    console.error("Login API error:", error);
    
    if (userIdForLog) {
      await db.loginHistory.create({
        data: {
          userId: userIdForLog,
          ipAddress,
          userAgent,
          browser,
          os,
          deviceType,
          country,
          success: false
        }
      });
    }

    if (error?.code === "P1001" || error?.message?.includes("Can't reach database server")) {
      return NextResponse.json(
        { message: "Cannot connect to database. Please ensure DATABASE_URL environment setting is set correctly on Render." },
        { status: 503 }
      );
    }

    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
  }
}
