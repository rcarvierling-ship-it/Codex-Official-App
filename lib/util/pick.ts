import 'server-only';

export function pick<T = any>(row: Record<string, any>, keys: string[], fallback: T): T {
  for (const k of keys) if (k in row && row[k] != null) return row[k] as T;
  return fallback;
}

