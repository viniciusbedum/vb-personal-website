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

/** One card of a ```cards fence: an image with an optional title and text under it. */
export type CardEntry = {
  image: string;
  alt: string;
  title?: string;
  text?: string;
};

/**
 * Parse the body of a ```cards fence: cards separated by a blank line,
 * one `key: value` per line (keys: image, alt, title, text). `image` is
 * required and must be a path on this site (starts with `/`); a card
 * without it is skipped. Unknown keys are ignored.
 */
export function parseCardsBlock(raw: string): CardEntry[] {
  const cards: CardEntry[] = [];

  for (const chunk of raw.split(/\n\s*\n/)) {
    const fields = new Map<string, string>();
    for (const line of chunk.split("\n")) {
      const index = line.indexOf(":");
      if (index === -1) continue;
      const key = line.slice(0, index).trim().toLowerCase();
      const value = line.slice(index + 1).trim();
      if (value) fields.set(key, value);
    }

    const image = fields.get("image");
    if (!image || !image.startsWith("/") || image.startsWith("//")) continue;

    const card: CardEntry = { image, alt: fields.get("alt") ?? "" };
    const title = fields.get("title");
    const text = fields.get("text");
    if (title) card.title = title;
    if (text) card.text = text;
    cards.push(card);
  }

  return cards;
}

/** True for `YYYY`, `YYYY-MM` and `YYYY-MM-DD`: the `###` headings of a Development entry. */
export function isDateHeading(text: string): boolean {
  return /^\d{4}(-\d{2}(-\d{2})?)?$/.test(text.trim());
}
