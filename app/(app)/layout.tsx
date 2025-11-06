import { redirect } from "next/navigation";
import { getSessionServer } from "@/lib/auth";
import { getAuthRole } from "@/lib/auth-helpers";
import { Sidebar } from "@/components/Sidebar";
import { AppHeader } from "@/components/app/AppHeader";
import { SessionProviderWrapper } from "@/components/app/SessionProviderWrapper";

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

  return (
    <SessionProviderWrapper session={session}>
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <div className="flex flex-1 flex-col lg:flex-row">
          <Sidebar role={role} variant="app" title="Navigation" />
          <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SessionProviderWrapper>
  );
}

