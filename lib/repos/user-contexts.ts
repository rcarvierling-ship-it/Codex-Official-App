import 'server-only';
import { sql } from "@/lib/db";

export type UserContext = {
  id: string;
  userId: string;
  schoolId: string | null;
  leagueId: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
};

export type UserContextWithDetails = UserContext & {
  school?: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
    mascotName?: string | null;
  } | null;
  league?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

/**
 * Get all contexts (school/role combinations) for a user
 */
export async function getUserContexts(userId: string): Promise<UserContextWithDetails[]> {
  try {
    const { rows } = await sql<{
      id: string;
      user_id: string;
      school_id: string | null;
      league_id: string | null;
      role: string;
      is_active: boolean;
      created_at: string | Date;
      school_name: string | null;
      school_slug: string | null;
      school_logo_url: string | null;
      school_mascot_name: string | null;
      league_name: string | null;
      league_slug: string | null;
    }>`
      SELECT 
        usr.id,
        usr.user_id,
        usr.school_id,
        usr.league_id,
        usr.role,
        usr.is_active,
        usr.created_at,
        s.name as school_name,
        s.slug as school_slug,
        s.logo_url as school_logo_url,
        s.mascot_name as school_mascot_name,
        l.name as league_name,
        l.slug as league_slug
      FROM user_school_roles usr
      LEFT JOIN schools s ON s.id = usr.school_id
      LEFT JOIN leagues l ON l.id = usr.league_id
      WHERE usr.user_id = ${userId}
      ORDER BY usr.is_active DESC, usr.created_at DESC
    `;

    return rows.map((r) => ({
      id: String(r.id),
      userId: String(r.user_id),
      schoolId: r.school_id ? String(r.school_id) : null,
      leagueId: r.league_id ? String(r.league_id) : null,
      role: String(r.role),
      isActive: Boolean(r.is_active),
      createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
      school: r.school_name ? {
        id: r.school_id!,
        name: r.school_name,
        slug: r.school_slug || '',
        logoUrl: r.school_logo_url || null,
        mascotName: r.school_mascot_name || null,
      } : null,
      league: r.league_name ? {
        id: r.league_id!,
        name: r.league_name,
        slug: r.league_slug || '',
      } : null,
    }));
  } catch (error) {
    console.error("[user-contexts] getUserContexts failed", error);
    return [];
  }
}

/**
 * Add a new context (school/role combination) for a user
 */
export async function addUserContext(
  userId: string,
  schoolId: string | null,
  leagueId: string | null,
  role: string
): Promise<string> {
  try {
    // Deactivate all other contexts for this user
    await sql`
      UPDATE user_school_roles
      SET is_active = false
      WHERE user_id = ${userId}
    `;

    // Check if this context already exists
    const { rows: existing } = await sql<{ id: string }>`
      SELECT id FROM user_school_roles
      WHERE user_id = ${userId}
        AND COALESCE(school_id::text, '') = COALESCE(${schoolId}::text, '')
        AND COALESCE(league_id::text, '') = COALESCE(${leagueId}::text, '')
        AND role = ${role}
      LIMIT 1
    `;

    if (existing.length > 0) {
      // Reactivate existing context
      await sql`
        UPDATE user_school_roles
        SET is_active = true
        WHERE id = ${existing[0].id}
      `;
      return existing[0].id;
    }

    // Create new context
    const { rows } = await sql<{ id: string }>`
      INSERT INTO user_school_roles (user_id, school_id, league_id, role, is_active, created_at)
      VALUES (${userId}, ${schoolId}, ${leagueId}, ${role}, true, now())
      RETURNING id
    `;
    return rows[0]?.id as string;
  } catch (error) {
    console.error("[user-contexts] addUserContext failed", error);
    throw new Error("Failed to add user context");
  }
}

/**
 * Switch to a different context (activate it and deactivate others)
 */
export async function switchUserContext(
  userId: string,
  contextId: string
): Promise<void> {
  try {
    // Deactivate all contexts
    await sql`
      UPDATE user_school_roles
      SET is_active = false
      WHERE user_id = ${userId}
    `;

    // Activate the selected context
    await sql`
      UPDATE user_school_roles
      SET is_active = true
      WHERE id = ${contextId} AND user_id = ${userId}
    `;
  } catch (error) {
    console.error("[user-contexts] switchUserContext failed", error);
    throw new Error("Failed to switch user context");
  }
}

/**
 * Get the active context for a user
 */
export async function getActiveUserContext(userId: string): Promise<UserContextWithDetails | null> {
  try {
    const contexts = await getUserContexts(userId);
    return contexts.find(c => c.isActive) || contexts[0] || null;
  } catch (error) {
    console.error("[user-contexts] getActiveUserContext failed", error);
    return null;
  }
}

