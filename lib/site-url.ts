/**
 * Absolute base URL of the site (no trailing slash), used for canonicals,
 * hreflang, Open Graph, JSON-LD, robots and sitemap.
 *
 * Never throws: a first deploy works with zero env vars. Priority:
 * `NEXT_PUBLIC_SITE_URL` (inlined at build time) → the Vercel production
 * URL → localhost.
 */
export function resolveSiteUrl(env: Partial<NodeJS.ProcessEnv> = process.env): string {
  const value = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (value) {
    return value.replace(/\/+$/, "");
  }

  const vercelUrl = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
