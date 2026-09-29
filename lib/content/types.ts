import type { ProjectCategory } from "./categories";

/** Text that varies by locale, matching the `{ pt, en }` shape used across `lib/content/*.ts`. */
export type Localized = { pt: string; en: string };

/** `value[locale]`, falling back to `pt` when the requested locale key is missing. */
export function localize(
  value: Localized | undefined,
  locale: string,
): string | undefined {
  if (!value) return undefined;
  return (value as Record<string, string>)[locale] ?? value.pt;
}

export type Project = {
  slug: string;
  title: string;
  summary: string;
  client?: string;
  year?: number;
  period?: string;
  role?: string;
  outcome?: string;
  /** Case body, Markdown. */
  body: string;
  externalLink?: string;
  metaTitle?: string;
  metaDescription?: string;
  coverImage: string;
  category?: ProjectCategory;
  cardText?: string;
  pinned?: boolean;
  pinnedAt?: string;
};

export type HomeProfile = {
  name: string;
  role: string;
  availability?: string;
  location?: string;
  email?: string;
  avatar: string;
  socials: { platform: string; url: string }[];
};

export type HomeContent = {
  heroTitle: string;
  heroSubtitle: string;
  featuredProjects: Project[];
  profile: HomeProfile;
};
