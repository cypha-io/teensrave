import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canOpenPage } from "@/lib/permissions";
import { homeFor, sessionFromRequest, type Session } from "@/lib/session";

// Every API route needs a session unless it is listed here.
const PUBLIC_API: Record<string, string[]> = {
  "/api/auth/login": ["POST"],
  "/api/auth/logout": ["POST"],
  "/api/artists": ["POST"],
  "/api/media-accreditation": ["POST"],
  "/api/contact": ["POST"],
  "/api/newsletter": ["POST"],
};

// Older admin endpoints and the permission section that guards each one.
const API_SECTIONS: [string, string][] = [
  ["/api/artists", "artists"],
  ["/api/media-accreditation", "media"],
  ["/api/contact", "support"],
  ["/api/newsletter", "newsletter"],
  ["/api/news", "news"],
  ["/api/shop", "shop"],
];

function json(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function apiAllowed(pathname: string, method: string, session: Session) {
  if (session.kind === "admin") return !pathname.startsWith("/api/portal");
  if (pathname.startsWith("/api/portal/")) return true;
  if (pathname === "/api/pos/tellers") return session.permissions.includes(`tellers.${method === "GET" ? "view" : "manage"}`);
  if (pathname.startsWith("/api/pos/")) return session.permissions.includes("pos.manage");
  // These routes apply each person's permissions themselves.
  if (pathname.startsWith("/api/admin/resources/")) return true;
  const match = API_SECTIONS.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return Boolean(match) && session.permissions.includes(`${match![1]}.${method === "GET" ? "view" : "manage"}`);
}

function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

function redirect(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

function toLogin(request: NextRequest, target: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("redirect", target);
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    if (PUBLIC_API[pathname]?.includes(request.method) || pathname.startsWith("/api/placeholder/")) return NextResponse.next();
    const session = await sessionFromRequest(request);
    if (!session) return json("Unauthorized", 401);
    if (pathname === "/api/auth/me" || pathname === "/api/auth/change-password") return NextResponse.next();
    if (session.mustChangePassword) return json("Password change required", 403);
    return apiAllowed(pathname, request.method, session) ? NextResponse.next() : json("Forbidden", 403);
  }

  if (pathname === "/login") {
    const session = await sessionFromRequest(request);
    return session ? redirect(request, homeFor(session)) : NextResponse.next();
  }

  if (pathname === "/pos") {
    const session = await sessionFromRequest(request);
    if (!session) return toLogin(request, pathname);
    if (session.mustChangePassword) return redirect(request, "/change-password");
    return session.permissions.includes("pos.manage") ? noStore(NextResponse.next()) : redirect(request, homeFor(session));
  }

  if (pathname === "/change-password") {
    const session = await sessionFromRequest(request);
    return session ? noStore(NextResponse.next()) : toLogin(request, pathname);
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const session = await sessionFromRequest(request);
    if (!session) return toLogin(request, pathname);
    if (session.mustChangePassword) return redirect(request, "/change-password");
    if (session.kind === "admin") return redirect(request, homeFor(session));
    // The ticket team's dashboard is the POS itself.
    const posOnly = session.permissions.includes("pos.manage") && session.permissions.every((permission) => permission.startsWith("pos."));
    if (posOnly) return redirect(request, "/pos");
    return noStore(NextResponse.next());
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const session = await sessionFromRequest(request);
    if (!session) return toLogin(request, pathname === "/admin" ? "/admin/dashboard" : pathname);
    if (session.mustChangePassword) return redirect(request, "/change-password");
    if (session.kind === "admin") return noStore(NextResponse.next());
    const segment = pathname.match(/^\/admin\/dashboard\/([^/]+)$/)?.[1];
    return segment && canOpenPage(segment, session.permissions) ? noStore(NextResponse.next()) : redirect(request, "/dashboard");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
  runtime: "nodejs", // Use Node.js runtime instead of Edge Runtime
};
