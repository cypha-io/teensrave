import "dotenv/config";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  if (!db) {
    console.error("Database not configured");
    return;
  }

  try {
    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, "admin@teensrave.com"))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log("Admin user already exists");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Insert admin user
    await db.insert(adminUsers).values({
      email: "admin@teensrave.com",
      password: hashedPassword,
      name: "TeensRave Admin",
      role: "admin",
      isActive: true,
    });

    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}

seedAdmin();