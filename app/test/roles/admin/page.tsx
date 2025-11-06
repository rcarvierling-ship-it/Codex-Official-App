import React from "react";
import { getUsers } from "@/lib/repos/users";
import { getEvents } from "@/lib/repos/events";
import { actionAdminCreateEvent, actionAdminCreateUser } from "../actions";
import { Table } from "@/components/test-ui/Table";
import { Section } from "@/components/test-ui/Section";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Test" };

export default async function AdminPage() {
  const [users, events] = await Promise.all([getUsers(), getEvents()]);
  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Admin Test</h1>

      <Section title={`Users (${users.length})`}>
        <Table
          header={["Name", "Email", "Role", "ID"]}
          rows={(users ?? []).map(u => [
            u.name,
            u.email,
            u.role ?? "—",
            <code key="i" className="text-xs">{u.id}</code>
          ])}
        />
        <form action={actionAdminCreateUser} className="grid gap-2 rounded border p-3 sm:grid-cols-4">
          <input name="name" placeholder="Name" className="rounded border p-2" required aria-label="User name" />
          <input name="email" type="email" placeholder="Email" className="rounded border p-2" required aria-label="User email" />
          <input name="role" placeholder="Role (optional)" className="rounded border p-2" aria-label="User role" />
          <button type="submit" className="col-span-full rounded bg-black px-4 py-2 text-white">Create User</button>
        </form>
      </Section>

      <Section title={`Events (${events.length})`}>
        <Table
          header={["Name", "School", "Starts", "ID"]}
          rows={(events ?? []).map(e => [
            e.name,
            e.schoolId ?? "—",
            fmtDate(e.startsAt),
            <code key="i" className="text-xs">{e.id}</code>
          ])}
        />
        <form action={actionAdminCreateEvent} className="grid gap-2 rounded border p-3 sm:grid-cols-4">
          <input name="name" placeholder="Event name" className="rounded border p-2" required aria-label="Event name" />
          <input name="schoolId" placeholder="School ID" className="rounded border p-2" required aria-label="School ID" />
          <input name="startsAt" type="datetime-local" className="rounded border p-2" aria-label="Start date and time" />
          <button type="submit" className="col-span-full rounded bg-black px-4 py-2 text-white">Create Event</button>
        </form>
      </Section>
    </div>
  );
}
