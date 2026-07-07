import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptSession } from "./lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Identify routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isLoginRoute = pathname === "/admin/login" || pathname === "/api/admin/login";

  // Get admin session cookie
  const sessionCookie = request.cookies.get("admin_session")?.value;
  let session = null;

  if (sessionCookie) {
    session = await decryptSession(sessionCookie);
  }

  // Determine if session is valid and role is admin
  const isAuthorizedAdmin = session && session.authenticated && session.role === "admin";

  // 2. Protect Admin Pages
  if (isAdminRoute && !isAdminApiRoute) {
    if (isLoginRoute) {
      if (isAuthorizedAdmin) {
        // Already authenticated admin -> redirect to admin dashboard
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (!isAuthorizedAdmin) {
      // Not authenticated -> redirect to login
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Protect Admin APIs
  if (isAdminApiRoute && !isLoginRoute) {
    if (!isAuthorizedAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
