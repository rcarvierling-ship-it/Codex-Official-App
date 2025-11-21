import React from "react";
import { getRequests } from "@/lib/repos/requests";
import { actionADApprove, actionADDecline, actionADCreateEvent } from "../actions";
import { Table } from "@/components/test-ui/Table";
import { Section } from "@/components/test-ui/Section";
import { Badge } from "@/components/test-ui/Badge";
import { fmtDate } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata = { title: "AD Test" };

export default async function ADPage() {
  const requests = await getRequests();
  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Athletic Director Test</h1>

      <Section title={`Incoming Requests (${requests.length})`}>
        <Table
          header={["User", "Event", "Status", "Submitted", "Message", "Actions"]}
          cols="1fr 1fr 0.8fr 1.2fr 1.5fr 1.5fr"
          rows={(requests ?? []).map(r => [
            r.userId,
            r.eventId,
            <Badge key="status" variant={r.status}>{r.status}</Badge>,
            fmtDate(r.submittedAt),
            <span key="msg" className="truncate">{r.message ?? "—"}</span>,
            <div key="actions" className="flex gap-2">
              <form action={actionADApprove}>
                <input type="hidden" name="id" value={r.id} />
                <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-muted" aria-label="Approve request">Approve</button>
              </form>
              <form action={actionADDecline}>
                <input type="hidden" name="id" value={r.id} />
                <button type="submit" className="rounded border px-2 py-1 text-xs hover:bg-muted" aria-label="Decline request">Decline</button>
              </form>
            </div>
          ])}
        />
      </Section>

      <Section title="Create Event">
        <form action={actionADCreateEvent} className="grid gap-2 rounded border p-3 sm:grid-cols-4">
          <input name="name" placeholder="Event name" className="rounded border p-2" required aria-label="Event name" />
          <input name="schoolId" placeholder="School ID" className="rounded border p-2" required aria-label="School ID" />
          <input name="startsAt" type="datetime-local" className="rounded border p-2" aria-label="Start date and time" />
          <button type="submit" className="col-span-full rounded bg-black px-4 py-2 text-white">Create Event</button>
        </form>
      </Section>
    </div>
  );
}
