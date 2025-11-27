import { getAssignments } from "@/lib/repos/assignments";
import { getEvents } from "@/lib/repos/events";
import { getUsers } from "@/lib/repos/users";
import { getRequests } from "@/lib/repos/requests";
import { getAvailabilityBlocks, isOfficialAvailable } from "@/lib/repos/availability";
import { getAuthRole, requireAuth } from "@/lib/auth-helpers";
import { OfficialDashboardClient } from "./OfficialDashboardClient";
import type { SessionUser } from "@/lib/types/auth";

export const metadata = { title: "Official Dashboard" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AssignmentsPage() {
  const session = await requireAuth();
  const role = await getAuthRole();
  const user = session.user as SessionUser;
  const currentUserId = user.id;
  const canSeeAll = user.canSeeAll ?? false;
  const accessibleSchools = user.accessibleSchools ?? [];
  const accessibleLeagues = user.accessibleLeagues ?? [];

  const filterBy = canSeeAll
    ? null
    : { schoolIds: accessibleSchools, leagueIds: accessibleLeagues };

  const [assignments, events, users, requests] = await Promise.all([
    getAssignments(),
    getEvents(filterBy),
    getUsers(),
    getRequests(),
  ]);

  const eventMap = new Map(events.map((e) => [e.id, e]));
  const userMap = new Map(users.map((u) => [u.id, u]));

  // For officials, show their personal dashboard
  if (role === "official" && currentUserId) {
    // Get official's assignments
    const myAssignments = assignments
      .filter((a) => a.userId === currentUserId)
      .map((a) => ({
        ...a,
        event: eventMap.get(a.eventId),
      }))
      .sort((a, b) => {
        const aTime = a.event?.startsAt ? new Date(a.event.startsAt).getTime() : 0;
        const bTime = b.event?.startsAt ? new Date(b.event.startsAt).getTime() : 0;
        return aTime - bTime;
      });

    // Get official's requests
    const myRequests = requests
      .filter((r) => r.userId === currentUserId)
      .map((r) => ({
        ...r,
        event: eventMap.get(r.eventId),
      }))
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    // Get available events (upcoming events the official hasn't requested or been assigned to)
    const now = new Date();
    const myRequestedEventIds = new Set(myRequests.map((r) => r.eventId));
    const myAssignedEventIds = new Set(myAssignments.map((a) => a.eventId));
    
    // Get official's availability blocks for auto-matching
    const availabilityBlocks = await getAvailabilityBlocks(currentUserId);
    
    // Filter events and check availability
    const candidateEvents = events
      .filter((e) => new Date(e.startsAt) >= now)
      .filter((e) => !myRequestedEventIds.has(e.id) && !myAssignedEventIds.has(e.id))
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

    // Check availability for each event and mark them
    const eventsWithAvailability = await Promise.all(
      candidateEvents.slice(0, 20).map(async (event) => {
        const eventStart = new Date(event.startsAt);
        const eventEnd = new Date(event.endsAt || event.startsAt);
        // Add 1 hour buffer if no end time
        if (!event.endsAt) {
          eventEnd.setHours(eventEnd.getHours() + 1);
        }
        
        const matchesAvailability = await isOfficialAvailable(
          currentUserId,
          eventStart,
          eventEnd
        );
        
        return {
          ...event,
          matchesAvailability,
        };
      })
    );

    // Sort: events matching availability first, then by date
    eventsWithAvailability.sort((a, b) => {
      if (a.matchesAvailability && !b.matchesAvailability) return -1;
      if (!a.matchesAvailability && b.matchesAvailability) return 1;
      return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
    });

    const availableEvents = eventsWithAvailability.slice(0, 12); // Show up to 12 events

    return (
      <OfficialDashboardClient
        data={{
          myAssignments,
          myRequests,
          availableEvents,
          stats: {
            totalAssignments: myAssignments.length,
            pendingRequests: myRequests.filter((r) => r.status === "PENDING").length,
            approvedRequests: myRequests.filter((r) => r.status === "APPROVED").length,
            availableEvents: availableEvents.length,
          },
          currentUserId,
        }}
      />
    );
  }

  // For other roles, show the standard assignments table
  const scopedAssignments = assignments.filter((assignment) =>
    eventMap.has(assignment.eventId)
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Assignments</h1>
        <p className="text-sm text-muted-foreground">
          View confirmed assignments for upcoming events.
        </p>
      </header>

      {scopedAssignments.length === 0 ? (
        <div className="bg-card/80 rounded-2xl border border-border p-10 text-center text-sm text-muted-foreground">
            No assignments found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card/80">
          <table className="min-w-full divide-y divide-border/60 text-sm">
            <thead className="bg-background/60 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Official</th>
                <th className="px-4 py-3 text-left">Event</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Confirmed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {scopedAssignments.map((assignment) => {
                const user = userMap.get(assignment.userId);
                const event = eventMap.get(assignment.eventId);
                return (
                  <tr key={assignment.id} className="text-muted-foreground">
                    <td className="px-4 py-3 text-foreground">{user?.name ?? "Unknown"}</td>
                    <td className="px-4 py-3">
                      {event ? (
                        <a
                          href={`/events/${event.id}`}
                          className="text-[hsl(var(--accent))] hover:underline"
                        >
                          {event.name}
                        </a>
                      ) : (
                        <span>Event {assignment.eventId.slice(0, 8)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{assignment.role}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-xs rounded ${
                          assignment.status === "ASSIGNED"
                            ? "bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))]"
                            : assignment.status === "COMPLETED"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : assignment.status === "CANCELLED"
                            ? "bg-red-500/20 text-red-300"
                            : ""
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {new Date(assignment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
