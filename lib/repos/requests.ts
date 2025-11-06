import { sql } from "@/lib/db";
import { pick } from "@/lib/util/pick";

export type RequestStatus = "PENDING" | "APPROVED" | "DECLINED";
export type Request = {
  id: string;
  eventId: string;
  userId: string;
  status: RequestStatus;
  submittedAt: string;
  message?: string | null;
};

export async function getRequests(): Promise<Request[]> {
  try {
    // Select * to adapt to varying schemas
    const { rows } = await sql`select * from requests order by 1 desc`;

    return rows.map((r: any) => {
      const id = String(pick(r, ["id", "request_id", "uuid"], crypto.randomUUID()));
      const eventId = String(pick(r, ["event_id", "eventId", "event"], ""));
      const userId = String(pick(r, ["user_id", "userId", "user"], ""));
      const status = String(
        pick(r, ["status", "state"], "PENDING")
      ).toUpperCase() as RequestStatus;

      const submittedAt = String(
        pick(
          r,
          // common variants people use
          ["submitted_at", "created_at", "inserted_at", "submittedAt", "createdAt", "timestamp", "created"],
          new Date().toISOString()
        )
      );

      const message = pick<string | null>(r, ["message", "notes", "comment"], null);

      // Normalize status to union
      const s = status === "APPROVED" || status === "DECLINED" ? status : "PENDING";

      return { id, eventId, userId, status: s, submittedAt, message };
    });
  } catch {
    return [];
  }
}

export async function createRequest(eventId: string, userId: string, message?: string | null) {
  // Try canonical columns first
  try {
    const { rows } = await sql<{ id: string }>`
      insert into requests (event_id, user_id, status, submitted_at, message)
      values (${eventId}, ${userId}, 'PENDING', now(), ${message ?? null})
      returning id
    `;
    return rows[0]?.id as string;
  } catch {
    // Fallback if schema differs (state/created_at/etc.)
    const { rows } = await sql<{ id: string }>`
      insert into requests (event, "user", state, created_at, notes)
      values (${eventId}, ${userId}, 'PENDING', now(), ${message ?? null})
      returning id
    `;
    return rows[0]?.id as string;
  }
}

export async function updateRequestStatus(id: string, next: RequestStatus) {
  // Try primary column name, then fallback to 'state'
  try {
    await sql`update requests set status=${next} where id=${id}`;
  } catch {
    await sql`update requests set state=${next} where id=${id}`;
  }
}
