"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Label shown for each locale; Portuguese reads "BR" like its URL prefix. */
const LOCALE_LABEL: Record<string, string> = { en: "en", pt: "br" };

export type LanguageSwitcherProps = {
  locale: string;
  className?: string;
  /** Called when a locale is picked (the settings menu closes itself). */
  onSelect?: () => void;
};

/**
 * Same page in the other locale (e.g. /work -> /br/work); the ?category=
 * filter is not carried over. next-intl's Link also updates the locale cookie, so the bare
 * URL (English) isn't redirected back to /br. Rendered as pills inside the
 * Dock's settings menu.
 */
export function LanguageSwitcher({
  locale,
  className,
  onSelect,
}: LanguageSwitcherProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label={t("languageSwitch")}
      className={cn("flex items-center gap-1 font-mono text-xs", className)}
    >
      {routing.locales.map((loc) => {
        const active = loc === locale;

        return (
          <Link
            key={loc}
            href={pathname}
            locale={loc}
            hrefLang={loc === "pt" ? "pt-BR" : loc}
            aria-current={active ? "page" : undefined}
            onClick={onSelect}
            className={cn(
              "inline-flex h-7 items-center rounded-lg border px-2.5 uppercase transition-colors",
              active
                ? "border-border bg-background text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {LOCALE_LABEL[loc] ?? loc}
          </Link>
        );
      })}
    </div>
  );
}
