import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import type { GithubContributions } from "@/lib/content/github";

export type GithubCardProps = {
  locale: string;
  username: string;
  /** Name in the card title; defaults to `username`. */
  label?: string;
  contributions: GithubContributions | null;
};

const LEVEL_CLASS: Record<number, string> = {
  0: "bg-foreground/[0.06]",
  1: "bg-foreground/25",
  2: "bg-foreground/45",
  3: "bg-foreground/70",
  4: "bg-foreground/95",
};

/**
 * Full-width card linking to GitHub, with a monochrome contribution
 * graph drawn in code and the real contribution count. Shares the
 * `ProjectCard` link shell. When `contributions` is `null` the card
 * renders only the top row (header + link).
 * Server component.
 */
export async function GithubCard({
  locale,
  username,
  label = username,
  contributions,
}: GithubCardProps) {
  const t = await getTranslations({ locale, namespace: "home" });

  const count = contributions
    ? contributions.total.toLocaleString(locale === "pt" ? "pt-BR" : "en-US")
    : null;

  const ariaLabel = count
    ? t("githubAria", { user: username, count })
    : `GitHub, ${username}`;

  return (
    <a
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="flex w-full flex-col gap-5 rounded-xl border border-border bg-secondary p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-colors hover:bg-card"
    >
      <span className="flex items-center justify-between">
        <span className="font-mono text-[13px] leading-[0.8] tracking-[0.6px] uppercase text-foreground">
          GITHUB / {label}
        </span>
        <ArrowUpRight className="size-[18px] text-muted-foreground" aria-hidden />
      </span>

      {contributions ? (
        <>
          <div
            aria-hidden
            className="grid grid-flow-col grid-rows-7 gap-[2px]"
            style={{
              gridTemplateColumns: `repeat(${contributions.weeks.length}, minmax(0, 1fr))`,
            }}
          >
            {contributions.weeks.map((week, weekIndex) =>
              week.map((level, dayIndex) => (
                <span
                  key={`${weekIndex}-${dayIndex}`}
                  className={
                    level === null
                      ? "aspect-square"
                      : `aspect-square ${LEVEL_CLASS[level]}`
                  }
                />
              )),
            )}
          </div>
          <span className="font-mono text-[13px] leading-[0.8] tracking-[0.6px] uppercase text-muted-foreground">
            {t("githubContributions", { count: count! })}
          </span>
        </>
      ) : null}
    </a>
  );
}
