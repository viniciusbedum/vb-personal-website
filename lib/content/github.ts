export type GithubContributions = {
  total: number;
  weeks: (number | null)[][];
};

/** Explicit GitHub username; null uses the socials-derived handle, then
 * `DEFAULT_GITHUB_USERNAME`. Whitelabel users set this directly. */
export const GITHUB_USERNAME: string | null = null;

/** Whitelabel users set this to false to hide the Build (GitHub) section. */
export const SHOW_BUILD_SECTION = true;

// Fallback graph shown until `GITHUB_USERNAME` is set and no GitHub URL is
// found in `PROFILE.socials`. Do not change this in the whitelabel (see
// content-map.md).
export const DEFAULT_GITHUB_USERNAME = "viniciusbedum";

/** Shown in the card title while no GitHub URL is set (the graph and link
 * still use `DEFAULT_GITHUB_USERNAME`). */
export const DEFAULT_GITHUB_LABEL = "your-handle";

export function githubUsernameFromSocials(
  socials: { platform: string; url: string }[],
): string | undefined {
  for (const social of socials) {
    let url: URL;
    try {
      url = new URL(social.url);
    } catch {
      continue;
    }

    if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
      continue;
    }

    const segment = url.pathname.split("/").find((part) => part.length > 0);
    if (segment) {
      return segment;
    }
  }

  return undefined;
}

export function parseContributions(html: string): GithubContributions | null {
  const days: { date: string; level: number }[] = [];
  const cellRegex = /<td\b[^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = cellRegex.exec(html)) !== null) {
    const tag = match[0];
    const dateMatch = tag.match(/data-date="([^"]+)"/);
    const levelMatch = tag.match(/data-level="([^"]+)"/);

    if (!dateMatch || !levelMatch) continue;

    const level = Number(levelMatch[1]);
    if (!Number.isFinite(level)) continue;

    const clampedLevel = Math.min(4, Math.max(0, level));
    days.push({ date: dateMatch[1], level: clampedLevel });
  }

  if (days.length === 0) {
    console.warn("[github] parseContributions: no day cells found");
    return null;
  }

  const totalMatch = html.match(
    /([\d,]+)\s+contributions?\s+in the last year/,
  );
  if (!totalMatch) {
    console.warn("[github] parseContributions: total contributions text not found");
    return null;
  }

  const total = Number(totalMatch[1].replace(/,/g, ""));
  if (!Number.isFinite(total)) {
    console.warn("[github] parseContributions: total is not a finite number");
    return null;
  }

  days.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const firstWeekday = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const levels: (number | null)[] = new Array(firstWeekday).fill(null);
  for (const day of days) {
    levels.push(day.level);
  }
  while (levels.length % 7 !== 0) {
    levels.push(null);
  }

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < levels.length; i += 7) {
    weeks.push(levels.slice(i, i + 7));
  }

  return { total, weeks };
}

export async function getGithubContributions(
  username: string,
): Promise<GithubContributions | null> {
  try {
    const response = await fetch(
      `https://github.com/users/${encodeURIComponent(username)}/contributions`,
      { next: { revalidate: 86400 }, signal: AbortSignal.timeout(5000) },
    );

    if (!response.ok) {
      console.warn(`[github] contributions fetch failed with status ${response.status}`);
      return null;
    }

    const html = await response.text();
    return parseContributions(html);
  } catch (error) {
    console.warn(
      `[github] contributions fetch threw: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}
