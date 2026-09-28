import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localeAlternates, localeUrl } from "@/i18n/navigation";
import { getProjects } from "@/lib/content/projects";

const { locales } = routing;

function entry(locale: string, href: string) {
  return {
    url: localeUrl(locale, href),
    alternates: { languages: localeAlternates(href) },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push(entry(locale, "/"));
    entries.push(entry(locale, "/work"));
    entries.push(entry(locale, "/privacy"));
  }

  const projectsByLocale = Object.fromEntries(
    await Promise.all(
      locales.map(async (locale) => [locale, await getProjects(locale)] as const),
    ),
  );

  for (const locale of locales) {
    for (const project of projectsByLocale[locale]) {
      entries.push(entry(locale, `/work/${project.slug}`));
    }
  }

  return entries;
}
