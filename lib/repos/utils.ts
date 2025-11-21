// Shared helper for picking the first existing column name from a row
export function pick<T = unknown>(
  row: Record<string, unknown>,
  keys: string[],
  fallback: T
): T {
  for (const k of keys) {
    if (k in row && row[k] != null) return row[k] as T;
  }
  return fallback;
}

