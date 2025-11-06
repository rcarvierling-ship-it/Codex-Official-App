import { hasDbEnv } from "@/lib/db";

let db: any;

if (hasDbEnv) {
  // Lazy import only when env is present to avoid build-time errors
  const { sql } = await import("@vercel/postgres");
  const { drizzle } = await import("drizzle-orm/vercel-postgres");
  const schema = await import("./schema");
  db = drizzle(sql, { schema });
} else {
  // Minimal no-op shim to keep callers from crashing at build-time
  db = new Proxy(
    {},
    {
      get() {
        return () => Promise.resolve([]);
      },
    },
  );
}

export { db };
