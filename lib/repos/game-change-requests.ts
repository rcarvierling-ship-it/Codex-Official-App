import "server-only";
import { sql } from "@/lib/db";

export type ChangeType = "TIME" | "LOCATION" | "OPPONENT" | "CANCELLATION" | "POSTPONEMENT";
export type ChangeRequestStatus = "PENDING" | "APPROVED" | "DENIED";

export type GameChangeRequest = {
  id: string;
  eventId: string;
  requestedBy: string;
  changeType: ChangeType;
  currentValue: string | null;
  requestedValue: string | null;
  reason: string | null;
  status: ChangeRequestStatus;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
};

export type GameChangeRequestWithDetails = GameChangeRequest & {
  event?: {
    id: string;
    name: string;
    startsAt: string;
    endsAt?: string | null;
    schoolId: string | null;
  } | null;
  requester?: {
    id: string;
    name: string;
    email: string;
  } | null;
  approver?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

/**
 * Get all change requests, optionally filtered by event, requester, or status
 */
export async function getGameChangeRequests(filters?: {
  eventId?: string;
  requestedBy?: string;
  status?: ChangeRequestStatus;
  schoolIds?: string[];
}): Promise<GameChangeRequestWithDetails[]> {
  try {
    // Build base query - always fetch all, then filter in memory for simplicity
    const { rows } = await sql<{
      id: string;
      event_id: string;
      requested_by: string;
      change_type: string;
      current_value: string | null;
      requested_value: string | null;
      reason: string | null;
      status: string;
      approved_by: string | null;
      approved_at: string | Date | null;
      created_at: string | Date;
      event_name: string | null;
      event_starts_at: string | Date | null;
      event_ends_at: string | Date | null;
      event_school_id: string | null;
      requester_name: string | null;
      requester_email: string | null;
      approver_name: string | null;
      approver_email: string | null;
    }>`
      SELECT 
        gcr.id,
        gcr.event_id,
        gcr.requested_by,
        gcr.change_type,
        gcr.current_value,
        gcr.requested_value,
        gcr.reason,
        gcr.status,
        gcr.approved_by,
        gcr.approved_at,
        gcr.created_at,
        e.name as event_name,
        e.start_ts as event_starts_at,
        e.end_ts as event_ends_at,
        e.school_id as event_school_id,
        u1.name as requester_name,
        u1.email as requester_email,
        u2.name as approver_name,
        u2.email as approver_email
      FROM game_change_requests gcr
      LEFT JOIN events e ON e.id = gcr.event_id
      LEFT JOIN users u1 ON u1.id = gcr.requested_by
      LEFT JOIN users u2 ON u2.id = gcr.approved_by
      ORDER BY gcr.created_at DESC
    `;

    // Apply filters in memory
    let filtered = rows;
    if (filters?.eventId) {
      filtered = filtered.filter((r) => String(r.event_id) === filters.eventId);
    }
    if (filters?.requestedBy) {
      filtered = filtered.filter((r) => String(r.requested_by) === filters.requestedBy);
    }
    if (filters?.status) {
      filtered = filtered.filter((r) => r.status === filters.status);
    }
    if (filters?.schoolIds && filters.schoolIds.length > 0) {
      filtered = filtered.filter((r) => 
        r.event_school_id && filters.schoolIds!.includes(String(r.event_school_id))
      );
    }

    return filtered.map((r) => ({
      id: String(r.id),
      eventId: String(r.event_id),
      requestedBy: String(r.requested_by),
      changeType: r.change_type as ChangeType,
      currentValue: r.current_value,
      requestedValue: r.requested_value,
      reason: r.reason,
      status: r.status as ChangeRequestStatus,
      approvedBy: r.approved_by ? String(r.approved_by) : null,
      approvedAt: r.approved_at
        ? r.approved_at instanceof Date
          ? r.approved_at.toISOString()
          : String(r.approved_at)
        : null,
      createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
      event: r.event_name
        ? {
            id: String(r.event_id),
            name: r.event_name,
            startsAt:
              r.event_starts_at instanceof Date
                ? r.event_starts_at.toISOString()
                : String(r.event_starts_at || ""),
            endsAt: r.event_ends_at
              ? r.event_ends_at instanceof Date
                ? r.event_ends_at.toISOString()
                : String(r.event_ends_at)
              : null,
            schoolId: r.event_school_id ? String(r.event_school_id) : null,
          }
        : null,
      requester: r.requester_name
        ? {
            id: String(r.requested_by),
            name: r.requester_name,
            email: r.requester_email || "",
          }
        : null,
      approver: r.approver_name
        ? {
            id: String(r.approved_by!),
            name: r.approver_name,
            email: r.approver_email || "",
          }
        : null,
    }));
  } catch (error) {
    console.error("[game-change-requests] getGameChangeRequests failed", error);
    return [];
  }
}

/**
 * Create a new game change request
 */
export async function createGameChangeRequest(
  eventId: string,
  requestedBy: string,
  changeType: ChangeType,
  currentValue: string | null,
  requestedValue: string | null,
  reason: string | null
): Promise<string> {
  try {
    const { rows } = await sql<{ id: string }>`
      INSERT INTO game_change_requests (
        event_id, requested_by, change_type, current_value, requested_value, reason, status, created_at
      )
      VALUES (
        ${eventId}, ${requestedBy}, ${changeType}, ${currentValue}, ${requestedValue}, ${reason}, 'PENDING', now()
      )
      RETURNING id
    `;
    return rows[0]?.id as string;
  } catch (error) {
    console.error("[game-change-requests] createGameChangeRequest failed", error);
    throw new Error("Failed to create game change request");
  }
}

/**
 * Update the status of a game change request
 */
export async function updateGameChangeRequestStatus(
  requestId: string,
  status: ChangeRequestStatus,
  approvedBy: string
): Promise<void> {
  try {
    await sql`
      UPDATE game_change_requests
      SET status = ${status},
          approved_by = ${approvedBy},
          approved_at = now()
      WHERE id = ${requestId}
    `;
  } catch (error) {
    console.error("[game-change-requests] updateGameChangeRequestStatus failed", error);
    throw new Error("Failed to update game change request status");
  }
}

