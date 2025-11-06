import 'server-only';
import { sql } from "@/lib/db";
import { pick } from "@/lib/util/pick";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  schoolIds?: string[];
};

export async function getUsers(): Promise<AppUser[]> {
  try {
    const { rows } = await sql`select * from users order by 1 desc`;
    return rows.map((r: any) => ({
      id: String(pick(r, ["id", "user_id", "uuid"], crypto.randomUUID())),
      name: String(pick(r, ["name", "full_name", "display_name"], "Unknown User")),
      email: String(pick(r, ["email", "mail"], "unknown@example.com")),
      role: pick<string | null>(r, ["role", "user_role", "type"], null),
      schoolIds: Array.isArray(r.school_ids) ? r.school_ids : [],
    }));
  } catch {
    return [];
  }
}

export async function createUser(name: string, email: string, role?: string | null) {
  try {
    const { rows } = await sql<{ id: string }>`
      insert into users (name, email, role) values (${name}, ${email}, ${role ?? null}) returning id
    `;
    return rows[0]?.id as string;
  } catch {
    const { rows } = await sql<{ id: string }>`
      insert into users (full_name, email, user_role) values (${name}, ${email}, ${role ?? null}) returning id
    `;
    return rows[0]?.id as string;
  }
}

