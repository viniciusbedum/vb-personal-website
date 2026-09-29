/** Most pins that count; extra `pinnedAt` values are ignored (oldest first). */
export const MAX_PINS = 5;

type Pinnable = { slug: string; year?: number; pinnedAt?: string };

function byPinnedAtDesc(a: { pinnedAt?: string }, b: { pinnedAt?: string }): number {
  return (b.pinnedAt ?? "").localeCompare(a.pinnedAt ?? "");
}

/**
 * Orders projects: pinned first (latest `pinnedAt` first, only the top
 * `MAX_PINS` count), then the rest by `year` desc. Ties keep list order.
 */
export function applyPins<T extends Pinnable>(items: T[]): (T & { pinned: boolean })[] {
  const indexed = items.map((item, index) => ({ item, index }));
  const pinnedSet = new Set(
    indexed
      .filter(({ item }) => item.pinnedAt)
      .sort(
        (a, b) =>
          byPinnedAtDesc(a.item, b.item) ||
          (b.item.year ?? 0) - (a.item.year ?? 0) ||
          a.index - b.index,
      )
      .slice(0, MAX_PINS)
      .map(({ index }) => index),
  );

  return indexed
    .map(({ item, index }) => ({ item: { ...item, pinned: pinnedSet.has(index) }, index }))
    .sort((a, b) => {
      if (a.item.pinned !== b.item.pinned) return a.item.pinned ? -1 : 1;
      if (a.item.pinned) {
        const byPin = byPinnedAtDesc(a.item, b.item);
        if (byPin) return byPin;
      }
      return (b.item.year ?? 0) - (a.item.year ?? 0) || a.index - b.index;
    })
    .map(({ item }) => item);
}

/**
 * Home ordering: `featuredSlugs` in listed order (unknown slugs dropped),
 * with pinned ones moved first by `pinnedAt` desc. Empty list returns
 * `items` as is.
 */
export function orderFeatured<
  T extends { slug: string; pinned?: boolean; pinnedAt?: string },
>(items: T[], featuredSlugs: string[]): T[] {
  if (featuredSlugs.length === 0) return items;

  const featured = featuredSlugs
    .map((slug) => items.find((item) => item.slug === slug))
    .filter((item): item is T => Boolean(item))
    .map((item, index) => ({ item, index }));

  return featured
    .sort((a, b) => {
      const aPinned = Boolean(a.item.pinned);
      if (aPinned !== Boolean(b.item.pinned)) return aPinned ? -1 : 1;
      if (aPinned) {
        const byPin = byPinnedAtDesc(a.item, b.item);
        if (byPin) return byPin;
      }
      return a.index - b.index;
    })
    .map(({ item }) => item);
}
