import { defineConfig } from "@prisma/config";
import fs from "fs";
import path from "path";

// Load .env file manually to ensure database URL is parsed correctly during CLI tasks
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      for (const line of envContent.split("\n")) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || "";
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
          }
          process.env[key] = value.trim();
        }
      }
    }
  } catch (e) {
    console.error("Failed to load .env file", e);
  }
}

loadEnv();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
