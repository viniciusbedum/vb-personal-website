/**
 * Optional visit counter (Upstash Redis REST API, no SDK). It is off until
 * the site is connected to "Upstash for Redis" in the Vercel Marketplace,
 * which sets the env vars below; without them nothing is counted or shown.
 */
const KEY = "views";

function config(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ""), token } : null;
}

export function isViewCounterEnabled(): boolean {
  return config() !== null;
}

/** "incr" adds one visit, "get" only reads. Null when off or on any error. */
export async function views(command: "incr" | "get"): Promise<number | null> {
  const redis = config();
  if (!redis) return null;

  try {
    const response = await fetch(`${redis.url}/${command}/${KEY}`, {
      headers: { Authorization: `Bearer ${redis.token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const { result } = (await response.json()) as { result: unknown };
    const count = Number(result ?? 0);
    return Number.isFinite(count) ? count : null;
  } catch {
    return null;
  }
}
