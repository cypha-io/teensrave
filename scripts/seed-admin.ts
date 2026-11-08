// Creates the first admin from ADMIN_EMAIL and ADMIN_PASSWORD.
// Run with: DOTENV_CONFIG_PATH=.env.local npx tsx scripts/seed-admin.ts
import "dotenv/config";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!db) {
    console.error("Database not configured");
    process.exit(1);
  }
  if (!email || !password || password.length < 12) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters)");
    process.exit(1);
  }

  const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  if (existing.length > 0) {
    console.log("Admin user already exists");
    return;
  }

  await db.insert(adminUsers).values({
    email,
    password: await bcrypt.hash(password, 12),
    name: "TeensRave Admin",
    role: "admin",
    isActive: true,
  });
  console.log("Admin user created successfully");
}

seedAdmin().catch((error) => {
  console.error("Error seeding admin user:", error);
  process.exit(1);
});
