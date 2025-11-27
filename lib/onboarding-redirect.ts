import { normalizeRole, type Role } from "@/lib/nav";

/**
 * Get the appropriate dashboard path based on user role
 * Maps roles to their specific dashboard pages
 */
export function getRoleDashboardPath(role: Role | string): string {
  const normalizedRole = normalizeRole(role);

  switch (normalizedRole) {
    case "league_admin":
      return "/dashboard/league";
    
    case "school_admin":
    case "athletic_director":
      return "/dashboard/school";
    
    case "coach":
      return "/dashboard/coach";
    
    case "official":
      return "/dashboard/official";
    
    case "fan":
      return "/dashboard/fan";
    
    default:
      // Fallback to general dashboard
      return "/dashboard";
  }
}
