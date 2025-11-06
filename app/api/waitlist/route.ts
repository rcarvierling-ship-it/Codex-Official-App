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
  const body = await request.json().catch(() => null);
  const parsed = waitlistPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid payload", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, organization, role, _topic } = parsed.data;

  // Honeypot
  if (_topic && _topic.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Rate limit
  const ip = getClientIp(request);
  const now = Date.now();
  if (isRateLimited(ip, now)) {
    return NextResponse.json(
      { message: "Too many submissions from this IP. Please try again later." },
      { status: 429 }
    );
  }

  // IP hash (stable/anonymized)
  const secret =
    process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "theofficialapp-secret";
  const ipHash = createHash("sha256").update(`${ip}:${secret}`).digest("hex");
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  try {
    // Primary schema (organization/ip_hash/user_agent)
    const res1 = await sql/*sql*/`
      insert into waitlist (name, email, organization, role, ip_hash, user_agent, submitted_at)
      values (${name}, ${email}, ${organization ?? null}, ${role}, ${ipHash}, ${userAgent}, now())
      on conflict (email) do update set
        name = excluded.name,
        organization = coalesce(excluded.organization, waitlist.organization),
        role = coalesce(excluded.role, waitlist.role),
        ip_hash = coalesce(excluded.ip_hash, waitlist.ip_hash),
        user_agent = coalesce(excluded.user_agent, waitlist.user_agent),
        submitted_at = waitlist.submitted_at
      returning id
    `;
    const id1 = (res1 as { rows?: WaitlistRow[] }).rows?.[0]?.id ?? null;
    return NextResponse.json({ id: id1 }, { status: 201 });
  } catch (err: any) {
    // Fallback to alt column names (org/iphash/useragent)
    const msg = String(err?.message ?? "");
    console.warn("[waitlist] primary insert failed, trying fallback:", msg);
    try {
      const res2 = await sql/*sql*/`
        insert into waitlist (name, email, org, role, iphash, useragent, submitted_at)
        values (${name}, ${email}, ${organization ?? null}, ${role}, ${ipHash}, ${userAgent}, now())
        on conflict (email) do update set
          name = excluded.name,
          org = coalesce(excluded.org, waitlist.org),
          role = coalesce(excluded.role, waitlist.role)
        returning id
      `;
      const id2 = (res2 as { rows?: WaitlistRow[] }).rows?.[0]?.id ?? null;
      return NextResponse.json({ id: id2 }, { status: 201 });
    } catch (err2: any) {
      const m2 = String(err2?.message ?? "");
      console.error("[api/waitlist] insert failed:", m2);
      if (m2.includes("relation") && m2.includes("does not exist")) {
        return NextResponse.json(
          { message: "Table 'waitlist' is missing in the database." },
          { status: 500 }
        );
      }
      if (m2.includes("duplicate key") || m2.includes("unique constraint")) {
        return NextResponse.json({ message: "Already on the waitlist." }, { status: 409 });
      }
      return NextResponse.json({ message: "Failed to save waitlist entry." }, { status: 500 });
    }
  }
}

export async function GET() {
  try {
    const { rows } = await sql/*sql*/`
      select id, name, email, coalesce(organization, org) as organization, role, submitted_at
      from waitlist
      order by submitted_at desc
      limit 20
    `;
    return NextResponse.json(rows, { status: 200 });
  } catch (err: any) {
    console.error("[api/waitlist] list failed:", err?.message || err);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
