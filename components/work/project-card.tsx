import Image from "next/image";
import Link from "next/link";
import { PushPin } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import type { Project } from "@/lib/content/types";
import { localeHref } from "@/i18n/navigation";

type ProjectCardProps = {
  project: Project;
  locale: string;
  /** Load the cover eagerly (first card above the fold). */
  priority?: boolean;
  /** Image `sizes` attribute; defaults to the home Work grid layout. */
  sizes?: string;
  /** Show the pin chip on the cover when the project is pinned (Work page only). */
  showPin?: boolean;
};

/**
 * Work card: 3:2 cover on top, then a meta row with the date (free
 * `period` like "2022-2023", falling back to `year`) in mono
 * (same style as the home clock/location) on the left and the single
 * category as a small bordered pill on the right, then title and the
 * owner's free `cardText` in muted grey. Date, pill and text are optional.
 * Built for the home Work grid (2 cols) and the Work hub.
 * Server component.
 */
export async function ProjectCard({
  project,
  locale,
  priority,
  showPin = false,
  sizes = "(min-width: 1200px) 246px, (min-width: 810px) 216px, calc(50vw - 24px)",
}: ProjectCardProps) {
  const t = await getTranslations({ locale, namespace: "projectCategories" });
  const tWork = await getTranslations({ locale, namespace: "work" });
  const date = project.period || project.year;

  return (
    <Link
      href={localeHref(locale, `/work/${project.slug}`)}
      className="flex h-full flex-col gap-3 rounded-xl border border-border bg-secondary p-2 pb-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-colors hover:bg-card"
    >
      <div className="relative">
        <Image
          src={project.coverImage}
          alt=""
          loading={priority ? "eager" : undefined}
          width={492}
          height={328}
          sizes={sizes}
          className="aspect-[3/2] w-full rounded-lg object-cover"
        />
        {showPin && project.pinned ? (
          <span
            role="img"
            aria-label={tWork("pinned")}
            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-lg border border-white/20 bg-black/55 text-white backdrop-blur-sm"
          >
            <PushPin size={16} weight="fill" aria-hidden />
          </span>
        ) : null}
      </div>
      <span className="flex flex-1 flex-col px-1">
        {date || project.category ? (
          <span className="mb-2 flex flex-wrap items-center justify-between gap-2">
            {date ? (
              <span className="font-mono text-[13px] leading-[0.8] tracking-[0.6px] uppercase text-muted-foreground">
                {date}
              </span>
            ) : null}
            {project.category ? (
              <span className="ml-auto rounded-[4px] border border-border px-[5px] py-[3px] text-[10px] leading-none tracking-[0.4px] text-subtle uppercase">
                {t(project.category)}
              </span>
            ) : null}
          </span>
        ) : null}
        <span className="line-clamp-2 text-[15px] leading-[1.5] text-foreground">
          {project.title}
        </span>
        {project.cardText ? (
          <span className="mt-0.5 line-clamp-2 text-[13px] leading-[1.5] text-muted-foreground">
            {project.cardText}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
