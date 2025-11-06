import 'server-only';
import { hasDbEnv } from "@/lib/db";

let dbInstance: any = null;

async function getDb() {
  if (dbInstance) return dbInstance;
  
  if (hasDbEnv) {
    // Lazy import only when env is present to avoid build-time errors
    const { sql } = await import("@vercel/postgres");
    const { drizzle } = await import("drizzle-orm/vercel-postgres");
    const schema = await import("./schema");
    dbInstance = drizzle(sql, { schema });
  } else {
    // Minimal no-op shim to keep callers from crashing at build-time
    dbInstance = new Proxy(
      {},
      {
        get() {
          return () => Promise.resolve([]);
        },
      },
    );
  }
  
  return dbInstance;
}

// Export db as a proxy that lazily initializes
export const db = new Proxy({} as any, {
  get(_target, prop) {
    return async (...args: any[]) => {
      const db = await getDb();
      const method = (db as any)[prop];
      if (typeof method === 'function') {
        return method.apply(db, args);
      }
      return method;
    };
  },
});
