import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, setAuthCookies, formatUserResponse } from "@/lib/auth/authentication";
import { db } from "@/lib/db";
import { getPermissionsForRoles } from "@/lib/auth/authorization/permissions";

/**
 * Generate an SEO-friendly unique slug for a store
 */
async function generateUniqueStoreSlug(name: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  
  let slug = baseSlug || "store";
  let counter = 1;
  
  while (true) {
    const existing = await db.store.findUnique({
      where: { slug }
    });
    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("afriCart_accessToken")?.value;
    const refreshToken = cookieStore.get("afriCart_refreshToken")?.value;

    let userId: string | null = null;
    if (accessToken) {
      const decodedAccess = await verifyToken(accessToken);
      if (decodedAccess) userId = decodedAccess.userId;
    }
    if (!userId && refreshToken) {
      const decodedRefresh = await verifyToken(refreshToken);
      if (decodedRefresh) userId = decodedRefresh.userId;
    }

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      storeName, storeDescription, storeCategory,
      businessType, businessName, registrationNumber, taxId,
      country, region, city, streetAddress, postalCode
    } = body;

    if (!storeName || !businessName || !streetAddress || !city || !region || !country) {
      return NextResponse.json({ message: "Required business fields are missing" }, { status: 400 });
    }

    // Check duplicate store name
    const existingStore = await db.store.findFirst({
      where: { name: storeName, deletedAt: null }
    });
    if (existingStore) {
      return NextResponse.json({ message: "Store name is already taken" }, { status: 400 });
    }

    // Check if vendor profile already exists
    const existingVendorProfile = await db.vendorProfile.findUnique({
      where: { userId }
    });
    if (existingVendorProfile) {
      return NextResponse.json({ message: "You already have a vendor profile" }, { status: 400 });
    }

    // Upgrade customer to vendor in transaction
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: {
          userRoles: {
            include: { role: true }
          }
        }
      });
      if (!user) throw new Error("User account not found");

      // Find VENDOR role
      const vendorRole = await tx.role.findUnique({
        where: { name: "VENDOR" }
      });
      if (!vendorRole) {
        throw new Error("System is not initialized. VENDOR role missing.");
      }

      // 1. Add VENDOR role to User (keep existing customer role)
      const userHasVendorRole = user.userRoles.some(ur => ur.role.name === "VENDOR");
      if (!userHasVendorRole) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: vendorRole.id
          }
        });
      }

      // 2. Create VendorProfile
      const vendorProfile = await tx.vendorProfile.create({
        data: {
          userId: user.id,
          businessName,
          businessCategory: storeCategory,
          country,
          region,
          city,
          businessAddress: streetAddress,
          identityVerificationStatus: "PENDING",
          businessVerificationStatus: "PENDING"
        }
      });

      // 3. Generate store slug
      const slug = await generateUniqueStoreSlug(storeName);

      // 4. Create Store
      const store = await tx.store.create({
        data: {
          vendorProfileId: vendorProfile.id,
          name: storeName,
          slug,
          description: storeDescription || null,
          category: storeCategory
        }
      });

      // 5. Write Audit Log
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "ROLE_UPGRADE",
          targetResource: `Store:${store.id}`,
          metadata: {
            previousRoles: user.userRoles.map(ur => ur.role.name),
            newRoles: [...user.userRoles.map(ur => ur.role.name), "VENDOR"],
            storeName,
            businessName
          }
        }
      });

      return { user, store };
    });

    // Re-read roles and permissions
    const updatedUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: { role: true }
        }
      }
    });

    const roles = updatedUser?.userRoles.map(ur => ur.role.name) || ["CUSTOMER", "VENDOR"];
    const permissions = getPermissionsForRoles(roles);

    // Re-issue auth cookies
    await setAuthCookies({
      userId: result.user.id,
      email: result.user.email,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      roles,
      permissions
    });

    const fullUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        vendorProfile: {
          include: { stores: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      user: formatUserResponse(fullUser, roles, permissions)
    });

  } catch (error: any) {
    console.error("Upgrade API error:", error);
    return NextResponse.json({ message: error.message || "Failed to upgrade profile" }, { status: 500 });
  }
}
