import { requireAuth } from "@/lib/auth-helpers";
import { getUsers } from "@/lib/repos/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { normalizeRole } from "@/lib/nav";
import type { SessionUser } from "@/lib/types/auth";

export const metadata = { title: "Profile" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await requireAuth();
  const email = session.user?.email;

  if (!email) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Unable to load profile.</p>
      </div>
    );
  }

  const users = await getUsers();
  const user = users.find((u) => u.email === email) ?? users[0];
  const sessionUser = session.user as SessionUser;
  const role = normalizeRole(sessionUser.role ?? user?.role ?? "fan");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:gap-6 px-4 py-8 sm:px-6 sm:py-12 md:py-16">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Profile
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </header>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            {user?.name ?? email.split("@")[0]}
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">{email}</p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm sm:text-base text-muted-foreground">
          <div>
            <p className="font-semibold text-foreground text-sm sm:text-base">
              Role
            </p>
            <Badge className="mt-1 bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))] text-xs sm:text-sm">
              {role}
            </Badge>
          </div>
          {user?.schoolIds && user.schoolIds.length > 0 && (
            <div>
              <p className="font-semibold text-foreground text-sm sm:text-base">
                Schools
              </p>
              <p className="text-sm sm:text-base">
                {user.schoolIds.length} school(s) associated
              </p>
            </div>
          )}
          <p className="text-xs sm:text-sm text-muted-foreground mt-4">
            Profile management features are coming soon. Contact your
            administrator to update your information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
