/** One entry of a "Sources and further reading" list, parsed from a ```source fence. */
export type SourceEntry = {
  kicker?: string;
  title: string;
  url: string;
  meta?: string;
  description?: string;
};

const OPTIONAL_KEYS = ["kicker", "meta", "description"] as const;

/**
 * Parse the body of a ```source fence: one `key: value` per line (keys:
 * kicker, title, url, meta, description). Values are split on the first
 * colon and trimmed; unknown keys and blank lines are ignored. Returns
 * null when title or url is missing, or the url is not http(s).
 */
export function parseSourceBlock(raw: string): SourceEntry | null {
  const fields = new Map<string, string>();

  for (const line of raw.split("\n")) {
    const index = line.indexOf(":");
    if (index === -1) continue;
    const key = line.slice(0, index).trim().toLowerCase();
    const value = line.slice(index + 1).trim();
    if (value) fields.set(key, value);
  }

  const title = fields.get("title");
  const url = fields.get("url");
  if (!title || !url || !/^https?:\/\//i.test(url)) return null;

  const entry: SourceEntry = { title, url };
  for (const key of OPTIONAL_KEYS) {
    const value = fields.get(key);
    if (value) entry[key] = value;
  }
  return entry;
}

/** True for `YYYY`, `YYYY-MM` and `YYYY-MM-DD`: the `###` headings of a Development entry. */
export function isDateHeading(text: string): boolean {
  return /^\d{4}(-\d{2}(-\d{2})?)?$/.test(text.trim());
}
