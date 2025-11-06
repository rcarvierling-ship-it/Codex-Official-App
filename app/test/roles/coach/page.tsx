import React from "react";
import { getRequests } from "@/lib/repos/requests";
import { actionCoachRequest } from "../actions";
import { Table } from "@/components/test-ui/Table";
import { Section } from "@/components/test-ui/Section";
import { Badge } from "@/components/test-ui/Badge";
import { fmtDate } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata = { title: "Coach Test" };

export default async function CoachPage() {
  const myRequests = await getRequests(); // In real app you'd filter by auth user
  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Coach Test</h1>

      <Section title="Submit New Request">
        <form action={actionCoachRequest} className="grid gap-2 rounded border p-3 sm:grid-cols-3">
          <input name="eventId" placeholder="Event ID" className="rounded border p-2" required aria-label="Event ID" />
          <input name="userId" placeholder="Your User ID" className="rounded border p-2" required aria-label="Your User ID" />
          <input name="message" placeholder="Message (optional)" className="rounded border p-2" aria-label="Request message" />
          <button type="submit" className="col-span-full rounded bg-black px-4 py-2 text-white">Submit Request</button>
        </form>
      </Section>

      <Section title={`Your Requests (${myRequests.length})`}>
        <Table
          header={["Event", "Status", "Submitted", "Message", "ID"]}
          cols="1fr 0.8fr 1.2fr 1.5fr 1fr"
          rows={(myRequests ?? []).map(r => [
            r.eventId,
            <Badge key="status" variant={r.status}>{r.status}</Badge>,
            fmtDate(r.submittedAt),
            <span key="msg" className="truncate">{r.message ?? "—"}</span>,
            <code key="i" className="text-xs">{r.id}</code>
          ])}
        />
      </Section>
    </div>
  );
}
