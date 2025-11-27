export type Role =
  | "league_admin"
  | "school_admin"
  | "athletic_director"
  | "coach"
  | "official"
  | "fan";

export type NavItem = {
  label: string;
  href: string;
};

export const DEFAULT_ROLE: Role = "fan";

const PATH_LABELS: Record<string, string> = {
  "/admin": "Overview",
  "/admin/leagues": "Leagues",
  "/admin/schools": "Schools",
  "/admin/teams": "Teams",
  "/admin/venues": "Venues",
  "/events": "Events",
  "/officials": "Officials",
  "/requests": "Requests",
  "/approvals": "Approvals",
  "/assignments": "Assignments",
  "/announcements": "Announcements",
  "/admin/users": "Users & Roles",
  "/admin/feature-flags": "Feature Flags",
  "/admin/settings": "Settings",
  "/analytics": "Analytics",
  "/activity": "Activity",
  "/api-explorer": "API Explorer",
  "/dev-tools": "Dev Tools",
  "/test": "Test Hub",
  "/teams": "Teams",
  "/venues": "Venues",
  "/profile": "Profile",
  "/payments": "Payments",
  "/dashboard/league": "League Dashboard",
  "/dashboard/school": "School Dashboard",
  "/dashboard/coach": "Coach Dashboard",
  "/dashboard/official": "Official Dashboard",
  "/dashboard/fan": "Fan Dashboard",
  "/standings": "Standings",
  "/browser": "Browse",
};

const ROLE_NAV_PATHS: Record<Role, string[]> = {
  league_admin: [
    "/dashboard/league",
    "/admin",
    "/admin/leagues",
    "/admin/schools",
    "/admin/teams",
    "/admin/venues",
    "/events",
    "/officials",
    "/requests",
    "/approvals",
    "/assignments",
    "/announcements",
    "/payments",
    "/admin/users",
    "/admin/feature-flags",
    "/admin/settings",
    "/analytics",
    "/activity",
    "/api-explorer",
    "/dev-tools",
    "/test",
  ],
  school_admin: [
    "/dashboard/school",
    "/admin",
    "/events",
    "/teams",
    "/venues",
    "/requests",
    "/approvals",
    "/assignments",
    "/officials",
    "/announcements",
    "/payments",
    "/admin/users",
    "/admin/settings",
    "/analytics",
    "/activity",
  ],
  athletic_director: [
    "/dashboard/school",
    "/admin",
    "/events",
    "/requests",
    "/approvals",
    "/assignments",
    "/teams",
    "/announcements",
    "/payments",
  ],
  coach: [
    "/dashboard/coach",
    "/admin",
    "/events",
    "/requests",
    "/teams",
  ],
  official: [
    "/dashboard/official",
    "/admin",
    "/events",
    "/requests",
    "/assignments",
    "/payments",
    "/profile",
  ],
  fan: [
    "/dashboard/fan",
    "/events",
    "/announcements",
    "/standings",
    "/browser",
  ],
};

export const KNOWN_ROLES: Role[] = Object.keys(ROLE_NAV_PATHS) as Role[];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (KNOWN_ROLES as string[]).includes(value);
}

export function normalizeRole(value: unknown): Role {
  if (isRole(value)) return value;
  
  // Map legacy roles to canonical roles
  const str = String(value).toLowerCase();
  
  if (str === "super_admin" || str === "admin" || str === "organization_admin") {
    return "league_admin";
  }
  if (str === "ad" || str === "athletic_director") {
    return "athletic_director";
  }
  if (str === "user" || str === "parent" || str === "staff") {
    return "fan";
  }
  if (str === "coach") {
    return "coach";
  }
  if (str === "official") {
    return "official";
  }
  if (str === "school_admin") {
    return "school_admin";
  }
  
  return DEFAULT_ROLE;
}

export function getNavForRole(role: Role): NavItem[] {
  const paths = ROLE_NAV_PATHS[role] ?? ROLE_NAV_PATHS[DEFAULT_ROLE];
  return paths.map((href) => ({
    href,
    label: PATH_LABELS[href] ?? href.replace("/", "").replace(/-/g, " "),
  }));
}

export function getAllNavPaths(): string[] {
  const set = new Set<string>();
  KNOWN_ROLES.forEach((role) => {
    ROLE_NAV_PATHS[role].forEach((path) => set.add(path));
  });
  return Array.from(set);
}
