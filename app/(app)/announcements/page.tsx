import { requireAuth } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { sql } from "@/lib/db";

export const metadata = { title: "Announcements" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getAnnouncements() {
  try {
    const { rows } = await sql`select * from announcements order by created_at desc limit 50`;
    return rows.map((r: any) => ({
      id: String(r.id ?? r.announcement_id ?? crypto.randomUUID()),
      title: String(r.title ?? r.subject ?? "Untitled Announcement"),
      message: String(r.message ?? r.content ?? r.body ?? ""),
      createdAt: String(r.created_at ?? r.created ?? r.timestamp ?? new Date().toISOString()),
      priority: r.priority ?? "normal",
      authorId: r.author_id ?? r.author ?? null,
      leagueId: r.league_id ?? r.league ?? null,
    }));
  } catch {
    return [];
  }
}

export default async function AnnouncementsPage() {
  const session = await requireAuth();
  const activeLeagueId = (session.user as any)?.school?.leagueId ?? null;
  const announcements = await getAnnouncements();
  const scopedAnnouncements =
    activeLeagueId ?
      announcements.filter((announcement) => announcement.leagueId === activeLeagueId) :
      announcements;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Announcements</h1>
        <p className="text-sm text-muted-foreground">
          View important announcements and updates from administrators.
        </p>
      </header>

      {scopedAnnouncements.length === 0 ? (
        <Card className="bg-card/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No announcements yet. Check back later for updates.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {scopedAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="bg-card/80">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                  {announcement.priority === "high" && (
                    <Badge className="bg-red-500/20 text-red-300">High Priority</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(announcement.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </CardHeader>
              {announcement.message && (
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {announcement.message}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
