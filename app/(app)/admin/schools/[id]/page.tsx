import { requireRole } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSchoolById } from "@/lib/repos/schools";
import { notFound } from "next/navigation";
import { getUsers } from "@/lib/repos/users";
import { ChatThread } from "@/components/chat/ChatThread";
import { requireAuth } from "@/lib/auth-helpers";
import Link from "next/link";
import { Palette } from "lucide-react";

export const metadata = { title: "School Details" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SchoolDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { session } = await requireRole("league_admin");
  const { id } = params;

  const [school, users] = await Promise.all([
    getSchoolById(id),
    getUsers(),
  ]);

  if (!school) {
    notFound();
  }

  const userMap = new Map(users.map((u) => [u.id, { name: u.name, email: u.email }]));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{school.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {school.slug}
              </Badge>
              {school.leagueId && (
                <Badge variant="outline" className="text-xs">
                  League: {school.leagueId}
                </Badge>
              )}
              {school.mascotName && (
                <Badge variant="outline" className="text-xs">
                  {school.mascotName}
                </Badge>
              )}
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href={`/admin/schools/${id}/branding`}>
              <Palette className="mr-2 h-4 w-4" />
              Manage Branding
            </Link>
          </Button>
        </div>
        {school.logoUrl && (
          <div className="mt-4">
            <img
              src={school.logoUrl}
              alt={`${school.name} logo`}
              className="h-16 w-auto object-contain"
            />
          </div>
        )}
      </header>

      {/* School Chat Thread */}
      <ChatThread
        entityType="SCHOOL"
        entityId={id}
        currentUserId={(session.user as any)?.id || ""}
        users={userMap}
      />
    </div>
  );
}

