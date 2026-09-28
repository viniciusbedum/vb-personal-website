export type Skill = {
  label: { pt: string; en: string };
};

/** Whitelabel users edit this list. */
export const SKILLS: Skill[] = [
  { label: { pt: "Growth Marketing", en: "Growth Marketing" } },
  { label: { pt: "Go-to-Market", en: "Go-to-Market" } },
  { label: { pt: "Paid Media", en: "Paid Media" } },
  { label: { pt: "IA", en: "AI" } },
  { label: { pt: "Brand", en: "Brand" } },
  { label: { pt: "LTV", en: "LTV" } },
  { label: { pt: "Landing Pages", en: "Landing Pages" } },
];
