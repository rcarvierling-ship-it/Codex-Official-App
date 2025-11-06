import { createHash } from "crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/server/db/client";
import { users } from "@/server/db/schema";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 },
      );
    }

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "An account with that email already exists." },
        { status: 409 },
      );
    }

    const hashedPassword = createHash("sha256")
      .update(password)
      .digest("hex");

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[api/register] POST failed", error);
    return NextResponse.json(
      { message: "Failed to create user." },
      { status: 500 },
    );
  }
}
