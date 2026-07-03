import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Role } from "@/lib/types";

const roleHomes: Record<Role, string> = {
  admin: "/admin",
  employee: "/employee",
};

function getEmployeeRole(request: NextRequest): Role | null {
  const raw = request.cookies.get("employee")?.value;
  if (!raw) return null;

  try {
    const employee = JSON.parse(raw);
    return employee?.role === "admin" || employee?.role === "employee"
      ? (employee.role as Role)
      : null;
  } catch {
    return null;
  }
}

// Optimistic check only: reads the session cookie, does not verify it.
// Pages still verify the session server-side via lib/session.ts.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has("session");
  const role = getEmployeeRole(request);

  const isAuthRoute = pathname.startsWith("/auth");
  const isProtectedRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/employee");

  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isProtectedRoute && role && !pathname.startsWith(roleHomes[role])) {
    return NextResponse.redirect(new URL(roleHomes[role], request.url));
  }

  if (isAuthRoute && hasSession && role) {
    return NextResponse.redirect(new URL(roleHomes[role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
