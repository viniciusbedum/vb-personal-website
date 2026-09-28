"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { localeHref } from "@/i18n/navigation";

const buttonClass = buttonVariants({ variant: "secondary" });

/**
 * Error boundary for every [locale] page: a short,
 * localized message with a retry instead of the raw Next error page.
 */
export default function LocaleError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useTranslations("error");
  const locale = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-[480px] flex-col gap-3 px-4 py-10 text-[15px] leading-[1.5] tablet:px-0 desktop:max-w-[540px]">
      <h1 className="text-foreground">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <div className="mt-3 flex gap-3">
        <button type="button" onClick={() => retry()} className={buttonClass}>
          {t("retry")}
        </button>
        <Link href={localeHref(locale, "/")} className={buttonClass}>
          {t("home")}
        </Link>
      </div>
    </main>
  );
}
