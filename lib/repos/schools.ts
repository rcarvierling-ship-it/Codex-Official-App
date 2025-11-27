import "server-only";
import { randomUUID } from "crypto";
import { sql } from "@/lib/db";

export type School = {
  id: string;
  name: string;
  slug: string;
  leagueId?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  logoUrl?: string | null;
  mascotName?: string | null;
  mascotImageUrl?: string | null;
  themeJson?: Record<string, unknown> | null;
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
    primaryColor: (row.primary_color as string | null) ?? null,
    secondaryColor: (row.secondary_color as string | null) ?? null,
    logoUrl: (row.logo_url as string | null) ?? null,
    mascotName: (row.mascot_name as string | null) ?? null,
    mascotImageUrl: (row.mascot_image_url as string | null) ?? null,
    themeJson: (row.theme_json as Record<string, unknown> | null) ?? null,
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

/**
 * Get all school IDs and league IDs that a user has access to.
 * Returns null if user should see everything (SUPER_ADMIN/ADMIN).
 */
export async function getUserAccessibleSchoolsAndLeagues(
  email: string,
  role?: string | null
): Promise<{ schoolIds: string[]; leagueIds: string[] } | null> {
  // league_admin sees everything
  const normalizedRole = role ? role.toLowerCase() : "";
  if (normalizedRole === "league_admin") {
    return null;
  }

  if (!email) return { schoolIds: [], leagueIds: [] };

  try {
    // Get all schools the user is associated with
    const schoolIds: string[] = [];

    // From user_profiles
    try {
      const { rows } = await sql<{ school_id: string | null }>`
        select school_id from user_profiles where email = ${email} and school_id is not null
      `;
      rows.forEach((row) => {
        if (row.school_id) schoolIds.push(row.school_id);
      });
    } catch (error) {
      console.warn("[schools] unable to read user_profiles for all schools", error);
    }

    // From users.active_school_id
    try {
      const { rows } = await sql<{ active_school_id: string | null }>`
        select active_school_id from users where email = ${email} and active_school_id is not null
      `;
      rows.forEach((row) => {
        if (row.active_school_id && !schoolIds.includes(row.active_school_id)) {
          schoolIds.push(row.active_school_id);
        }
      });
    } catch (error) {
      console.warn("[schools] unable to read users.active_school_id", error);
    }

    // Get unique school IDs
    const uniqueSchoolIds = Array.from(new Set(schoolIds));

    if (uniqueSchoolIds.length === 0) {
      return { schoolIds: [], leagueIds: [] };
    }

    // Get league IDs from schools
    const leagueIds: string[] = [];
    if (uniqueSchoolIds.length > 0) {
      try {
        // Query each school individually to get league IDs (more compatible)
        for (const schoolId of uniqueSchoolIds) {
          const school = await getSchoolById(schoolId);
          if (school?.leagueId && !leagueIds.includes(school.leagueId)) {
            leagueIds.push(school.leagueId);
          }
        }
      } catch (error) {
        console.warn("[schools] unable to read league_ids from schools", error);
      }
    }

    return {
      schoolIds: uniqueSchoolIds,
      leagueIds: Array.from(new Set(leagueIds)),
    };
  } catch (error) {
    console.warn("[schools] getUserAccessibleSchoolsAndLeagues failed", error);
    return { schoolIds: [], leagueIds: [] };
  }
}

/**
 * Update school branding
 */
export async function updateSchoolBranding(
  schoolId: string,
  branding: {
    primaryColor?: string | null;
    secondaryColor?: string | null;
    logoUrl?: string | null;
    mascotName?: string | null;
    mascotImageUrl?: string | null;
    themeJson?: Record<string, unknown> | null;
  }
): Promise<void> {
  try {
    await sql`
      UPDATE schools
      SET primary_color = ${branding.primaryColor ?? null},
          secondary_color = ${branding.secondaryColor ?? null},
          logo_url = ${branding.logoUrl ?? null},
          mascot_name = ${branding.mascotName ?? null},
          mascot_image_url = ${branding.mascotImageUrl ?? null},
          theme_json = ${branding.themeJson ? JSON.stringify(branding.themeJson) : null},
          updated_at = now()
      WHERE id = ${schoolId}
    `;
  } catch (error) {
    console.error("[schools] updateSchoolBranding failed", error);
    throw new Error("Failed to update school branding");
  }
}
