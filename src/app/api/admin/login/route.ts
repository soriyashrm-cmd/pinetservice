import { NextRequest, NextResponse } from "next/server";
import { encryptSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    // Fetch config values, fallback to safe defaults if not provided in environment
    const expectedEmail = process.env.ADMIN_EMAIL || "admin@pi-ecosystem.com";
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin_secure_password_2026";

    // Check if there is an AdminUser in the database
    let isValid = false;
    let actualEmail = expectedEmail;

    const dbAdmin = await prisma.adminUser.findFirst();
    if (dbAdmin) {
      const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
      isValid = dbAdmin.passwordHash === hashedPassword;
      actualEmail = dbAdmin.email;
    } else {
      isValid = password === expectedPassword;
    }

    if (isValid) {
      // Create session payload
      const sessionPayload = {
        authenticated: true,
        email: actualEmail,
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
        { error: "Invalid password" },
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
