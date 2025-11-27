/**
 * Script to create or update the owner account
 * Run with: npx tsx scripts/create-owner.ts
 */

import { createHash } from "crypto";
import { sql } from "@/lib/db";

const OWNER_EMAIL = "admin@the-official-app.com";
const OWNER_PASSWORD = "Reese510";
const OWNER_NAME = "Owner";

async function createOwner() {
  try {
    // Check if user already exists
    const { rows: existing } = await sql<{ id: string; email: string }>`
      SELECT id, email FROM users WHERE email = ${OWNER_EMAIL} LIMIT 1
    `;

    // Hash password using SHA-256 (matching auth.ts)
    const hashedPassword = createHash("sha256")
      .update(OWNER_PASSWORD)
      .digest("hex");

    if (existing.length > 0) {
      // Update existing user
      await sql`
        UPDATE users 
        SET 
          name = ${OWNER_NAME},
          password = ${hashedPassword},
          role = 'SUPER_ADMIN'
        WHERE email = ${OWNER_EMAIL}
      `;
      console.log(`✅ Updated owner account: ${OWNER_EMAIL}`);
    } else {
      // Create new user
      await sql`
        INSERT INTO users (name, email, password, role, created_at)
        VALUES (${OWNER_NAME}, ${OWNER_EMAIL}, ${hashedPassword}, 'SUPER_ADMIN', NOW())
      `;
      console.log(`✅ Created owner account: ${OWNER_EMAIL}`);
    }

    console.log(`\n📧 Email: ${OWNER_EMAIL}`);
    console.log(`🔑 Password: ${OWNER_PASSWORD}`);
    console.log(`👤 Role: SUPER_ADMIN`);
    console.log(`\nYou can now log in with these credentials.`);
  } catch (error) {
    console.error("❌ Failed to create/update owner:", error);
    process.exit(1);
  }
}

createOwner();

