import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hasDbEnv } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OWNER_EMAIL = "admin@the-official-app.com";
const OWNER_PASSWORD = "Reese510";
const OWNER_NAME = "Owner";

export async function POST() {
  try {
    if (!hasDbEnv) {
      return NextResponse.json(
        { message: "Database not configured." },
        { status: 503 },
      );
    }

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
      return NextResponse.json({
        ok: true,
        message: "Owner account updated successfully",
        email: OWNER_EMAIL,
        role: "SUPER_ADMIN",
      });
    } else {
      // Create new user
      const { rows } = await sql<{ id: string }>`
        INSERT INTO users (name, email, password, role, created_at)
        VALUES (${OWNER_NAME}, ${OWNER_EMAIL}, ${hashedPassword}, 'SUPER_ADMIN', NOW())
        RETURNING id
      `;
      return NextResponse.json({
        ok: true,
        message: "Owner account created successfully",
        email: OWNER_EMAIL,
        role: "SUPER_ADMIN",
        userId: rows[0]?.id,
      });
    }
  } catch (error: any) {
    console.error("[api/owner/setup] failed", error);
    return NextResponse.json(
      { message: error?.message || "Failed to setup owner account" },
      { status: 500 },
    );
  }
}

