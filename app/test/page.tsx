import React from "react";
import { getEvents } from "@/lib/repos/events";
import { getRequests } from "@/lib/repos/requests";
import { getUsers } from "@/lib/repos/users";
import { getAssignments } from "@/lib/repos/assignments";
import {
  actionCreateAssignment,
  actionCreateEvent,
  actionCreateUser,
  actionUpdateAssignmentStatus,
  actionUpdateRequestStatus,
} from "./actions";
import { StatCard } from "@/components/test-ui/StatCard";
import { Table } from "@/components/test-ui/Table";
import { Section } from "@/components/test-ui/Section";
import { Badge } from "@/components/test-ui/Badge";
import { fmtDate } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata = { title: "Test Hub" };

export default async function TestPage() {
  const [events, requests, users, assignments] = await Promise.all([
    getEvents(), getRequests(), getUsers(), getAssignments()
  ]);

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-10">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Real App Test Hub</h1>
        <div className="text-sm text-muted-foreground">All data below is live from the real backend.</div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Events" value={events.length} />
        <StatCard label="Requests" value={requests.length} />
        <StatCard label="Users" value={users.length} />
        <StatCard label="Assignments" value={assignments.length} />
      </section>

      <Section title={`Users (${users.length})`}>
        <Table
          header={["Name", "Email", "Role", "ID"]}
          rows={(users ?? []).map(u => [
            u.name,
            <span key="e" className="truncate">{u.email}</span>,
            u.role ?? "—",
            <code key="i" className="text-xs">{u.id}</code>
          ])}
        />
        <form action={actionCreateUser} className="grid gap-2 rounded border p-3 sm:grid-cols-4">
          <input name="name" placeholder="Name" className="rounded border p-2" required aria-label="User name" />
          <input name="email" type="email" placeholder="Email" className="rounded border p-2" required aria-label="User email" />
          <input name="role" placeholder="Role (optional)" className="rounded border p-2" aria-label="User role" />
          <button type="submit" className="col-span-full rounded bg-black px-4 py-2 text-white">Create User</button>
        </form>
      </Section>

      <Section title={`Events (${events.length})`}>
        <Table
          header={["Name", "School", "Starts", "Ends", "ID"]}
          rows={(events ?? []).map(e => [
            e.name,
            e.schoolId ?? "—",
            fmtDate(e.startsAt),
            fmtDate(e.endsAt),
            <code key="i" className="text-xs">{e.id}</code>
          ])}
        />
        <form action={actionCreateEvent} className="grid gap-2 rounded border p-3 sm:grid-cols-4">
          <input name="name" placeholder="Event name" className="rounded border p-2" required aria-label="Event name" />
          <input name="schoolId" placeholder="School ID" className="rounded border p-2" required aria-label="School ID" />
          <input name="startsAt" type="datetime-local" className="rounded border p-2" aria-label="Start date and time" />
          <button type="submit" className="col-span-full rounded bg-black px-4 py-2 text-white">Create Event</button>
        </form>
      </Section>

      <Section title={`Requests (${requests.length})`}>
        <Table
          header={["User", "Event", "Status", "Submitted", "Message", "Actions"]}
          cols="1fr 1fr 0.8fr 1.2fr 1.5fr 1.5fr"
          rows={(requests ?? []).map(r => [
            r.userId,
            r.eventId,
            <Badge key="status" variant={r.status}>{r.status}</Badge>,
            fmtDate(r.submittedAt),
            <span key="msg" className="truncate">{r.message ?? "—"}</span>,
            <div key="actions" className="flex gap-1">
              {(["PENDING", "APPROVED", "DECLINED"] as const).map(s => (
                <form key={s} action={actionUpdateRequestStatus}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value={s} />
                  <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-muted" aria-label={`Set status to ${s}`}>{s}</button>
                </form>
              ))}
            </div>
          ])}
        />
      </Section>

      <Section title={`Assignments (${assignments.length})`}>
        <Table
          header={["Event", "User", "Role", "Status", "Created", "Actions"]}
          cols="1fr 1fr 0.8fr 1fr 1.2fr 1.5fr"
          rows={(assignments ?? []).map(a => [
            a.eventId,
            a.userId,
            a.role,
            <Badge key="status" variant={a.status}>{a.status}</Badge>,
            fmtDate(a.createdAt),
            <div key="actions" className="flex gap-1">
              {(["ASSIGNED", "COMPLETED", "CANCELLED"] as const).map(s => (
                <form key={s} action={actionUpdateAssignmentStatus}>
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="status" value={s} />
                  <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-muted" aria-label={`Set status to ${s}`}>{s}</button>
                </form>
              ))}
            </div>
          ])}
        />
        <form action={actionCreateAssignment} className="grid gap-2 rounded border p-3 sm:grid-cols-4">
          <input name="eventId" placeholder="Event ID" className="rounded border p-2" required aria-label="Event ID" />
          <input name="userId" placeholder="User ID" className="rounded border p-2" required aria-label="User ID" />
          <input name="role" placeholder="Role (e.g., OFFICIAL)" className="rounded border p-2" defaultValue="OFFICIAL" aria-label="Assignment role" />
          <button type="submit" className="col-span-full rounded bg-black px-4 py-2 text-white">Create Assignment</button>
        </form>
      </Section>
    </div>
  );
}
