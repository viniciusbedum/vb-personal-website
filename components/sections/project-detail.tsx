import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/ssr";
import type { Project } from "@/lib/content/types";
import { buttonVariants } from "@/components/ui/button";
import { ProjectBody, getBodyHeadings } from "@/components/work/project-body";
import { ProjectCard } from "@/components/work/project-card";
import { localeHref } from "@/i18n/navigation";

export type ProjectDetailProps = {
  locale: string;
  project: Project;
  /** Up to 2 other projects, most recent first, excluding the current one. */
  otherProjects: Project[];
};

const COVER_SIZES = "(min-width: 810px) 640px, calc(100vw - 32px)";

/**
 * Project case-study page: single reading column (cover → title + date →
 * metadata → opening → index → sectioned body → wrap-up). Own `<main>`, no `ListDetailLayout`.
 * Server component.
 */
export async function ProjectDetail({
  locale,
  project,
  otherProjects,
}: ProjectDetailProps) {
  const [t, tCategories] = await Promise.all([
    getTranslations({ locale, namespace: "work" }),
    getTranslations({ locale, namespace: "projectCategories" }),
  ]);

  const date = project.period || (project.year ? String(project.year) : undefined);
  const categoryLabel = project.category ? tCategories(project.category) : undefined;
  const metaLine = [date, categoryLabel].filter(Boolean).join(" · ");
  const headings = getBodyHeadings(project.body);
  const showToc = headings.length >= 3;

  const rows = [
    { label: t("client"), value: project.client },
    { label: t("role"), value: project.role },
    { label: t("outcome"), value: project.outcome },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  return (
    <main className="mx-auto w-full max-w-[640px] px-4 py-10 tablet:px-0">
      <Link
        href={localeHref(locale, "/work")}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-[13px] leading-none text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        {t("back")}
      </Link>

      <Image
        src={project.coverImage}
        alt=""
        priority
        width={1280}
        height={853}
        sizes={COVER_SIZES}
        className="mt-6 aspect-[3/2] w-full rounded-xl object-cover"
      />

      <h1 className="mt-8 text-[32px] leading-[1.15] text-foreground desktop:text-[40px]">
        {project.title}
      </h1>

      {metaLine ? (
        <p className="mt-3 font-mono text-[13px] leading-[0.8] tracking-[0.6px] uppercase text-muted-foreground">
          {metaLine}
        </p>
      ) : null}

      <p className="mt-5 text-[17px] leading-[1.55] text-foreground">
        {project.summary}
      </p>

      {rows.length > 0 ? (
        <dl className="mt-6 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-[15px] leading-[1.5]">
          {rows.map((row) => (
            <div key={row.label} className="contents">
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {showToc ? (
        <nav
          aria-label={t("onThisPage")}
          className="mt-10 border-y border-border py-4"
        >
          <p className="font-mono text-[13px] leading-[0.8] tracking-[0.6px] uppercase text-muted-foreground">
            {t("onThisPage")}
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className="text-[13px] text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <ProjectBody body={project.body} />

      {project.externalLink ? (
        <a
          href={project.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "secondary", className: "mt-12 flex" })}
        >
          {t("visitLive")}
          <ArrowUpRight
            className="size-[18px] text-muted-foreground"
            weight="regular"
            aria-hidden
          />
        </a>
      ) : null}

      {otherProjects.length > 0 ? (
        <div className="mt-16">
          <p className="font-mono text-[13px] leading-[0.8] tracking-[0.6px] uppercase text-muted-foreground">
            {t("otherWork")}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 tablet:grid-cols-2">
            {otherProjects.map((other) => (
              <ProjectCard
                key={other.slug}
                project={other}
                locale={locale}
                sizes="(min-width: 810px) 312px, calc(100vw - 32px)"
              />
            ))}
          </div>
        </div>
      ) : null}
    </main>
  );
}
