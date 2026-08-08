import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, setAuthCookies, formatUserResponse } from "@/lib/auth/authentication";
import { db, withDbRetry } from "@/lib/db";
import { ensureRole, getPermissionsForRoles } from "@/lib/auth/authorization/permissions";
import { isValidStoreCategorySlug, mapLegacyCategoryToOfficialSlug } from "@/lib/constants/store-categories";
import { isValidBusinessType, sanitizeBusinessType } from "@/lib/constants/business-types";

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
      storeName, storeDescription, storeCategory, storeCategories, storeCategorySlugs,
      businessType, businessName, registrationNumber, taxId,
      country, region, city, streetAddress, postalCode,
      idDocumentUrl, businessCertificateUrl,
      payoutMethod, payoutProvider, payoutAccountNumber, payoutAccountName
    } = body;

    if (!storeName || !businessName || !streetAddress || !city || !region || !country) {
      return NextResponse.json({ message: "Required business fields are missing" }, { status: 400 });
    }

    // Category Slugs Validation
    const rawCategories: string[] = Array.isArray(storeCategories) && storeCategories.length > 0
      ? storeCategories
      : Array.isArray(storeCategorySlugs) && storeCategorySlugs.length > 0
      ? storeCategorySlugs
      : (typeof storeCategory === "string" && storeCategory.trim() ? storeCategory.split(",").map((s) => s.trim()) : ["electronics-gadget"]);

    const categorySlugs = Array.from(new Set(rawCategories));
    for (const slug of categorySlugs) {
      if (!isValidStoreCategorySlug(slug)) {
        return NextResponse.json({ message: `Invalid store category slug: ${slug}` }, { status: 400 });
      }
    }

    // Business Type Validation (Strictly Indivual or Paternship)
    const cleanBusinessType = sanitizeBusinessType(businessType);
    if (businessType && !isValidBusinessType(businessType.trim())) {
      return NextResponse.json({ message: "Invalid business type. Must be 'Indivual' or 'Paternship'" }, { status: 400 });
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

    // Upgrade customer to vendor in transaction with retry
    const result = await withDbRetry(() =>
      db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: {
          userRoles: {
            include: { role: true }
          }
        }
      });
      if (!user) throw new Error("User account not found");

      // Self-healing VENDOR role resolution
      const vendorRole = await ensureRole(tx, "VENDOR");

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
          businessCategory: categorySlugs[0] || "electronics-gadget",
          businessType: cleanBusinessType,
          country,
          region,
          city,
          businessAddress: streetAddress,
          identityVerificationStatus: "PENDING",
          businessVerificationStatus: "PENDING"
        }
      });

      // 3. Create Vendor Verification Model
      await tx.vendorVerification.create({
        data: {
          vendorProfileId: vendorProfile.id,
          registrationNumber: registrationNumber || null,
          taxId: taxId || null,
          idDocumentUrl: idDocumentUrl || null,
          businessCertificateUrl: businessCertificateUrl || null,
        }
      });

      // 4. Create Vendor Payout Profile Model
      await tx.vendorPayoutProfile.create({
        data: {
          vendorProfileId: vendorProfile.id,
          payoutMethod: payoutMethod || "MOBILE_MONEY",
          provider: payoutProvider || null,
          accountNumber: payoutAccountNumber || null,
          accountName: payoutAccountName || null,
        }
      });

      // 5. Fetch matching StoreCategory records
      const categoryRecords = await tx.storeCategory.findMany({
        where: { slug: { in: categorySlugs } },
      });

      // 6. Generate store slug
      const slug = await generateUniqueStoreSlug(storeName);

      // 7. Create Store with multi-category assignments (Default PENDING_APPROVAL, isPublic false)
      const store = await tx.store.create({
        data: {
          vendorProfileId: vendorProfile.id,
          name: storeName,
          slug,
          description: storeDescription || null,
          category: categoryRecords[0]?.name || "Electronics & Gadget",
          businessType: cleanBusinessType,
          country,
          region,
          city,
          address: streetAddress,
          postalCode: postalCode || null,
          status: "PENDING_APPROVAL",
          isPublic: false,
          categories: {
            create: categoryRecords.map((c) => ({
              storeCategoryId: c.id,
            })),
          },
        },
      });

      // 8. Write Audit Log
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
    })
    );

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
    console.error("Upgrade vendor error:", error);
    if (error?.code === "P1001" || error?.message?.includes("Can't reach database server")) {
      return NextResponse.json(
        { message: "Cannot connect to database. Please ensure DATABASE_URL environment setting is set correctly on Render." },
        { status: 503 }
      );
    }
    return NextResponse.json({ message: error.message || "Failed to upgrade account to vendor" }, { status: 500 });
  }
}
