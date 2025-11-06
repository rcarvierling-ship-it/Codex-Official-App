import { createClient } from '@vercel/postgres';

export const hasDbEnv = Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING);

const client = createClient();
let connected: Promise<void> | null = null;
async function ensureConnected() {
  if (!connected) connected = client.connect();
  await connected;
}

// Export a tag function compatible with `const { rows } = await sql\`...\``
export async function sql<T = unknown>(strings: TemplateStringsArray, ...values: unknown[]): Promise<{ rows: T[] }> {
  if (!hasDbEnv) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[DB] Missing POSTGRES_URL* env, returning empty result.');
    }
    return { rows: [] as T[] };
  }
  await ensureConnected();
  // @ts-expect-error - client.sql accepts template literals with variadics
  return client.sql<T>(strings, ...values);
}

// Simple helper for callers that only need rows array
export async function query(strings: TemplateStringsArray, ...values: unknown[]): Promise<unknown[]> {
  const { rows } = await sql(strings, ...values);
  return rows as unknown[];
}
