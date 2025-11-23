import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "teensrave-admin-secret-key-2025";

console.log("JWT_SECRET loaded:", JWT_SECRET ? "YES" : "NO");
console.log("JWT_SECRET value:", JWT_SECRET);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!db) {
      // Temporary: bypass database for testing
      console.log("Database not connected, using test auth");
    }

    // Temporary: hardcoded auth for testing
    if (email === "admin@teensrave.com" && password === "admin123") {
      // Generate JWT token
      const token = jwt.sign(
        {
          id: 1,
          email: "admin@teensrave.com",
          role: "admin",
          iat: Math.floor(Date.now() / 1000),
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      console.log("Generated token:", token.substring(0, 50) + "...");

      // Return success response with cookie
      const response = NextResponse.json({
        message: "Login successful",
        token,
        user: {
          id: 1,
          email: "admin@teensrave.com",
          name: "Test Admin",
          role: "admin",
        },
      });

      console.log("Setting cookie with token");

      // Set the cookie server-side
      response.cookies.set("admin_token", token, {
        path: "/",
        maxAge: 86400, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      console.log("Cookie set, returning response");

      return response;
    }

    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}