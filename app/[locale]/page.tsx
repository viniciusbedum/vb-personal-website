import type { Metadata } from "next";
import { SHARE_IMAGE } from "@/lib/share-image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { getHome } from "@/lib/content/home";
import { jsonLdString } from "@/lib/json-ld";
import { localeAlternates, localeHref, localeUrl } from "@/i18n/navigation";
import { ProfileCard } from "@/components/home/profile-card";
import { LabeledSection } from "@/components/home/labeled-section";
import { GithubCard } from "@/components/home/github-card";
import { LinksList } from "@/components/home/links-list";
import { SiteFooter } from "@/components/home/site-footer";
import { LINKS } from "@/lib/content/links";
import { ProjectCard } from "@/components/work/project-card";
import {
  DEFAULT_GITHUB_LABEL,
  DEFAULT_GITHUB_USERNAME,
  GITHUB_USERNAME,
  SHOW_BUILD_SECTION,
  getGithubContributions,
  githubUsernameFromSocials,
} from "@/lib/content/github";

/** At most two items per home list (one row of the Work grid) before "View all". */
const HOME_LIST_LIMIT = 2;

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const home = await getHome(locale);
  const url = localeUrl(locale, "/");

  return {
    // The hero title is the site name; skip the "%s · Site Name" template.
    title: { absolute: home.heroTitle },
    description: home.heroSubtitle,
    alternates: {
      canonical: url,
      languages: localeAlternates("/"),
    },
    openGraph: {
      title: home.heroTitle,
      description: home.heroSubtitle,
      url,
      type: "website",
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: home.heroTitle,
      description: home.heroSubtitle,
      images: [SHARE_IMAGE.url],
    },
  };
}

/** Build and Links cards open with text below 24px padding + 1px border. */
const CARD_TEXT_OFFSET = 22;
/** Profile name line: 56px avatar + 32px gap, 28.8px line vs 22.5px label. */
const NAME_OFFSET = 91;

function ViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-8 items-center gap-1.5 self-end rounded-lg border border-border px-3 text-[13px] leading-none text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
      <ArrowRight className="size-3.5" aria-hidden />
    </Link>
  );
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [home, t] = await Promise.all([
    getHome(locale),
    getTranslations({ locale, namespace: "home" }),
  ]);
  const { profile } = home;
  const projects = home.featuredProjects.slice(0, HOME_LIST_LIMIT);
  const githubHandle = githubUsernameFromSocials(profile.socials);
  const githubUsername = GITHUB_USERNAME ?? githubHandle ?? DEFAULT_GITHUB_USERNAME;
  const githubLabel = GITHUB_USERNAME ?? githubHandle ?? DEFAULT_GITHUB_LABEL;
  const githubContributions = SHOW_BUILD_SECTION
    ? await getGithubContributions(githubUsername)
    : null;
  const url = localeUrl(locale, "/");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    url,
    worksFor: {
      "@type": "Organization",
      name: profile.name,
      url,
    },
    sameAs: profile.socials.map((social) => social.url),
  };

  return (
    <main className="mx-auto flex w-full max-w-[480px] flex-col gap-10 px-4 pt-7 pb-10 tablet:px-0 desktop:max-w-[540px] desktop:pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      {/* Extra 40px below: the intro stands apart from the sections that lead elsewhere. */}
      <div className="mb-10">
        <LabeledSection label={t("about")} labelOffset={NAME_OFFSET}>
          <ProfileCard locale={locale} profile={profile} />
        </LabeledSection>
      </div>

      {projects.length > 0 ? (
        <LabeledSection label={t("work")}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  locale={locale}
                  priority={index === 0}
                />
              ))}
            </div>
            <ViewAllLink href={localeHref(locale, "/work")} label={t("viewAll")} />
          </div>
        </LabeledSection>
      ) : null}

      {SHOW_BUILD_SECTION ? (
        <LabeledSection label={t("build")} labelOffset={CARD_TEXT_OFFSET}>
          <GithubCard
            locale={locale}
            username={githubUsername}
            label={githubLabel}
            contributions={githubContributions}
          />
        </LabeledSection>
      ) : null}

      {LINKS.length > 0 ? (
        <LabeledSection label={t("links")} labelOffset={CARD_TEXT_OFFSET}>
          <LinksList locale={locale} />
        </LabeledSection>
      ) : null}

      <SiteFooter locale={locale} />
    </main>
  );
}
