export async function scopedFetch<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", ...init });
  if (!res.ok) {
    throw new Error(`Access denied: Out of scope`);
  }
  return res.json() as Promise<T>;
}
