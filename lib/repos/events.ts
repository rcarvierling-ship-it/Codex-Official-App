import 'server-only';
import { sql } from '@lib/db';
import { pick } from '@/lib/util/pick';

export type Event = {
  id: string;
  schoolId: string | null;
  name: string;
  startsAt: string;
  endsAt?: string | null;
};

export async function getEvents(): Promise<Event[]> {
  try {
    const { rows } = await sql<Record<string, unknown>>`select * from events order by 1 desc`;
    return rows.map((r) => ({
      id: String(pick(r, ['id', 'event_id', 'uuid'], crypto.randomUUID())),
      schoolId: pick<string | null>(r, ['school_id', 'schoolid', 'school', 'org_id'], null),
      name: String(pick(r, ['name', 'title', 'event_name', 'eventtitle', 'label'], 'Untitled Event')),
      startsAt: String(pick(r, ['starts_at', 'start_time', 'start'], new Date().toISOString())),
      endsAt: pick<string | null>(r, ['ends_at', 'end_time', 'end'], null),
    }));
  } catch {
    return [];
  }
}

export async function createEvent(name: string, schoolId: string, startsAt: string) {
  // Try several common schemas in order
  // 1) name, school_id, starts_at
  try {
    const { rows } = await sql<{ id: string }>`
      insert into events (name, school_id, starts_at)
      values (${name}, ${schoolId}, ${startsAt})
      returning id
    `;
    return rows[0]?.id as string;
  } catch {}

  // 2) name, org_id, starts_at
  try {
    const { rows } = await sql<{ id: string }>`
      insert into events (name, org_id, starts_at)
      values (${name}, ${schoolId}, ${startsAt})
      returning id
    `;
    return rows[0]?.id as string;
  } catch {}

  // 3) name, school_id, start_time
  try {
    const { rows } = await sql<{ id: string }>`
      insert into events (name, school_id, start_time)
      values (${name}, ${schoolId}, ${startsAt})
      returning id
    `;
    return rows[0]?.id as string;
  } catch {}

  // 4) title, school_id, start_time
  try {
    const { rows } = await sql<{ id: string }>`
      insert into events (title, school_id, start_time)
      values (${name}, ${schoolId}, ${startsAt})
      returning id
    `;
    return rows[0]?.id as string;
  } catch {}

  // 5) event_name, school_id, start_time
  try {
    const { rows } = await sql<{ id: string }>`
      insert into events (event_name, school_id, start_time)
      values (${name}, ${schoolId}, ${startsAt})
      returning id
    `;
    return rows[0]?.id as string;
  } catch (error) {
    // Final failure: surface a friendly error but don't crash callers upstream
    console.error("Failed to create event with tolerant insert attempts:", error);
    return undefined;
  }
}

