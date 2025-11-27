import { redirect } from "next/navigation";
import { requireAuth, getAuthRole } from "@/lib/auth-helpers";
import { getUserSchool, listSchools } from "@/lib/repos/schools";
import { SchoolOnboardingForm } from "./SchoolOnboardingForm";
import type { SessionUser } from "@/lib/types/auth";

export const metadata = {
  title: "Choose Your School",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getRoleDashboardPath } from "@/lib/onboarding-redirect";

// Get the appropriate redirect path based on role
function getRedirectPath(role: string): string {
  return getRoleDashboardPath(role);
}

export default async function OnboardingPage() {
  const session = await requireAuth({ requireSchool: false });
  const user = session.user as SessionUser;
  const email = user.email;
  const userId = user.id;
  if (!email) {
    redirect("/login");
  }

  // Check if user has completed onboarding
  const { hasCompletedOnboarding, getUserRole } = await import("@/lib/onboarding-helpers");
  const completed = await hasCompletedOnboarding(userId, email);
  
  if (completed) {
    // User has completed onboarding, redirect to their role dashboard
    const sessionRole = user.role;
    const userRole = await getUserRole(userId, sessionRole);
    const redirectPath = getRedirectPath(userRole);
    redirect(redirectPath);
  }

  // If onboarding not completed, fetch schools list for the form
  const schools = await listSchools();

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-16">
      <div className="space-y-3 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Welcome! Choose your school to continue
        </h1>
        <p className="text-sm text-muted-foreground">
          Pick an existing school from your organization or create a new one to scope your dashboard.
        </p>
      </div>

      <SchoolOnboardingForm schools={schools} />
    </div>
  );
}
