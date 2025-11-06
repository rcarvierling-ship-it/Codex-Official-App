import type { NavItem } from "./nav";

const DEMO_ROUTE_MAP: Record<string, string> = {
  "/admin": "/demo",
  "/admin/leagues": "/demo/leagues",
  "/admin/schools": "/demo/schools",
  "/admin/teams": "/demo/teams",
  "/admin/venues": "/demo/venues",
  "/events": "/demo/events",
  "/officials": "/demo/officials",
  "/requests": "/demo/requests",
  "/approvals": "/demo/approvals",
  "/assignments": "/demo/assignments",
  "/announcements": "/demo/announcements",
  "/admin/users": "/demo/users",
  "/admin/feature-flags": "/demo/feature-flags",
  "/admin/settings": "/demo/settings",
  "/analytics": "/demo/analytics",
  "/activity": "/demo/activity",
  "/api-explorer": "/demo/api-explorer",
  "/dev-tools": "/demo/dev-tools",
  "/teams": "/demo/teams",
  "/venues": "/demo/venues",
  "/profile": "/demo/profile",
};

export function mapNavItemsToDemo(items: NavItem[]): NavItem[] {
  return items
    .map((item) => {
      const href = DEMO_ROUTE_MAP[item.href];
      if (!href) return null;
      return { ...item, href };
    })
    .filter((item): item is NavItem => Boolean(item));
}

export function demoPathForPath(href: string): string | null {
  return DEMO_ROUTE_MAP[href] ?? null;
}
