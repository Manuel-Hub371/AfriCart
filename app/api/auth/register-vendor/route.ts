import { NextResponse } from "next/server";
import { db, withDbRetry } from "@/lib/db";
import { hashPassword, setAuthCookies, formatUserResponse } from "@/lib/auth/authentication";
import { ensureRole, getPermissionsForRoles } from "@/lib/auth/authorization/permissions";
import { isValidStoreCategorySlug, mapLegacyCategoryToOfficialSlug } from "@/lib/constants/store-categories";

import { RegisterVendorPayloadSchema } from "@/modules/vendor/dto";

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
    slug = `${baseSlug}-${counter}-${Math.random().toString(36).substring(2, 6)}`;
    counter++;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Zod Server-side payload validation
    const parsed = RegisterVendorPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error }, { status: 400 });
    }

    const data = parsed.data;

    // 2. Strict Store Category Validation (Reject invalid category slugs with HTTP 400)
    for (const slug of data.categorySlugs) {
      if (!isValidStoreCategorySlug(slug)) {
        return NextResponse.json({ message: `Invalid store category slug: ${slug}` }, { status: 400 });
      }
    }

    // 3. Duplicate checks
    const existingUserByEmail = await db.user.findFirst({
      where: { email: data.email, deletedAt: null }
    });
    if (existingUserByEmail) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 400 });
    }

    if (data.phone) {
      const existingUserByPhone = await db.user.findFirst({
        where: { phone: data.phone, deletedAt: null }
      });
      if (existingUserByPhone) {
        return NextResponse.json({ message: "An account with this phone number already exists" }, { status: 400 });
      }
    }

    const existingStore = await db.store.findFirst({
      where: { name: data.storeName, deletedAt: null }
    });
    if (existingStore) {
      return NextResponse.json({ message: "Store name is already taken" }, { status: 400 });
    }

    // Hash the password
    const passwordHash = await hashPassword(data.password);

    // Create everything in atomic transaction with automatic connection retry
    const result = await withDbRetry(() =>
      db.$transaction(async (tx) => {
        // Self-healing role resolution
        const customerRole = await ensureRole(tx, "CUSTOMER");
        const vendorRole = await ensureRole(tx, "VENDOR");

        // 1. Create User
        const user = await tx.user.create({
          data: {
            email: data.email,
            phone: data.phone || null,
            passwordHash,
            firstName: data.firstName,
            lastName: data.lastName,
            status: "ACTIVE",
            emailVerified: false,
            emailVerificationStatus: "UNVERIFIED"
          }
        });

        // 2. Assign Roles (CUSTOMER + VENDOR)
        await tx.userRole.createMany({
          data: [
            { userId: user.id, roleId: customerRole.id },
            { userId: user.id, roleId: vendorRole.id }
          ]
        });

        // 3. Create Customer Profile
        await tx.customerProfile.create({
          data: {
            userId: user.id
          }
        });

        // 4. Create Vendor Profile
        const vendorProfile = await tx.vendorProfile.create({
          data: {
            userId: user.id,
            businessName: data.businessName,
            businessCategory: data.categorySlugs[0] || "electronics-gadget",
            businessType: data.businessType,
            country: data.country,
            region: data.region,
            city: data.city,
            businessAddress: data.streetAddress,
            identityVerificationStatus: "PENDING",
            businessVerificationStatus: "PENDING"
          }
        });

        // 5. Create Vendor Verification Model
        await tx.vendorVerification.create({
          data: {
            vendorProfileId: vendorProfile.id,
            registrationNumber: data.registrationNumber || null,
            taxId: data.taxId || null,
            idDocumentUrl: data.idDocumentUrl || null,
            businessCertificateUrl: data.businessCertificateUrl || null,
          }
        });

        // 6. Create Vendor Payout Profile Model
        await tx.vendorPayoutProfile.create({
          data: {
            vendorProfileId: vendorProfile.id,
            payoutMethod: data.payoutMethod || "MOBILE_MONEY",
            provider: data.payoutProvider || null,
            accountNumber: data.payoutAccountNumber || null,
            accountName: data.payoutAccountName || null,
          }
        });

        // 7. Fetch matching StoreCategory records
        const categoryRecords = await tx.storeCategory.findMany({
          where: { slug: { in: data.categorySlugs } },
        });

        // 8. Generate Unique SEO-friendly slug
        const slug = await generateUniqueStoreSlug(data.storeName);

        // 9. Create Store (Default status PENDING_APPROVAL, isPublic false)
        const store = await tx.store.create({
          data: {
            vendorProfileId: vendorProfile.id,
            name: data.storeName,
            slug,
            description: data.storeDescription || null,
            category: categoryRecords[0]?.name || "Electronics & Gadget",
            businessType: data.businessType,
            country: data.country,
            region: data.region,
            city: data.city,
            address: data.streetAddress,
            postalCode: data.postalCode || null,
            status: "PENDING_APPROVAL",
            isPublic: false,
            categories: {
              create: categoryRecords.map((c) => ({
                storeCategoryId: c.id,
              })),
            },
          },
        });

        // 10. Audit Log (No raw financial credentials or tax IDs in log metadata)
        await tx.auditLog.create({
          data: {
            actorId: user.id,
            action: "VENDOR_REGISTER",
            targetResource: `Store:${store.id}`,
            metadata: {
              roles: ["CUSTOMER", "VENDOR"],
              storeName: data.storeName,
              businessName: data.businessName,
              payoutMethod: data.payoutMethod,
            }
          }
        });

        return { user, store };
      })
    );

    const roles = ["CUSTOMER", "VENDOR"];
    const permissions = getPermissionsForRoles(roles);

    // Issue Secure HTTP-Only Cookies
    await setAuthCookies({
      userId: result.user.id,
      email: result.user.email,
      firstName: data.firstName,
      lastName: data.lastName,
      roles,
      permissions
    });

    // Load full user details for response
    const fullUser = await db.user.findUnique({
      where: { id: result.user.id },
      include: {
        vendorProfile: {
          include: {
            stores: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      user: formatUserResponse(fullUser, roles, permissions)
    });

  } catch (error: any) {
    console.error("Vendor registration error:", error);
    if (
      error?.code === "P1000" ||
      error?.code === "P1001" ||
      error?.message?.includes("Authentication failed") ||
      error?.message?.includes("Can't reach database server")
    ) {
      return NextResponse.json(
        { message: "Invalid database credentials. Please copy the Internal Database URL directly from your Render Database Dashboard into DATABASE_URL." },
        { status: 503 }
      );
    }
    if (error?.code === "P2021" || error?.message?.includes("does not exist")) {
      return NextResponse.json(
        { message: "Database tables are not initialized. Please set Render Build Command to: npm install && npx prisma generate && npx prisma db push --skip-generate && npm run build" },
        { status: 503 }
      );
    }
    return NextResponse.json({ message: error.message || "Registration failed" }, { status: 500 });
  }
}
