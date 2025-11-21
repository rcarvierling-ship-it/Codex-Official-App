import 'server-only';
import { createClient } from '@vercel/postgres';

// Read connection string with fallback order
const connectionString = 
  process.env.POSTGRES_URL_NON_POOLING || 
  process.env.POSTGRES_URL || 
  process.env.DATABASE_URL;

export const hasDbEnv = Boolean(connectionString);

if (!hasDbEnv && process.env.NODE_ENV === 'production') {
  console.error(
    '[DB] Missing database connection string. ' +
    'Set POSTGRES_URL_NON_POOLING, POSTGRES_URL, or DATABASE_URL environment variable.'
  );
}

// Only instantiate a client if env vars exist to avoid build-time errors
const client = hasDbEnv ? createClient({ connectionString }) : null as any;
let connected: Promise<void> | null = null;
async function ensureConnected() {
  if (!client) return; // no-op when no env present
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
