// app/api/waitlist/route.ts
export const runtime = "nodejs";

import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";


// Types for returned rows
type WaitlistRow = { id: string };

const waitlistPayloadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  organization: z.string().optional().nullable(),
  role: z.enum(["School Admin", "AD", "Coach", "Official", "Admin", "Other"]),
  _topic: z.string().optional().nullable(), // honeypot
});

const rateLimitStore = new Map<string, number[]>();
const WAITLIST_LIMIT_PER_HOUR = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
let waitlistTableEnsured = false;

async function ensureWaitlistTable() {
  if (waitlistTableEnsured) return;
  try {
    try { await sql`create extension if not exists pgcrypto;`; } catch {}
    
    await sql`
      create table if not exists public.waitlist (
        id           uuid primary key default gen_random_uuid(),
        name         text,
        email        text unique not null,
        organization text,
        org          text,
        role         text,
        ip_hash      text,
        iphash       text,
        user_agent   text,
        useragent    text,
        submitted_at timestamptz not null default now()
      );
    `;
    
    try {
      await sql`create index if not exists idx_waitlist_submitted_at on public.waitlist (submitted_at desc);`;
    } catch {}

    waitlistTableEnsured = true;
  } catch (error) {
    throw error;
  }
}

function getClientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "127.0.0.1";
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

function isRateLimited(ip: string, now: number) {
  const ts = rateLimitStore.get(ip) ?? [];
  const recent = ts.filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= WAITLIST_LIMIT_PER_HOUR) {
    rateLimitStore.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateLimitStore.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  try {} catch {
    return NextResponse.json(
      { message: "Database setup error." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = waitlistPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid payload", errors: parsed.error.flatten() },
      { status: 400 }
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
      { message: "Too many submissions from this IP." },
      { status: 429 }
    );
  }

  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "theofficialapp-secret";
  const ipHash = createHash("sha256").update(`${ip}:${secret}`).digest("hex");
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  try {
    const res = await sql`
      insert into waitlist (name, email, org, role, ip_hash, user_agent, submitted_at)
      values (${name}, ${email}, ${organization ?? null}, ${role}, ${ipHash}, ${userAgent}, now())
      on conflict (email) do update set
        name = excluded.name,
        org = coalesce(excluded.org, waitlist.org),
        role = coalesce(excluded.role, waitlist.role),
        ip_hash = coalesce(excluded.ip_hash, waitlist.ip_hash),
        user_agent = coalesce(excluded.user_agent, waitlist.user_agent),
        submitted_at = waitlist.submitted_at
      returning id
    `;
    const insertedId = (res as { rows?: WaitlistRow[] }).rows?.[0]?.id ?? null;

    // TODO: email sending removed – just log for now
    console.log("Waitlist submission:", {
      id: insertedId,
      name,
      email,
      organization,
      role,
    });

    return NextResponse.json({ id: insertedId }, { status: 201 });

  } catch (err: any) {
    const errorMsg = String(err?.message ?? "");
    if (errorMsg.includes("duplicate key")) {
      return NextResponse.json({ message: "Already on the waitlist." }, { status: 409 });
    }
    return NextResponse.json({ message: "Failed to save waitlist entry.", error: errorMsg }, { status: 500 });
  }
}

export async function GET() {
  try {
    await ensureWaitlistTable();
    const { rows } = await sql`
      select id, name, email, org as organization, role, submitted_at
      from waitlist
      order by submitted_at desc
      limit 20
    `;
    return NextResponse.json(rows, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
