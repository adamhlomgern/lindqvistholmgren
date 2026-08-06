const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

// Best-effort, in-memory per-instance limiter — a first line of defense
// alongside the honeypot and the Supabase-backed check in the route itself.
// A shared store (e.g. Redis) would be needed for a hard guarantee across
// serverless instances.
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_REQUESTS;
}
