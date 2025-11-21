import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-helpers";
import { getUserSchool, listSchools } from "@/lib/repos/schools";
import { SchoolOnboardingForm } from "./SchoolOnboardingForm";

export const metadata = {
  title: "Choose Your School",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await requireAuth({ requireSchool: false });
  const email = (session.user as any)?.email;
  if (!email) {
    redirect("/(auth)/login");
  }

  const [membership, schools] = await Promise.all([
    getUserSchool(email),
    listSchools(),
  ]);

  if (membership?.schoolId) {
    redirect("/");
  }

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
