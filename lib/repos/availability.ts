import "server-only";
import { sql } from "@/lib/db";

export type AvailabilityBlock = {
  id: string;
  officialId: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * Get all availability blocks for an official
 */
export async function getAvailabilityBlocks(
  officialId: string,
  startDate?: Date,
  endDate?: Date
): Promise<AvailabilityBlock[]> {
  try {
    let query: any;
    
    if (startDate && endDate) {
      query = sql<{
        id: string;
        official_id: string;
        start_time: string | Date;
        end_time: string | Date;
        is_available: boolean;
        notes: string | null;
        created_at: string | Date;
        updated_at: string | Date;
      }>`
        SELECT id, official_id, start_time, end_time, is_available, notes, created_at, updated_at
        FROM availability_blocks
        WHERE official_id = ${officialId}
          AND (start_time <= ${endDate.toISOString()} AND end_time >= ${startDate.toISOString()})
        ORDER BY start_time ASC
      `;
    } else if (startDate) {
      query = sql<{
        id: string;
        official_id: string;
        start_time: string | Date;
        end_time: string | Date;
        is_available: boolean;
        notes: string | null;
        created_at: string | Date;
        updated_at: string | Date;
      }>`
        SELECT id, official_id, start_time, end_time, is_available, notes, created_at, updated_at
        FROM availability_blocks
        WHERE official_id = ${officialId}
          AND (end_time >= ${startDate.toISOString()})
        ORDER BY start_time ASC
      `;
    } else if (endDate) {
      query = sql<{
        id: string;
        official_id: string;
        start_time: string | Date;
        end_time: string | Date;
        is_available: boolean;
        notes: string | null;
        created_at: string | Date;
        updated_at: string | Date;
      }>`
        SELECT id, official_id, start_time, end_time, is_available, notes, created_at, updated_at
        FROM availability_blocks
        WHERE official_id = ${officialId}
          AND (start_time <= ${endDate.toISOString()})
        ORDER BY start_time ASC
      `;
    } else {
      query = sql<{
        id: string;
        official_id: string;
        start_time: string | Date;
        end_time: string | Date;
        is_available: boolean;
        notes: string | null;
        created_at: string | Date;
        updated_at: string | Date;
      }>`
        SELECT id, official_id, start_time, end_time, is_available, notes, created_at, updated_at
        FROM availability_blocks
        WHERE official_id = ${officialId}
        ORDER BY start_time ASC
      `;
    }

    const { rows } = await query;

    return rows.map((r: {
      id: string;
      official_id: string;
      start_time: string | Date;
      end_time: string | Date;
      is_available: boolean;
      notes: string | null;
      created_at: string | Date;
      updated_at: string | Date;
    }) => ({
      id: String(r.id),
      officialId: String(r.official_id),
      startTime:
        r.start_time instanceof Date ? r.start_time.toISOString() : String(r.start_time),
      endTime: r.end_time instanceof Date ? r.end_time.toISOString() : String(r.end_time),
      isAvailable: Boolean(r.is_available),
      notes: r.notes,
      createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
      updatedAt: r.updated_at instanceof Date ? r.updated_at.toISOString() : String(r.updated_at),
    }));
  } catch (error) {
    console.error("[availability] getAvailabilityBlocks failed", error);
    return [];
  }
}

/**
 * Create a new availability block
 */
export async function createAvailabilityBlock(
  officialId: string,
  startTime: Date,
  endTime: Date,
  isAvailable: boolean,
  notes?: string | null
): Promise<string> {
  try {
    const { rows } = await sql<{ id: string }>`
      INSERT INTO availability_blocks (
        official_id, start_time, end_time, is_available, notes, created_at, updated_at
      )
      VALUES (
        ${officialId}, ${startTime.toISOString()}, ${endTime.toISOString()}, ${isAvailable}, ${notes || null}, now(), now()
      )
      RETURNING id
    `;
    return rows[0]?.id as string;
  } catch (error) {
    console.error("[availability] createAvailabilityBlock failed", error);
    throw new Error("Failed to create availability block");
  }
}

/**
 * Update an availability block
 */
export async function updateAvailabilityBlock(
  blockId: string,
  startTime?: Date,
  endTime?: Date,
  isAvailable?: boolean,
  notes?: string | null
): Promise<void> {
  try {
    // Build update query dynamically
    if (startTime !== undefined && endTime !== undefined && isAvailable !== undefined) {
      await sql`
        UPDATE availability_blocks
        SET start_time = ${startTime.toISOString()},
            end_time = ${endTime.toISOString()},
            is_available = ${isAvailable},
            notes = ${notes || null},
            updated_at = now()
        WHERE id = ${blockId}
      `;
    } else if (startTime !== undefined && endTime !== undefined) {
      await sql`
        UPDATE availability_blocks
        SET start_time = ${startTime.toISOString()},
            end_time = ${endTime.toISOString()},
            notes = ${notes !== undefined ? notes : sql`notes`},
            updated_at = now()
        WHERE id = ${blockId}
      `;
    } else if (isAvailable !== undefined) {
      await sql`
        UPDATE availability_blocks
        SET is_available = ${isAvailable},
            notes = ${notes !== undefined ? notes : sql`notes`},
            updated_at = now()
        WHERE id = ${blockId}
      `;
    } else if (notes !== undefined) {
      await sql`
        UPDATE availability_blocks
        SET notes = ${notes},
            updated_at = now()
        WHERE id = ${blockId}
      `;
    } else {
      // Just update timestamp
      await sql`
        UPDATE availability_blocks
        SET updated_at = now()
        WHERE id = ${blockId}
      `;
    }
  } catch (error) {
    console.error("[availability] updateAvailabilityBlock failed", error);
    throw new Error("Failed to update availability block");
  }
}

/**
 * Delete an availability block
 */
export async function deleteAvailabilityBlock(blockId: string): Promise<void> {
  try {
    await sql`
      DELETE FROM availability_blocks
      WHERE id = ${blockId}
    `;
  } catch (error) {
    console.error("[availability] deleteAvailabilityBlock failed", error);
    throw new Error("Failed to delete availability block");
  }
}

/**
 * Check if an official is available for a specific time range
 */
export async function isOfficialAvailable(
  officialId: string,
  startTime: Date,
  endTime: Date
): Promise<boolean> {
  try {
    // Check for any unavailable blocks that overlap with the requested time
    const { rows } = await sql<{ count: number }>`
      SELECT COUNT(*) as count
      FROM availability_blocks
      WHERE official_id = ${officialId}
        AND is_available = FALSE
        AND (start_time <= ${endTime.toISOString()} AND end_time >= ${startTime.toISOString()})
    `;

    if (rows[0]?.count > 0) {
      return false; // Has unavailable blocks in this time range
    }

    // Check if there's at least one available block that covers this time
    const { rows: availableRows } = await sql<{ count: number }>`
      SELECT COUNT(*) as count
      FROM availability_blocks
      WHERE official_id = ${officialId}
        AND is_available = TRUE
        AND (start_time <= ${startTime.toISOString()} AND end_time >= ${endTime.toISOString()})
    `;

    return availableRows[0]?.count > 0;
  } catch (error) {
    console.error("[availability] isOfficialAvailable failed", error);
    return false; // Default to unavailable on error
  }
}

/**
 * Get all available officials for a specific time range
 */
export async function getAvailableOfficials(
  startTime: Date,
  endTime: Date,
  officialIds?: string[]
): Promise<string[]> {
  try {
    let query;
    if (officialIds && officialIds.length > 0) {
      query = sql<{ official_id: string }>`
        SELECT DISTINCT official_id
        FROM availability_blocks
        WHERE official_id = ANY(${officialIds})
          AND is_available = TRUE
          AND (start_time <= ${startTime.toISOString()} AND end_time >= ${endTime.toISOString()})
          AND official_id NOT IN (
            SELECT DISTINCT official_id
            FROM availability_blocks
            WHERE is_available = FALSE
              AND (start_time <= ${endTime.toISOString()} AND end_time >= ${startTime.toISOString()})
          )
      `;
    } else {
      query = sql<{ official_id: string }>`
        SELECT DISTINCT official_id
        FROM availability_blocks
        WHERE is_available = TRUE
          AND (start_time <= ${startTime.toISOString()} AND end_time >= ${endTime.toISOString()})
          AND official_id NOT IN (
            SELECT DISTINCT official_id
            FROM availability_blocks
            WHERE is_available = FALSE
              AND (start_time <= ${endTime.toISOString()} AND end_time >= ${startTime.toISOString()})
          )
      `;
    }

    const { rows } = await query;
    return rows.map((r) => String(r.official_id));
  } catch (error) {
    console.error("[availability] getAvailableOfficials failed", error);
    return [];
  }
}

