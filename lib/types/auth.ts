import type { Role } from "@/lib/nav";

/**
 * Extended session user type with all properties attached by auth-helpers
 */
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  schoolId?: string | null;
  school?: {
    id: string;
    name: string;
    logoUrl?: string | null;
    mascotName?: string | null;
    mascotImageUrl?: string | null;
    primaryColor?: string | null;
    secondaryColor?: string | null;
  } | null;
  leagueId?: string | null;
  league?: {
    id: string;
    name: string;
  } | null;
  accessibleSchools?: string[];
  accessibleLeagues?: string[];
  canSeeAll?: boolean;
  activeContextId?: string;
}

/**
 * Type guard to check if an object is a SessionUser
 */
export function isSessionUser(user: unknown): user is SessionUser {
  return (
    typeof user === "object" &&
    user !== null &&
    "id" in user &&
    "email" in user &&
    "role" in user
  );
}

