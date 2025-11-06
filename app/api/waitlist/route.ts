import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/server/db/client";
import { waitlist } from "@/server/db/schema";
import { WaitlistConfirmationEmail } from "@/emails/waitlist-confirmation";

const rateLimitStore = new Map<string, number[]>();
const WAITLIST_LIMIT_PER_HOUR = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const waitlistPayloadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  organization: z.string().optional().nullable(),
  role: z.enum([
    "School Admin",
    "AD",
    "Coach",
    "Official",
    "Admin",
    "Other",
  ]),
  _topic: z.string().optional().nullable(),
});

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "127.0.0.1";
  }

  return request.headers.get("x-real-ip") ?? "127.0.0.1";
}

function isRateLimited(ip: string, now: number) {
  const timestamps = rateLimitStore.get(ip) ?? [];
  const filtered = timestamps.filter((ts) => now - ts < RATE_WINDOW_MS);

  if (filtered.length >= WAITLIST_LIMIT_PER_HOUR) {
    rateLimitStore.set(ip, filtered);
    return true;
  }

  filtered.push(now);
  rateLimitStore.set(ip, filtered);
  return false;
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const parsed = waitlistPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid payload", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, email, organization, role, _topic } = parsed.data;

  if (_topic && _topic.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const ip = getClientIp(request);
  const now = Date.now();

  if (isRateLimited(ip, now)) {
    return NextResponse.json(
      { message: "Too many submissions from this IP. Please try again later." },
      { status: 429 },
    );
  }

  const secret = process.env.NEXTAUTH_SECRET ?? "theofficialapp-secret";
  const ipHash = createHash("sha256").update(`${ip}:${secret}`).digest("hex");
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  try {
    const existing = await db
      .select({ id: waitlist.id })
      .from(waitlist)
      .where(eq(waitlist.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Already on the waitlist." },
        { status: 409 },
      );
    }

    await db.insert(waitlist).values({
      name,
      email,
      org: organization ?? null,
      role,
      ipHash,
      userAgent,
    });
  } catch (error) {
    console.error("[api/waitlist] insert failed", error);
    return NextResponse.json(
      { message: "Failed to save waitlist entry." },
      { status: 500 },
    );
  }

  if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Welcome to The Official App waitlist",
        react: WaitlistConfirmationEmail({ name }),
      });
    } catch (emailError) {
      console.warn("[api/waitlist] email send skipped", emailError);
    }
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
