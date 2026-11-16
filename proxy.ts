import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { canAccessRoute, ROLES } from "@/lib/rbac";
import type { JwtPayload } from "@/types/auth";

export function proxy(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (canAccessRoute(user.role, url)) {
      return NextResponse.next();
    }

    const dashboardMap: Record<string, string> = {
      [ROLES.ADMIN]: "/dashboard/admin",
      [ROLES.ADMIN_STAFF]: "/dashboard/admin-staff",
      [ROLES.METER_READER]: "/dashboard/meter-reader",
      [ROLES.CASHIER]: "/dashboard/billing",
      [ROLES.MANAGER]: "/dashboard/manager",
      [ROLES.CUSTOMER]: "/dashboard/customer",
    };

    const dashboard = dashboardMap[user.role];
    if (dashboard) {
      return NextResponse.redirect(new URL(dashboard, request.url));
    }

    return NextResponse.redirect(new URL("/login", request.url));
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/admin/:path*",
    "/dashboard/manager/:path*",
    "/dashboard/admin-staff/:path*",
    "/dashboard/billing/:path*",
    "/dashboard/meter-reader/:path*",
    "/dashboard/customer/:path*",
    "/api/billing/:path*",
  ],
};
