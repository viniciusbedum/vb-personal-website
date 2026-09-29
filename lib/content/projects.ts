import fs from "node:fs";
import path from "node:path";
import type { Project } from "./types";
import { localize } from "./types";
import { isProjectCategory } from "./categories";
import { applyPins } from "./pins";
import { PROJECTS, type ProjectData } from "./projects-data";

/**
 * Case body Markdown for `slug` in `locale`. Falls back to `en.md` when the
 * requested locale file is missing, then to an empty string.
 */
export function readProjectBody(slug: string, locale: string): string {
  const localeFile = path.join(process.cwd(), "content/projects", slug, `${locale}.md`);

  try {
    return fs.readFileSync(localeFile, "utf8");
  } catch {
    if (locale === "en") return "";

    try {
      return fs.readFileSync(
        path.join(process.cwd(), "content/projects", slug, "en.md"),
        "utf8",
      );
    } catch {
      return "";
    }
  }
}

function toProject(
  data: ProjectData & { pinned?: boolean },
  locale: string,
): Project {
  return {
    slug: data.slug,
    title: localize(data.title, locale) ?? "",
    summary: localize(data.summary, locale) ?? "",
    client: data.client,
    year: data.year,
    period: data.period,
    role: localize(data.role, locale),
    outcome: localize(data.outcome, locale),
    body: readProjectBody(data.slug, locale),
    externalLink: data.externalLink,
    metaTitle: localize(data.metaTitle, locale),
    metaDescription: localize(data.metaDescription, locale),
    coverImage: data.coverImage,
    category: isProjectCategory(data.category) ? data.category : undefined,
    cardText: localize(data.cardText, locale),
    pinned: data.pinned,
    pinnedAt: data.pinnedAt,
  };
}

export async function getProjects(locale: string): Promise<Project[]> {
  return applyPins(PROJECTS).map((data) => toProject(data, locale));
}

export async function getProject(
  locale: string,
  slug: string,
): Promise<Project | null> {
  const data = PROJECTS.find((project) => project.slug === slug);
  return data ? toProject(data, locale) : null;
}
