import React from "react";
import { getAssignments } from "@/lib/repos/assignments";
import { actionOfficialAccept, actionOfficialDecline, actionOfficialComplete } from "../actions";
import { Table } from "@/components/test-ui/Table";
import { Section } from "@/components/test-ui/Section";
import { Badge } from "@/components/test-ui/Badge";
import { fmtDate } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata = { title: "Official Test" };

export default async function OfficialPage() {
  const assignments = await getAssignments(); // In real app you'd filter by auth user
  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Official Test</h1>

      <Section title={`My Assignments (${assignments.length})`}>
        <Table
          header={["Event", "User", "Role", "Status", "Created", "Actions", "ID"]}
          cols="1fr 1fr 0.8fr 1fr 1.2fr 1.5fr 1fr"
          rows={(assignments ?? []).map(a => [
            a.eventId,
            a.userId,
            a.role,
            <Badge key="status" variant={a.status}>{a.status}</Badge>,
            fmtDate(a.createdAt),
            <div key="actions" className="flex gap-2">
              <form action={actionOfficialAccept}>
                <input type="hidden" name="id" value={a.id} />
                <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-muted" aria-label="Accept assignment">Accept</button>
              </form>
              <form action={actionOfficialDecline}>
                <input type="hidden" name="id" value={a.id} />
                <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-muted" aria-label="Decline assignment">Decline</button>
              </form>
              <form action={actionOfficialComplete}>
                <input type="hidden" name="id" value={a.id} />
                <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-muted" aria-label="Complete assignment">Complete</button>
              </form>
            </div>,
            <code key="i" className="text-xs">{a.id}</code>
          ])}
        />
      </Section>
    </div>
  );
}
