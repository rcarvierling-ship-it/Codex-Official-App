import { redirect } from "next/navigation";
import { getSessionServer } from "@/lib/auth";
import { getAuthRole } from "@/lib/auth-helpers";
import { Sidebar } from "@/components/Sidebar";
import { AppHeader } from "@/components/app/AppHeader";
import { SessionProviderWrapper } from "@/components/app/SessionProviderWrapper";
import { SchoolThemeProvider } from "@/components/branding/SchoolThemeProvider";
import { getSchoolById } from "@/lib/repos/schools";
import { SplashProvider, type SchoolBranding } from "@/components/splash/SplashProvider";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionServer();
  
  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  const role = await getAuthRole();
  const user = session.user as any;
  const schoolId = user?.schoolId;
  const leagueId = user?.leagueId;

  // Get school branding if user has a school
  let schoolBranding: SchoolBranding = null;
  if (schoolId) {
    try {
      const school = await getSchoolById(schoolId);
      if (school) {
        schoolBranding = {
          primaryColor: school.primaryColor,
          secondaryColor: school.secondaryColor,
          logoUrl: school.logoUrl,
          mascotName: school.mascotName,
          mascotImageUrl: school.mascotImageUrl,
          name: school.name,
        };
      }
    } catch (error) {
      console.error("Failed to fetch school branding:", error);
    }
  }

  // Get league branding if user has a league (for admin roles)
  let leagueBranding = null;
  if (leagueId && (role === "league_admin" || role === "school_admin")) {
    try {
      const { sql } = await import("@/lib/db");
      const { rows } = await sql<{ name: string; logo_url: string | null }>`
        SELECT name, logo_url
        FROM leagues
        WHERE id = ${leagueId}
        LIMIT 1
      `;
      if (rows.length > 0) {
        leagueBranding = {
          logoUrl: rows[0].logo_url || null,
          name: rows[0].name,
        };
      }
    } catch (error) {
      console.error("Failed to fetch league branding:", error);
    }
  }

  return (
    <SessionProviderWrapper session={session}>
      <SplashProvider
        role={role}
        schoolBranding={schoolBranding}
        leagueBranding={leagueBranding}
      >
        <SchoolThemeProvider branding={schoolBranding}>
          <div className="flex min-h-screen flex-col bg-background">
            <AppHeader />
            <div className="flex flex-1 flex-col lg:flex-row">
              <Sidebar role={role} variant="app" title="Navigation" />
              <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
            </div>
          </div>
        </SchoolThemeProvider>
      </SplashProvider>
    </SessionProviderWrapper>
  );
}
