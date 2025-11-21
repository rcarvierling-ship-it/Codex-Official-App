import { requireRole } from "@/lib/auth-helpers";
import { getUsers } from "@/lib/repos/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const metadata = { title: "Users & Roles" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireRole("ADMIN");
  const users = await getUsers();

  const usersByRole = users.reduce((acc, user) => {
    const role = user.role ?? "USER";
    if (!acc[role]) acc[role] = [];
    acc[role].push(user);
    return acc;
  }, {} as Record<string, typeof users>);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Users & Roles</h1>
        <p className="text-sm text-muted-foreground">
          Manage user accounts and role assignments across your organization.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(usersByRole).map(([role, roleUsers]) => (
          <Card key={role} className="bg-card/80">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{role}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">{roleUsers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">users</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 ? (
        <Card className="bg-card/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No users found.
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border/60 text-sm">
                <thead className="bg-background/60 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Schools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {users.map((user) => (
                    <tr key={user.id} className="text-muted-foreground">
                      <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))]"
                        >
                          {user.role ?? "USER"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {user.schoolIds && user.schoolIds.length > 0
                          ? `${user.schoolIds.length} school(s)`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

