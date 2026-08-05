import { PermissionName } from "./permissions";

/**
 * Check if the user has a specific permission
 */
export function hasPermission(userPermissions: string[], permission: PermissionName): boolean {
  return userPermissions.includes(permission);
}

/**
 * Check if the user has at least one of the specified permissions
 */
export function hasAnyPermission(userPermissions: string[], permissions: PermissionName[]): boolean {
  if (permissions.length === 0) return true;
  return permissions.some(perm => userPermissions.includes(perm));
}

/**
 * Check if the user has all of the specified permissions
 */
export function hasAllPermissions(userPermissions: string[], permissions: PermissionName[]): boolean {
  return permissions.every(perm => userPermissions.includes(perm));
}
