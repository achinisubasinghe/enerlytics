import type { Role } from "@/types/auth";

export const ROLES = {
  ADMIN: "ADMIN",
  ADMIN_STAFF: "ADMIN_STAFF",
  METER_READER: "METER_READER",
  CASHIER: "CASHIER",
  MANAGER: "MANAGER",
  CUSTOMER: "CUSTOMER",
} as const;

export const PERMISSIONS: Record<string, Record<string, string[] | boolean>> = {
  [ROLES.ADMIN]: {
    users: ["create", "read", "update", "delete"],
    all: true,
  },
  [ROLES.ADMIN_STAFF]: {
    customers: ["create", "read", "update", "delete"],
    meters: ["create", "read", "update", "assign"],
    tariffs: ["create", "read", "update"],
    meterReaders: ["read", "assign"],
    complaints: ["read", "update"],
  },
  [ROLES.METER_READER]: {
    readings: ["create", "read"],
    meters: ["read"],
  },
  [ROLES.CASHIER]: {
    bills: ["create", "read", "update"],
    payments: ["create", "read"],
    customers: ["read"],
  },
  [ROLES.MANAGER]: {
    reports: ["read"],
    customers: ["read"],
    meters: ["read"],
    bills: ["read"],
    payments: ["read"],
    analytics: ["read"],
  },
  [ROLES.CUSTOMER]: {
    bills: ["read"],
    payments: ["create", "read"],
    complaints: ["create", "read"],
    meters: ["read"],
    profile: ["read", "update"],
  },
};

export function hasPermission(
  role: string | undefined,
  resource: string,
  action: string
): boolean {
  if (!role || !resource || !action) return false;

  const rolePermissions = PERMISSIONS[role];
  if (!rolePermissions) return false;

  if ("all" in rolePermissions && rolePermissions.all) return true;

  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions || typeof resourcePermissions === "boolean") return false;
  if (!Array.isArray(resourcePermissions)) return false;

  return resourcePermissions.includes(action);
}

export function canAccessRoute(role: string | undefined, path: string): boolean {
  if (!role || !path) return false;

  if (role === ROLES.ADMIN) return true;

  if (path.startsWith("/dashboard/admin-staff") && role === ROLES.ADMIN_STAFF)
    return true;
  if (path.startsWith("/dashboard/meter-reader") && role === ROLES.METER_READER)
    return true;
  if (path.startsWith("/dashboard/billing") && role === ROLES.CASHIER)
    return true;
  if (path.startsWith("/dashboard/manager") && role === ROLES.MANAGER)
    return true;
  if (path.startsWith("/dashboard/customer") && role === ROLES.CUSTOMER)
    return true;
  if (path.startsWith("/dashboard/admin") && role === ROLES.ADMIN) return true;

  return false;
}

export function requireRole(allowedRoles: Role[]) {
  return (user: { role?: string } | null) => {
    if (!user || !user.role) return false;
    return allowedRoles.includes(user.role as Role);
  };
}
