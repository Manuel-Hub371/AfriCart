import { db } from "@/lib/db";

export const Permissions = {
  // Customer Permissions
  BUY_PRODUCTS: "BUY_PRODUCTS",
  VIEW_CUSTOMER_DASHBOARD: "VIEW_CUSTOMER_DASHBOARD",
  MANAGE_PROFILE: "MANAGE_PROFILE",
  
  // Vendor Permissions
  SELL_PRODUCTS: "SELL_PRODUCTS",
  VIEW_VENDOR_DASHBOARD: "VIEW_VENDOR_DASHBOARD",
  MANAGE_PRODUCTS: "MANAGE_PRODUCTS",
  MANAGE_STORES: "MANAGE_STORES",
  MANAGE_INVENTORY: "MANAGE_INVENTORY",
  VIEW_ANALYTICS: "VIEW_ANALYTICS",

  // Admin Permissions
  ACCESS_ADMIN: "ACCESS_ADMIN",
  MANAGE_USERS: "MANAGE_USERS",
  VERIFY_VENDORS: "VERIFY_VENDORS",
} as const;

export type PermissionName = keyof typeof Permissions;

export const RolePermissionsMap: Record<string, PermissionName[]> = {
  CUSTOMER: [
    "BUY_PRODUCTS",
    "VIEW_CUSTOMER_DASHBOARD",
    "MANAGE_PROFILE"
  ],
  VENDOR: [
    "BUY_PRODUCTS",
    "VIEW_CUSTOMER_DASHBOARD",
    "MANAGE_PROFILE",
    "SELL_PRODUCTS",
    "VIEW_VENDOR_DASHBOARD",
    "MANAGE_PRODUCTS",
    "MANAGE_STORES",
    "MANAGE_INVENTORY",
    "VIEW_ANALYTICS"
  ],
  ADMIN: [
    "BUY_PRODUCTS",
    "VIEW_CUSTOMER_DASHBOARD",
    "MANAGE_PROFILE",
    "SELL_PRODUCTS",
    "VIEW_VENDOR_DASHBOARD",
    "MANAGE_PRODUCTS",
    "MANAGE_STORES",
    "MANAGE_INVENTORY",
    "VIEW_ANALYTICS",
    "ACCESS_ADMIN",
    "MANAGE_USERS",
    "VERIFY_VENDORS"
  ]
};

/**
 * Get unified permissions for a set of roles
 */
export function getPermissionsForRoles(roles: string[]): PermissionName[] {
  const permSet = new Set<PermissionName>();
  
  roles.forEach(roleName => {
    const uppercaseRole = roleName.toUpperCase();
    const perms = RolePermissionsMap[uppercaseRole] || [];
    perms.forEach(p => permSet.add(p));
  });

  return Array.from(permSet);
}

/**
 * Ensure roles and permissions exist in the database and are linked
 */
export async function initializeRolesAndPermissions() {
  try {
    for (const [roleName, permissions] of Object.entries(RolePermissionsMap)) {
      // 1. Upsert Role
      const role = await db.role.upsert({
        where: { name: roleName },
        update: {},
        create: { name: roleName, description: `${roleName} Role` },
      });

      for (const permName of permissions) {
        // 2. Upsert Permission
        const permission = await db.permission.upsert({
          where: { name: permName },
          update: {},
          create: { name: permName, description: `Permission to ${permName.toLowerCase().replace(/_/g, " ")}` },
        });

        // 3. Link Role and Permission
        await db.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permission.id,
          },
        });
      }
    }
  } catch (error) {
    console.error("Failed to initialize roles and permissions in DB:", error);
  }
}
