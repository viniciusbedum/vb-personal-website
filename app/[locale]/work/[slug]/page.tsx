import type { Metadata } from "next";
import { SHARE_IMAGE } from "@/lib/share-image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getProject, getProjects } from "@/lib/content/projects";
import { jsonLdString } from "@/lib/json-ld";
import { localeAlternates, localeUrl } from "@/i18n/navigation";
import { ProjectDetail } from "@/components/sections/project-detail";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

/**
 * Prerender every slug per locale at build time. A slug added afterwards
 * renders on first request and is then cached (dynamicParams default).
 */
export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const items = await getProjects(params.locale);
  return items.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(locale, slug);

  if (!project) {
    return {};
  }

  const title = project.metaTitle ?? project.title;
  // An explicit SEO title is used as-is; the plain title gets the site-name
  // template from the layout.
  const documentTitle = project.metaTitle
    ? { absolute: project.metaTitle }
    : project.title;
  const description = project.metaDescription ?? project.summary;
  const url = localeUrl(locale, `/work/${slug}`);

  return {
    title: documentTitle,
    description,
    alternates: {
      canonical: url,
      languages: localeAlternates(`/work/${slug}`),
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SHARE_IMAGE.url],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = await getProject(locale, slug);

  if (!project) {
    notFound();
  }

  const url = localeUrl(locale, `/work/${slug}`);
  const projects = await getProjects(locale);
  const otherProjects = projects.filter((p) => p.slug !== slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    ...(project.client ? { creator: project.client } : {}),
    ...(project.year ? { dateCreated: String(project.year) } : {}),
    url,
  };

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <ProjectDetail locale={locale} project={project} otherProjects={otherProjects} />
    </div>
  );
}
