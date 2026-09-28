import type { Metadata } from "next";
import { SHARE_IMAGE } from "@/lib/share-image";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getHome } from "@/lib/content/home";
import { getProjects } from "@/lib/content/projects";
import { PROJECT_CATEGORIES } from "@/lib/content/categories";
import { localeAlternates, localeUrl } from "@/i18n/navigation";
import { ProjectCard } from "@/components/work/project-card";
import { WorkGallery, WorkGalleryView } from "@/components/work/work-gallery";
import { Skills } from "@/components/work/skills";
import { ToolsList } from "@/components/work/tools-list";
import { Languages } from "@/components/work/languages";
import { Contact } from "@/components/work/contact";
import { SiteFooter } from "@/components/home/site-footer";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "work" });
  const url = localeUrl(locale, "/work");

  return {
    title: t("listTitle"),
    description: t("intro"),
    alternates: {
      canonical: url,
      languages: localeAlternates("/work"),
    },
    openGraph: {
      title: t("listTitle"),
      description: t("intro"),
      url,
      type: "website",
      images: [SHARE_IMAGE],
    },
  };
}

export default async function WorkPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [projects, home, t, tCategories] = await Promise.all([
    getProjects(locale),
    getHome(locale),
    getTranslations({ locale, namespace: "work" }),
    getTranslations({ locale, namespace: "projectCategories" }),
  ]);

  const items = projects.map((project, index) => ({
    slug: project.slug,
    category: project.category,
    node: (
      <ProjectCard
        project={project}
        locale={locale}
        priority={index === 0}
        sizes="(min-width: 1200px) 250px, calc(50vw - 40px)"
      />
    ),
  }));
  const usedCategories = new Set(
    projects.map((project) => project.category).filter(Boolean),
  );
  const categories = PROJECT_CATEGORIES.filter((category) =>
    usedCategories.has(category),
  ).map((category) => ({
    value: category,
    label: tCategories(category),
  }));
  const galleryProps = {
    locale,
    items,
    categories,
    allLabel: t("filterAll"),
    filterLabel: t("filterLabel"),
  };

  return (
    <main className="mx-auto flex w-full max-w-[1080px] flex-col px-4 py-10 tablet:px-8">
      <p className="flex h-8 items-center font-mono text-[13px] leading-[0.8] tracking-[0.6px] uppercase text-muted-foreground desktop:h-auto">
        {t("eyebrow")}
      </p>
      <h1 className="mt-0 text-[32px] leading-[1.15] text-foreground desktop:mt-5 desktop:text-[40px]">
        {t("heading")}
      </h1>
      <p className="mt-4 max-w-[600px] text-[15px] leading-[1.5] text-muted-foreground">
        {t("intro")}
      </p>
      {projects.length === 0 ? (
        <p className="mt-10 text-[15px] text-muted-foreground">
          {t("listEmpty")}
        </p>
      ) : (
        <div className="mt-8">
          <Suspense fallback={<WorkGalleryView {...galleryProps} />}>
            <WorkGallery {...galleryProps} />
          </Suspense>
        </div>
      )}
      <div className="mt-24">
        <Skills locale={locale} />
      </div>
      <div className="mt-24">
        <ToolsList locale={locale} />
      </div>
      <div className="mt-24">
        <Languages locale={locale} />
      </div>
      <div className="mt-24">
        <Contact
          locale={locale}
          email={home.profile.email}
          availability={home.profile.availability}
        />
      </div>
      {/* 56px + the footer's own 40px = 96px, like the sections above. */}
      <div className="mt-14">
        <SiteFooter locale={locale} path="/work" pill="top" />
      </div>
    </main>
  );
}
