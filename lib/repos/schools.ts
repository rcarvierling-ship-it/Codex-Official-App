import "server-only";
import { randomUUID } from "crypto";
import { sql } from "@/lib/db";

export type School = {
  id: string;
  name: string;
  slug: string;
  leagueId?: string | null;
};

export type SchoolMembership = {
  schoolId: string;
  school: School | null;
};

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || `school-${randomUUID().slice(0, 8)}`;

function normalizeSchoolRow(row: Record<string, unknown>): School {
  return {
    id: String(row.id ?? row.school_id ?? randomUUID()),
    name: String(row.name ?? row.school_name ?? "Unnamed School"),
    slug: String(row.slug ?? row.school_slug ?? slugify(String(row.name ?? "school"))),
    leagueId: (row.league_id as string | null) ?? null,
  };
}

export async function listSchools(): Promise<School[]> {
  try {
    const { rows } = await sql<Record<string, unknown>>`
      select * from schools order by name asc
    `;
    return rows.map(normalizeSchoolRow);
  } catch (error) {
    console.warn("[schools] fallback to empty list", error);
    return [];
  }
}

export async function getSchoolById(id: string): Promise<School | null> {
  if (!id) return null;
  try {
    const { rows } = await sql<Record<string, unknown>>`
      select * from schools where id = ${id} limit 1
    `;
    if (rows.length === 0) return null;
    return normalizeSchoolRow(rows[0]);
  } catch (error) {
    console.warn("[schools] unable to fetch by id", error);
    return null;
  }
}

export async function createSchool(name: string, leagueId?: string | null): Promise<School | null> {
  const baseSlug = slugify(name);
  let attempt = 0;
  while (attempt < 5) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
    try {
      const { rows } = await sql<Record<string, unknown>>`
        insert into schools (id, name, slug, league_id)
        values (${randomUUID()}, ${name}, ${slug}, ${leagueId ?? null})
        returning *
      `;
      if (rows.length > 0) {
        return normalizeSchoolRow(rows[0]);
      }
      return null;
    } catch (error) {
      // On unique slug violations, try again with suffix; otherwise abort
      const message = (error as Error).message ?? "";
      if (!/duplicate|unique/i.test(message)) {
        console.error("[schools] failed to create school", error);
        return null;
      }
      attempt += 1;
    }
  }
  return null;
}

async function upsertUserProfile(email: string, schoolId: string) {
  try {
    await sql`
      insert into user_profiles (email, school_id, created_at, updated_at)
      values (${email}, ${schoolId}, now(), now())
      on conflict (email)
      do update set school_id = excluded.school_id, updated_at = now()
    `;
  } catch (error) {
    console.warn("[schools] failed to update user_profiles", error);
  }

  try {
    await sql`
      update users set active_school_id = ${schoolId} where email = ${email}
    `;
  } catch {
    try {
      await sql`
        insert into users (id, name, email, role, active_school_id, created_at)
        values (${randomUUID()}, ${email.split("@")[0] ?? email}, ${email}, 'USER', ${schoolId}, now())
        on conflict (email)
        do update set active_school_id = excluded.active_school_id
      `;
    } catch (error) {
      console.warn("[schools] unable to sync users.active_school_id", error);
    }
  }
}

export async function assignUserToSchool(email: string, schoolId: string): Promise<void> {
  if (!email || !schoolId) return;
  await upsertUserProfile(email, schoolId);
}

export async function getUserSchool(email: string): Promise<SchoolMembership | null> {
  if (!email) return null;

  const readSchoolId = async (): Promise<string | null> => {
    try {
      const { rows } = await sql<{ school_id: string | null }>`
        select school_id from user_profiles where email = ${email} limit 1
      `;
      if (rows[0]?.school_id) return rows[0].school_id;
    } catch (error) {
      console.warn("[schools] unable to read user_profiles", error);
    }

    try {
      const { rows } = await sql<{ active_school_id: string | null }>`
        select active_school_id from users where email = ${email} limit 1
      `;
      if (rows[0]?.active_school_id) return rows[0].active_school_id;
    } catch (error) {
      console.warn("[schools] unable to read users.active_school_id", error);
    }

    return null;
  };

  const schoolId = await readSchoolId();
  if (!schoolId) return null;

  return {
    schoolId,
    school: await getSchoolById(schoolId),
  };
}
