export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const dbInfo = await sql/*sql*/`
      select current_database() as db,
             current_user as usr,
             inet_server_addr()::text as host_ip,
             current_schema() as schema;
    `;
    const searchPath = await sql/*sql*/`show search_path;`;
    const tables = await sql/*sql*/`
      select table_schema, table_name
      from information_schema.tables
      where table_schema in ('public')
      order by table_schema, table_name;
    `;
    return NextResponse.json({
      envUsed: (process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL || "unset")
        .replace(/:\/\/.*?:.*?@/, "://***:***@"), // mask creds
      dbInfo: dbInfo.rows?.[0] ?? null,
      searchPath: searchPath.rows?.[0] ?? null,
      tables: tables.rows ?? [],
    });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
