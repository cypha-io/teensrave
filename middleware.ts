import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "teensrave-admin-secret-key-2025";

console.log("Middleware JWT_SECRET loaded:", JWT_SECRET ? "YES" : "NO");
console.log("Middleware JWT_SECRET value:", JWT_SECRET);

// Define protected routes
const protectedRoutes = ["/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Allow access to login page
  if (pathname === "/admin/login") {
    const token = request.cookies.get("admin_token")?.value;

    if (token) {
      try {
        jwt.verify(token, JWT_SECRET);
        // User is authenticated, redirect to dashboard
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } catch (error) {
        // Token is invalid, continue to login
      }
    }
    return NextResponse.next();
  }

  // Check if accessing admin routes
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check for authentication token
    const token = request.cookies.get("admin_token")?.value ||
                  request.headers.get("authorization")?.replace("Bearer ", "");

    console.log("Middleware check - Path:", pathname);
    console.log("Token present:", !!token);

    if (!token) {
      console.log("No token found, redirecting to login");
      // Redirect to login if no token
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      console.log("Token verified successfully for user:", decoded.email);
      // Token is valid, allow the request
      return NextResponse.next();
    } catch (error) {
      console.log("Token verification failed:", error.message);
      // Token is invalid, redirect to login
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
  runtime: "nodejs", // Use Node.js runtime instead of Edge Runtime
};