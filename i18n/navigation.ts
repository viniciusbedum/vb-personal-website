import { createNavigation } from "next-intl/navigation";
import { siteUrl } from "@/lib/site-url";
import { routing } from "./routing";

/**
 * Locale-aware navigation. Build every internal link with these (never
 * `/${locale}/...` by hand): the default locale has no prefix and pt uses
 * /br, see `routing.ts`.
 */
export const { Link, redirect, usePathname, getPathname } =
  createNavigation(routing);

type Href = Parameters<typeof getPathname>[0]["href"];

/** Path for `href` in `locale`, e.g. ("pt", "/work") -> "/br/work". */
export function localeHref(locale: string, href: Href): string {
  return getPathname({ locale, href });
}

/** Absolute URL for `href` in `locale` (canonical, Open Graph, sitemap). */
export function localeUrl(locale: string, href: Href): string {
  const path = localeHref(locale, href);
  return `${siteUrl}${path === "/" ? "" : path}`;
}

/** hreflang map of `href` in every locale, for `alternates.languages`. */
export function localeAlternates(href: Href): Record<string, string> {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, localeUrl(locale, href)]),
  );
}
