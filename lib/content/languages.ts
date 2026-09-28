export type Language = {
  name: { pt: string; en: string };
  level: { pt: string; en: string };
};

/**
 * Whitelabel users edit this list, native language first. Level: "Nativa"
 * for the native one, then Básico / Intermediário / Avançado (Basic /
 * Intermediate / Advanced). Empty list hides the section.
 */
export const LANGUAGES: Language[] = [
  {
    name: { pt: "Português", en: "Portuguese" },
    level: { pt: "Nativa", en: "Native" },
  },
  {
    name: { pt: "Inglês", en: "English" },
    level: { pt: "Avançado", en: "Advanced" },
  },
];
