import jwt from "jsonwebtoken";
import { hasPermission } from "./rbac";
import type { AuthUser, JwtPayload, Role } from "@/types/auth";

export function getUserFromRequest(req: Request): JwtPayload | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;

  const tokenMatch = cookie.split(";").find((c) => c.trim().startsWith("token="));
  if (!tokenMatch) return null;

  try {
    return jwt.verify(
      tokenMatch.split("=")[1],
      process.env.JWT_SECRET as string
    ) as JwtPayload;
  } catch {
    return null;
  }
}

export function generateToken(user: AuthUser | JwtPayload): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );
}

export function requireRole(
  req: Request,
  allowedRoles: Role[]
): JwtPayload | null {
  const user = getUserFromRequest(req);
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }
  return user;
}

export function requirePermission(
  req: Request,
  resource: string,
  action: string
): JwtPayload | null {
  const user = getUserFromRequest(req);
  if (!user) return null;

  if (hasPermission(user.role, resource, action)) {
    return user;
  }

  return null;
}
