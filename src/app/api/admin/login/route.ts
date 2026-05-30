import { NextRequest, NextResponse } from "next/server";
import { encryptSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Fetch config values, fallback to safe defaults if not provided in environment
    const expectedEmail = process.env.ADMIN_EMAIL || "admin@pi-ecosystem.com";
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin_secure_password_2026";

    if (email === expectedEmail && password === expectedPassword) {
      // Create session payload
      const sessionPayload = {
        authenticated: true,
        email: email,
        role: "admin",
        timestamp: new Date().toISOString(),
      };

      const encryptedToken = await encryptSession(sessionPayload);

      const response = NextResponse.json({ success: true });
      
      // Store encrypted token in httpOnly session cookie
      response.cookies.set("admin_session", encryptedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    } else {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Admin login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
