import 'server-only';
import { sql } from "@/lib/db";
import { pick } from "@/lib/util/pick";

export type Message = {
  id: string;
  entityType: "EVENT" | "TEAM" | "SCHOOL";
  entityId: string;
  userId: string;
  content: string;
  createdAt: string;
};

export async function getMessages(
  entityType: "EVENT" | "TEAM" | "SCHOOL",
  entityId: string
): Promise<Message[]> {
  try {
    const { rows } = await sql`select * from messages 
      where entity_type = ${entityType} and entity_id = ${entityId}
      order by created_at asc
    `;

    return rows.map((r: any) => {
      const id = String(pick(r, ["id", "message_id", "uuid"], crypto.randomUUID()));
      const entityType = String(pick(r, ["entity_type", "entityType", "type"], "EVENT")) as "EVENT" | "TEAM" | "SCHOOL";
      const entityId = String(pick(r, ["entity_id", "entityId", "entity"], ""));
      const userId = String(pick(r, ["user_id", "userId", "user"], ""));
      const content = String(pick(r, ["content", "message", "text", "body"], ""));
      const createdAt = String(
        pick(
          r,
          ["created_at", "createdAt", "timestamp", "created"],
          new Date().toISOString()
        )
      );

      return { id, entityType, entityId, userId, content, createdAt };
    });
  } catch {
    return [];
  }
}

export async function createMessage(
  entityType: "EVENT" | "TEAM" | "SCHOOL",
  entityId: string,
  userId: string,
  content: string
): Promise<string> {
  try {
    const { rows } = await sql<{ id: string }>`
      insert into messages (entity_type, entity_id, user_id, content, created_at)
      values (${entityType}, ${entityId}, ${userId}, ${content}, now())
      returning id
    `;
    return rows[0]?.id as string;
  } catch (error) {
    console.error("[messages] createMessage failed", error);
    // Fallback if schema differs
    try {
      const { rows } = await sql<{ id: string }>`
        insert into messages (type, entity, "user", text, timestamp)
        values (${entityType}, ${entityId}, ${userId}, ${content}, now())
        returning id
      `;
      return rows[0]?.id as string;
    } catch {
      throw new Error("Failed to create message");
    }
  }
}

