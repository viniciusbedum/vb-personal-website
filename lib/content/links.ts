export type HomeLink = {
  title: { pt: string; en: string };
  subtitle: { pt: string; en: string };
  url: string;
};

/** Whitelabel users edit this list. Empty list hides the Links section. */
export const LINKS: HomeLink[] = [
  {
    title: { pt: "Título do link", en: "Link title" },
    subtitle: {
      pt: "Uma frase curta sobre o destino.",
      en: "A short line about where it goes.",
    },
    url: "https://example.com",
  },
  {
    title: { pt: "Título de outro link", en: "Another link title" },
    subtitle: {
      pt: "Uma frase curta sobre o destino.",
      en: "A short line about where it goes.",
    },
    url: "https://example.org",
  },
];
