import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create response that clears the cookie
    const response = NextResponse.json({
      message: "Logout successful"
    });

    // Clear the admin_token cookie
    response.cookies.set("admin_token", "", {
      path: "/",
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}