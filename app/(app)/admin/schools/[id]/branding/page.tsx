import { requireAuth, getAuthRole } from "@/lib/auth-helpers";
import { getSchoolById } from "@/lib/repos/schools";
import { notFound } from "next/navigation";
import { BrandingManager } from "@/components/branding/BrandingManager";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "School Branding" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SchoolBrandingPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();
  const role = await getAuthRole();
  const user = session.user as any;
  const { id } = params;

  // Only athletic_director, school_admin, or league_admin can access
  if (role !== "athletic_director" && role !== "school_admin" && role !== "league_admin") {
    notFound();
  }

  // Check if user has access to this school (unless league_admin)
  if (role !== "league_admin") {
    const accessibleSchools = user?.accessibleSchools ?? [];
    if (!accessibleSchools.includes(id)) {
      notFound();
    }
  }

  const school = await getSchoolById(id);
  if (!school) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">School Branding</h1>
        <p className="text-sm text-muted-foreground">
          Customize your school's colors, logo, and mascot to personalize the dashboard experience.
        </p>
      </header>

      <BrandingManager
        schoolId={school.id}
        schoolName={school.name}
        initialBranding={{
          primaryColor: school.primaryColor,
          secondaryColor: school.secondaryColor,
          logoUrl: school.logoUrl,
          mascotName: school.mascotName,
          mascotImageUrl: school.mascotImageUrl,
          themeJson: school.themeJson,
        }}
      />
    </div>
  );
}

