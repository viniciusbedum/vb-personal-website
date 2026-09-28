import type { ProjectCategory } from "./categories";
import type { Localized } from "./types";

export type ProjectData = {
  slug: string;
  title: Localized;
  cardText?: Localized;
  summary: Localized;
  client?: string;
  role?: Localized;
  outcome?: Localized;
  period?: string;
  year?: number;
  category?: ProjectCategory;
  externalLink?: string;
  coverImage: string;
  metaTitle?: Localized;
  metaDescription?: Localized;
};

/** Whitelabel users edit this list. Display order on /work is by `year`, newest first (see `getProjects`). */
export const PROJECTS: ProjectData[] = [
  {
    slug: "projeto-exemplo-1",
    title: { pt: "Título do projeto", en: "Project title" },
    cardText: { pt: "Descrição curta do card", en: "Short card description" },
    summary: {
      pt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt magna aliqua ut labore.",
      en: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt magna aliqua ut labore.",
    },
    client: "Nome do cliente / Client name",
    role: { pt: "Sua função no projeto", en: "Your role in the project" },
    outcome: {
      pt: "Resultado principal (ex: +40% em conversão)",
      en: "Key result (e.g. +40% conversion)",
    },
    period: "2024-2025",
    year: 2025,
    category: "saas",
    externalLink: "https://example.com",
    coverImage: "/projects/projeto-exemplo-1/cover.webp",
    metaTitle: { pt: "Título para SEO", en: "SEO title" },
    metaDescription: {
      pt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.",
      en: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.",
    },
  },
  {
    slug: "projeto-exemplo-2",
    title: { pt: "Título do projeto", en: "Project title" },
    cardText: { pt: "Descrição curta do card", en: "Short card description" },
    summary: {
      pt: "Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
      en: "Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
    },
    client: "Nome do cliente / Client name",
    role: { pt: "Sua função no projeto", en: "Your role in the project" },
    outcome: {
      pt: "Resultado principal (ex: +40% em conversão)",
      en: "Key result (e.g. +40% conversion)",
    },
    period: "2022-2023",
    year: 2023,
    category: "brands",
    externalLink: "https://example.com",
    coverImage: "/projects/projeto-exemplo-2/cover.webp",
    metaTitle: { pt: "Título para SEO", en: "SEO title" },
    metaDescription: {
      pt: "Dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt.",
      en: "Dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt.",
    },
  },
];

/** Slugs shown on the home, in order. Empty falls back to all projects. */
export const FEATURED_PROJECTS: string[] = ["projeto-exemplo-1", "projeto-exemplo-2"];
