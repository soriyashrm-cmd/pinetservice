import { NextRequest, NextResponse } from "next/server";
import { decryptSession } from "@/lib/session";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    // 1. Authorize Request
    const sessionCookie = req.cookies.get("admin_session")?.value;
    const session = sessionCookie ? await decryptSession(sessionCookie) : null;

    if (!session || !session.authenticated || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse body
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // 3. Verify current password
    const expectedPassword =
      process.env.ADMIN_PASSWORD || "admin_secure_password_2026";

    if (currentPassword !== expectedPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 403 }
      );
    }

    // 4. Update .env file
    const envPath = path.resolve(process.cwd(), ".env");
    let envContent = fs.readFileSync(envPath, "utf-8");

    // Replace the ADMIN_PASSWORD line
    const passwordRegex = /^ADMIN_PASSWORD=.*$/m;
    if (passwordRegex.test(envContent)) {
      envContent = envContent.replace(
        passwordRegex,
        `ADMIN_PASSWORD="${newPassword}"`
      );
    } else {
      // Add it if it doesn't exist
      envContent += `\nADMIN_PASSWORD="${newPassword}"\n`;
    }

    fs.writeFileSync(envPath, envContent, "utf-8");

    // 5. Update runtime env so it takes effect immediately
    process.env.ADMIN_PASSWORD = newPassword;

    return NextResponse.json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
