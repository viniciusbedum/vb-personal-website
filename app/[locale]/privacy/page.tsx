import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getHome } from "@/lib/content/home";
import { isViewCounterEnabled } from "@/lib/views";
import { localeAlternates, localeUrl } from "@/i18n/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  const url = localeUrl(locale, "/privacy");

  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: url,
      languages: localeAlternates("/privacy"),
    },
  };
}

/**
 * Cookies and privacy page, linked from the Dock's settings menu. The site
 * only stores the chosen language, so this informs; it doesn't ask for
 * consent. When analytics or pixels are added, list them here and add a
 * consent banner (see the log).
 */
export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, home] = await Promise.all([
    getTranslations({ locale, namespace: "privacy" }),
    getHome(locale),
  ]);
  const email = home.profile.email;
  const sectionTitle =
    "font-mono text-[13px] leading-[0.8] tracking-[0.6px] uppercase text-muted-foreground";

  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-col px-4 py-10 text-[15px] leading-[1.5] tablet:px-0">
      <p className={`flex h-8 items-center desktop:h-auto ${sectionTitle}`}>
        {t("eyebrow")}
      </p>
      <h1 className="mt-0 text-[32px] leading-[1.15] text-foreground desktop:mt-5">
        {t("title")}
      </h1>
      <p className="mt-4 text-muted-foreground">{t("intro")}</p>

      <h2 className={`mt-12 ${sectionTitle}`}>{t("storedTitle")}</h2>
      <p className="mt-4 text-foreground">
        {t.rich("storedText", {
          code: (chunks) => (
            <code className="rounded-md border border-border bg-secondary px-1.5 py-0.5 font-mono text-[13px]">
              {chunks}
            </code>
          ),
        })}
      </p>

      <h2 className={`mt-12 ${sectionTitle}`}>{t("notStoredTitle")}</h2>
      <p className="mt-4 text-foreground">{t("notStoredText")}</p>

      {isViewCounterEnabled() ? (
        <>
          <h2 className={`mt-12 ${sectionTitle}`}>{t("counterTitle")}</h2>
          <p className="mt-4 text-foreground">{t("counterText")}</p>
        </>
      ) : null}

      <h2 className={`mt-12 ${sectionTitle}`}>{t("controlTitle")}</h2>
      <p className="mt-4 text-foreground">{t("controlText")}</p>

      {email ? (
        <>
          <h2 className={`mt-12 ${sectionTitle}`}>{t("contactTitle")}</h2>
          <p className="mt-4 text-foreground">
            {t("contactText")}{" "}
            <a
              href={`mailto:${email}`}
              className="underline underline-offset-4 transition-colors hover:text-muted-foreground"
            >
              {email}
            </a>
          </p>
        </>
      ) : null}

      <p className="mt-12 text-muted-foreground">{t("updated")}</p>
    </main>
  );
}
