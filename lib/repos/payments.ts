import 'server-only';
import { sql } from "@/lib/db";

export type PaymentStatus = "PENDING" | "APPROVED" | "PAID" | "CANCELLED";

export type Payment = {
  id: string;
  assignmentId: string;
  userId: string;
  eventId: string;
  amount: number;
  status: PaymentStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  paidAt?: string | null;
  notes?: string | null;
  createdAt: string;
};

export type PayoutSettings = {
  id: string;
  leagueId?: string | null;
  schoolId?: string | null;
  defaultAmount: number;
  roleBasedAmounts?: Record<string, number>;
  autoApprove: boolean;
  updatedAt: string;
};

export async function getPayments(
  userId?: string,
  status?: PaymentStatus,
  schoolIds?: string[]
): Promise<Payment[]> {
  try {
    let query = sql`
      SELECT 
        p.id,
        p.assignment_id,
        p.user_id,
        p.event_id,
        p.amount,
        p.status,
        p.approved_by,
        p.approved_at,
        p.paid_at,
        p.notes,
        p.created_at
      FROM payments p
      WHERE 1=1
    `;

    if (userId) {
      query = sql`${query} AND p.user_id = ${userId}`;
    }

    if (status) {
      query = sql`${query} AND p.status = ${status}`;
    }

    // Filter by school if schoolIds provided
    if (schoolIds && schoolIds.length > 0) {
      query = sql`${query} AND EXISTS (
        SELECT 1 FROM events e 
        WHERE e.id = p.event_id 
        AND e.school_id = ANY(${schoolIds})
      )`;
    }

    query = sql`${query} ORDER BY p.created_at DESC`;

    const { rows } = await sql<{
      id: string;
      assignment_id: string;
      user_id: string;
      event_id: string;
      amount: number;
      status: string;
      approved_by: string | null;
      approved_at: string | null;
      paid_at: string | null;
      notes: string | null;
      created_at: string | Date;
    }>`${query}`;

    return rows.map((r) => ({
      id: String(r.id),
      assignmentId: String(r.assignment_id),
      userId: String(r.user_id),
      eventId: String(r.event_id),
      amount: Number(r.amount),
      status: r.status as PaymentStatus,
      approvedBy: r.approved_by ? String(r.approved_by) : null,
      approvedAt: r.approved_at ? String(r.approved_at) : null,
      paidAt: r.paid_at ? String(r.paid_at) : null,
      notes: r.notes ? String(r.notes) : null,
      createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    }));
  } catch (error) {
    console.error("[payments] getPayments failed", error);
    return [];
  }
}

export async function createPaymentForAssignment(
  assignmentId: string,
  userId: string,
  eventId: string,
  amount: number
): Promise<string> {
  try {
    const { rows } = await sql<{ id: string }>`
      INSERT INTO payments (assignment_id, user_id, event_id, amount, status, created_at)
      VALUES (${assignmentId}, ${userId}, ${eventId}, ${amount}, 'PENDING', now())
      ON CONFLICT (assignment_id) DO NOTHING
      RETURNING id
    `;
    return rows[0]?.id as string;
  } catch (error) {
    console.error("[payments] createPaymentForAssignment failed", error);
    throw new Error("Failed to create payment");
  }
}

export async function approvePayment(
  paymentId: string,
  approvedBy: string,
  notes?: string
): Promise<void> {
  try {
    await sql`
      UPDATE payments
      SET status = 'APPROVED',
          approved_by = ${approvedBy},
          approved_at = now(),
          notes = COALESCE(${notes ?? null}, notes)
      WHERE id = ${paymentId}
    `;
  } catch (error) {
    console.error("[payments] approvePayment failed", error);
    throw new Error("Failed to approve payment");
  }
}

export async function markPaymentAsPaid(
  paymentId: string,
  notes?: string
): Promise<void> {
  try {
    await sql`
      UPDATE payments
      SET status = 'PAID',
          paid_at = now(),
          notes = COALESCE(${notes ?? null}, notes)
      WHERE id = ${paymentId}
    `;
  } catch (error) {
    console.error("[payments] markPaymentAsPaid failed", error);
    throw new Error("Failed to mark payment as paid");
  }
}

export async function getPayoutSettings(
  leagueId?: string | null,
  schoolId?: string | null
): Promise<PayoutSettings | null> {
  try {
    let query = sql`
      SELECT id, league_id, school_id, default_amount, role_based_amounts, auto_approve, updated_at
      FROM payout_settings
      WHERE 1=1
    `;

    if (leagueId) {
      query = sql`${query} AND league_id = ${leagueId}`;
    } else if (schoolId) {
      query = sql`${query} AND school_id = ${schoolId}`;
    } else {
      query = sql`${query} AND league_id IS NULL AND school_id IS NULL`;
    }

    query = sql`${query} ORDER BY updated_at DESC LIMIT 1`;

    const { rows } = await sql<{
      id: string;
      league_id: string | null;
      school_id: string | null;
      default_amount: number;
      role_based_amounts: any;
      auto_approve: boolean;
      updated_at: string | Date;
    }>`${query}`;

    if (rows.length === 0) return null;

    const r = rows[0];
    return {
      id: String(r.id),
      leagueId: r.league_id ? String(r.league_id) : null,
      schoolId: r.school_id ? String(r.school_id) : null,
      defaultAmount: Number(r.default_amount),
      roleBasedAmounts: r.role_based_amounts ? (typeof r.role_based_amounts === 'object' ? r.role_based_amounts : JSON.parse(String(r.role_based_amounts))) : undefined,
      autoApprove: Boolean(r.auto_approve),
      updatedAt: r.updated_at instanceof Date ? r.updated_at.toISOString() : String(r.updated_at),
    };
  } catch (error) {
    console.error("[payments] getPayoutSettings failed", error);
    return null;
  }
}

export async function updatePayoutSettings(
  leagueId: string | null,
  schoolId: string | null,
  defaultAmount: number,
  roleBasedAmounts?: Record<string, number>,
  autoApprove?: boolean
): Promise<string> {
  try {
    const { rows } = await sql<{ id: string }>`
      INSERT INTO payout_settings (league_id, school_id, default_amount, role_based_amounts, auto_approve, updated_at)
      VALUES (${leagueId}, ${schoolId}, ${defaultAmount}, ${JSON.stringify(roleBasedAmounts || {})}::jsonb, ${autoApprove ?? false}, now())
      ON CONFLICT (COALESCE(league_id::text, ''), COALESCE(school_id::text, ''))
      DO UPDATE SET
        default_amount = EXCLUDED.default_amount,
        role_based_amounts = EXCLUDED.role_based_amounts,
        auto_approve = EXCLUDED.auto_approve,
        updated_at = now()
      RETURNING id
    `;
    return rows[0]?.id as string;
  } catch (error) {
    console.error("[payments] updatePayoutSettings failed", error);
    throw new Error("Failed to update payout settings");
  }
}

