import { NextRequest, NextResponse } from "next/server";
import { decryptSession } from "@/lib/session";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

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
    const dbAdmin = await prisma.adminUser.findFirst();
    let isCurrentPasswordCorrect = false;

    if (dbAdmin) {
      const currentHashed = crypto.createHash("sha256").update(currentPassword).digest("hex");
      isCurrentPasswordCorrect = dbAdmin.passwordHash === currentHashed;
    } else {
      const expectedPassword = process.env.ADMIN_PASSWORD || "admin_secure_password_2026";
      isCurrentPasswordCorrect = currentPassword === expectedPassword;
    }

    if (!isCurrentPasswordCorrect) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 403 }
      );
    }

    // 4. Update .env file (wrap in try-catch in case it's read-only like on Vercel)
    try {
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
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
      }
    } catch (envError) {
      console.warn("Failed to write to .env file (expected on read-only/serverless environments):", envError);
    }

    // 5. Update runtime env so it takes effect immediately for this instance
    process.env.ADMIN_PASSWORD = newPassword;

    // 6. Update database record (upsert the admin user)
    const expectedEmail = process.env.ADMIN_EMAIL || "admin@pi-ecosystem.com";
    const newHashedPassword = crypto.createHash("sha256").update(newPassword).digest("hex");

    if (dbAdmin) {
      await prisma.adminUser.update({
        where: { id: dbAdmin.id },
        data: { passwordHash: newHashedPassword }
      });
    } else {
      await prisma.adminUser.create({
        data: {
          email: expectedEmail,
          passwordHash: newHashedPassword
        }
      });
    }

    return NextResponse.json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
