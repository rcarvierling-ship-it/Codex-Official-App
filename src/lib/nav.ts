export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "AD"
  | "COACH"
  | "OFFICIAL"
  | "USER";

export type NavItem = {
  label: string;
  href: string;
};

export const DEFAULT_ROLE: Role = "USER";

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
};

const ROLE_NAV_PATHS: Record<Role, string[]> = {
  SUPER_ADMIN: [
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
    "/admin/users",
    "/admin/feature-flags",
    "/admin/settings",
    "/analytics",
    "/activity",
    "/api-explorer",
    "/dev-tools",
    "/test",
  ],
  ADMIN: [
    "/admin",
    "/events",
    "/teams",
    "/venues",
    "/requests",
    "/approvals",
    "/assignments",
    "/officials",
    "/announcements",
    "/admin/users",
    "/admin/settings",
    "/analytics",
    "/activity",
  ],
  AD: [
    "/admin",
    "/events",
    "/requests",
    "/approvals",
    "/assignments",
    "/teams",
    "/announcements",
  ],
  COACH: [
    "/admin",
    "/events",
    "/requests",
    "/teams",
  ],
  OFFICIAL: [
    "/admin",
    "/events",
    "/requests",
    "/assignments",
    "/profile",
  ],
  USER: [
    "/admin",
    "/events",
    "/announcements",
  ],
};

export const KNOWN_ROLES: Role[] = Object.keys(ROLE_NAV_PATHS) as Role[];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (KNOWN_ROLES as string[]).includes(value);
}

export function normalizeRole(value: unknown): Role {
  if (isRole(value)) return value;
  if (value === "STAFF") return "USER";
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
