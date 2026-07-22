import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, setAuthCookies, formatUserResponse } from "@/lib/auth/authentication";
import { initializeRolesAndPermissions, getPermissionsForRoles } from "@/lib/auth/authorization/permissions";

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
    const body = await req.json();
    const { 
      // Personal
      firstName, lastName, email, phone, password,
      // Store Info
      storeName, storeDescription, storeCategory,
      // Business Info
      businessType, businessName, registrationNumber, taxId,
      // Contact
      businessEmail, businessPhone, country, region, city, streetAddress, postalCode,
      // Payout Preference
      payoutMethod
    } = body;

    // Simple Server-side validation
    if (!firstName || !lastName || !email || !password || !storeName || !businessName || !streetAddress || !city || !region || !country) {
      return NextResponse.json({ message: "Required registration fields are missing" }, { status: 400 });
    }

    // Ensure roles and permissions are initialized
    await initializeRolesAndPermissions();

    // Check duplicate email
    const existingUserByEmail = await db.user.findFirst({
      where: { email, deletedAt: null }
    });
    if (existingUserByEmail) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 400 });
    }

    // Check duplicate phone
    if (phone) {
      const existingUserByPhone = await db.user.findFirst({
        where: { phone, deletedAt: null }
      });
      if (existingUserByPhone) {
        return NextResponse.json({ message: "An account with this phone number already exists" }, { status: 400 });
      }
    }

    // Check duplicate store name
    const existingStore = await db.store.findFirst({
      where: { name: storeName, deletedAt: null }
    });
    if (existingStore) {
      return NextResponse.json({ message: "Store name is already taken" }, { status: 400 });
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create everything in transaction
    const result = await db.$transaction(async (tx) => {
      // Find roles
      const customerRole = await tx.role.findUnique({ where: { name: "CUSTOMER" } });
      const vendorRole = await tx.role.findUnique({ where: { name: "VENDOR" } });

      if (!customerRole || !vendorRole) {
        throw new Error("Required system roles not configured in DB");
      }

      // 1. Create User
      const user = await tx.user.create({
        data: {
          email,
          phone: phone || null,
          passwordHash,
          firstName,
          lastName,
          status: "ACTIVE",
          emailVerified: false,
          emailVerificationStatus: "UNVERIFIED"
        }
      });

      // 2. Map Multiple Roles (Customer + Vendor)
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

      // 5. Generate Unique SEO-friendly slug
      const slug = await generateUniqueStoreSlug(storeName);

      // 6. Create Store
      const store = await tx.store.create({
        data: {
          vendorProfileId: vendorProfile.id,
          name: storeName,
          slug,
          description: storeDescription || null,
          category: storeCategory
        }
      });

      // 7. Write Audit Log
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "VENDOR_REGISTER",
          targetResource: `Store:${store.id}`,
          metadata: {
            roles: ["CUSTOMER", "VENDOR"],
            storeName,
            businessName,
            payoutMethod
          }
        }
      });

      return { user, store };
    });

    const roles = ["CUSTOMER", "VENDOR"];
    const permissions = getPermissionsForRoles(roles);

    // Issue Secure HTTP-Only Cookies
    await setAuthCookies({
      userId: result.user.id,
      email: result.user.email,
      firstName,
      lastName,
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
    return NextResponse.json({ message: error.message || "Registration failed" }, { status: 500 });
  }
}
