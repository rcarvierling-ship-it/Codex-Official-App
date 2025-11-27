import { createHash } from "crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { hasDbEnv } from "@/lib/db";
import { normalizeRole } from "@/lib/nav";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!hasDbEnv) {
      return NextResponse.json(
        { message: "Database not configured." },
        { status: 503 },
      );
    }
    
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 },
      );
    }

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.includes("@")) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    // Hash password using SHA-256 (matching auth.ts)
    const hashedPassword = createHash("sha256")
      .update(password)
      .digest("hex");

    // Try using Drizzle ORM first, fallback to raw SQL if it fails
    try {
      const { getDb } = await import("@/server/db/client");
      const { users } = await import("@/server/db/schema");
      
      // Get the actual db instance
      const db = await getDb();

      // Check if user already exists
    const existing = await db
      .select({ id: users.id })
      .from(users)
        .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "An account with that email already exists." },
        { status: 409 },
      );
    }

      // Insert new user into Neon users table
      const result = await db.insert(users).values({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "fan", // Default role for new signups
      }).returning({ id: users.id });

      if (!result || result.length === 0) {
        throw new Error("Failed to create user - no ID returned");
      }

      console.log(`[api/register] Successfully created user: ${normalizedEmail}`);

      return NextResponse.json(
        { 
          ok: true, 
          userId: result[0].id,
          message: "Account created successfully" 
        }, 
        { status: 201 }
      );
    } catch (drizzleError: any) {
      // Fallback to raw SQL if Drizzle fails (e.g., table doesn't exist yet)
      console.warn("[api/register] Drizzle failed, trying raw SQL:", drizzleError?.message);
      
      try {
        const { sql } = await import("@/lib/db");
        
        // Try to create users table if it doesn't exist
        try {
          await sql`
            CREATE TABLE IF NOT EXISTS users (
              id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
              name varchar(120),
              email varchar(255) NOT NULL UNIQUE,
              image varchar(1024),
              password varchar(255),
              role varchar(32) NOT NULL DEFAULT 'fan',
              active_school_id uuid,
              created_at timestamp NOT NULL DEFAULT now()
            )
          `;
          console.log("[api/register] Created users table");
        } catch (createError: any) {
          // Table might already exist, or we don't have CREATE permissions
          if (!createError?.message?.includes("already exists") && !createError?.code?.includes("42P07")) {
            console.warn("[api/register] Could not create users table:", createError?.message);
          }
        }
        
        // Check if user exists using raw SQL
        const existingCheck = await sql<{ id: string }>`
          SELECT id FROM users WHERE email = ${normalizedEmail} LIMIT 1
        `;
        
        if (existingCheck.rows.length > 0) {
          return NextResponse.json(
            { message: "An account with that email already exists." },
            { status: 409 },
          );
        }

        // Insert user using raw SQL
        const defaultRole = normalizeRole("fan");
        const insertResult = await sql<{ id: string }>`
          INSERT INTO users (name, email, password, role, created_at)
          VALUES (${name.trim()}, ${normalizedEmail}, ${hashedPassword}, ${defaultRole}, NOW())
          RETURNING id
        `;

        if (!insertResult.rows || insertResult.rows.length === 0) {
          throw new Error("Failed to create user - no ID returned from SQL insert");
        }

        console.log(`[api/register] Successfully created user via SQL: ${normalizedEmail}`);

        return NextResponse.json(
          { 
            ok: true, 
            userId: insertResult.rows[0].id,
            message: "Account created successfully" 
          }, 
          { status: 201 }
        );
      } catch (sqlError: any) {
        // If SQL also fails, check if it's a table missing error
        if (sqlError?.message?.includes("does not exist") || sqlError?.message?.includes("relation") || sqlError?.code === "42P01") {
          return NextResponse.json(
            { 
              message: "Database table not found. Please run the setup script (setup-neon-tables.sql) in Neon SQL Editor to create the users table." 
            },
            { status: 503 },
          );
        }
        // Re-throw to be caught by outer catch
        throw sqlError;
      }
    }

  } catch (error: any) {
    console.error("[api/register] POST failed", error);
    
    // Handle specific database errors
    if (error?.code === "23505" || error?.message?.includes("unique")) {
      return NextResponse.json(
        { message: "An account with that email already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { 
        message: error?.message || "Failed to create user. Please try again." 
      },
      { status: 500 },
    );
  }
}
