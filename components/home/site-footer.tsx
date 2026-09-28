import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { localeHref, localeUrl } from "@/i18n/navigation";
import { SharePage } from "./share-page";
import { BackToTop } from "./back-to-top";
import { ViewCounter } from "./view-counter";
import { isViewCounterEnabled } from "@/lib/views";

const pillClass =
  "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-foreground uppercase transition-colors hover:bg-secondary";

/** Template credit on the last line. */
const CREDIT = "@viniciusbedum";

type SiteFooterProps = {
  locale: string;
  /** Page path for "Share page", e.g. "/work". */
  path?: string;
  /** Left pill: "See my work" (home) or "Back to top" (Work page). */
  pill?: "work" | "top";
};

/**
 * Footer of the home and Work pages: divider, then two columns, a pill to the
 * Work page on the left and "Share page" (reveals the URL to copy) on the
 * right; a one-line credit closes the page.
 */
export async function SiteFooter({
  locale,
  path = "/",
  pill = "work",
}: SiteFooterProps) {
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <footer className="mt-10 border-t border-border pt-10 font-mono text-[13px] leading-[1.2] tracking-[0.6px] uppercase">
      <SharePage
        url={localeUrl(locale, path)}
        label={t("sharePage")}
        hint={t("shareHint")}
        counter={
          isViewCounterEnabled() ? (
            <ViewCounter locale={locale} label={t("views")} />
          ) : null
        }
      >
        {pill === "work" ? (
          <Link href={localeHref(locale, "/work")} className={pillClass}>
            {t("seeMyWork")}
          </Link>
        ) : (
          <BackToTop label={t("backToTop")} className={pillClass} />
        )}
      </SharePage>
      <p className="mt-16 text-muted-foreground">
        © {new Date().getFullYear()} by {CREDIT}
      </p>
    </footer>
  );
}
