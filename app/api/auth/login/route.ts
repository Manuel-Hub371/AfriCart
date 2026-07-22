import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comparePassword, setAuthCookies, formatUserResponse } from "@/lib/auth/authentication";
import { getPermissionsForRoles } from "@/lib/auth/authorization/permissions";

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

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // Find user (support both email and phone lookup)
    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: email }
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

    // Generate cookies
    await setAuthCookies({
      userId: user.id,
      email: user.email,
      firstName: user.email.split("@")[0], // Fallback if no profile is loaded yet
      lastName: "",
      roles,
      permissions
    });

    return NextResponse.json({
      success: true,
      user: formatUserResponse(user, roles, permissions)
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

    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
  }
}
