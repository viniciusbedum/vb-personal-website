export const PROJECT_CATEGORIES = [
  "experience",
  "saas",
  "ecommerce",
  "landing-pages",
  "ads",
  "brands",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export function isProjectCategory(value: unknown): value is ProjectCategory {
  return (
    typeof value === "string" &&
    (PROJECT_CATEGORIES as readonly string[]).includes(value)
  );
}
