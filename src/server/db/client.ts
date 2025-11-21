import 'server-only';
import { hasDbEnv } from "@/lib/db";

let dbInstance: any = null;

async function getDb() {
  if (dbInstance) return dbInstance;
  
  if (hasDbEnv) {
    // Get connection string
    const connectionString = 
      process.env.POSTGRES_URL_NON_POOLING || 
      process.env.POSTGRES_URL || 
      process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error("Database connection string not found");
    }

    // Use Neon serverless driver with drizzle-orm
    const { drizzle } = await import("drizzle-orm/neon-serverless");
    const schema = await import("./schema");
    
    // Create Drizzle instance with connection string directly
    dbInstance = drizzle(connectionString, { schema });
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

// Export getDb function for direct access
export { getDb };

// For code that uses db directly (like seed.ts), we need a proxy
// But since Drizzle's query builder is synchronous, we'll initialize eagerly when possible
let eagerDb: any = null;

// Try to initialize db eagerly if env is available
if (hasDbEnv) {
  (async () => {
    try {
      const connectionString = 
        process.env.POSTGRES_URL_NON_POOLING || 
        process.env.POSTGRES_URL || 
        process.env.DATABASE_URL;
      
      if (connectionString) {
        const { drizzle } = await import("drizzle-orm/neon-serverless");
        const schema = await import("./schema");
        eagerDb = drizzle(connectionString, { schema });
      }
    } catch (error) {
      console.warn("[db/client] Failed to initialize db eagerly:", error);
    }
  })();
}

// Export db as a proxy that uses eager instance or falls back to getDb
export const db = new Proxy({} as any, {
  get(_target, prop) {
    // If we have an eager instance, use it directly (synchronous)
    if (eagerDb) {
      return (eagerDb as any)[prop];
    }
    
    // Otherwise, return a function that gets the db instance async
    return async (...args: any[]) => {
      const instance = await getDb();
      const method = (instance as any)[prop];
      if (typeof method === 'function') {
        const result = method.apply(instance, args);
        // Wrap result in a proxy to handle chaining
        if (result && typeof result === 'object') {
          return new Proxy(result, {
            get(_resultTarget, resultProp) {
              const resultValue = (result as any)[resultProp];
              if (typeof resultValue === 'function') {
                return (...resultArgs: any[]) => {
                  const finalResult = resultValue.apply(result, resultArgs);
                  // If it's a promise (execution), return it
                  if (finalResult instanceof Promise) {
                    return finalResult;
                  }
                  // Otherwise continue the chain
                  return finalResult;
                };
              }
              return resultValue;
            },
          });
        }
        return result;
      }
      return method;
    };
  },
});
