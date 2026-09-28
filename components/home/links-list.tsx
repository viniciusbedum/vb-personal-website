import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { LINKS } from "@/lib/content/links";

type LinksListProps = {
  locale: string;
};

const monoLine =
  "font-mono text-[13px] leading-[1.2] tracking-[0.6px] uppercase";

/**
 * "Links" section of the home: same card as Build (border, padding 24px),
 * with a title, a muted subtitle and an external-link arrow on the right.
 * Server component.
 */
export function LinksList({ locale }: LinksListProps) {
  const lang = locale === "en" ? "en" : "pt";

  return (
    <ul className="flex flex-col gap-4">
      {LINKS.map((link) => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-secondary p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-colors hover:bg-card"
          >
            <span className="flex min-w-0 flex-col gap-2">
              <span className={`${monoLine} text-foreground`}>
                {link.title[lang]}
              </span>
              <span className={`${monoLine} text-muted-foreground`}>
                {link.subtitle[lang]}
              </span>
            </span>
            <ArrowUpRight
              className="size-[18px] shrink-0 text-muted-foreground"
              aria-hidden
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
