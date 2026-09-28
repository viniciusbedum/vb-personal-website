import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { localeHref } from "@/i18n/navigation";

/** Branded 404 for unknown slugs and unknown paths under a locale. */
export default function LocaleNotFound() {
  const t = useTranslations("notFound");
  const locale = useLocale();

  return (
    <main className="mx-auto flex w-full max-w-[480px] flex-col gap-3 px-4 py-10 text-[15px] leading-[1.5] tablet:px-0 desktop:max-w-[540px]">
      <h1 className="text-foreground">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <Link
        href={localeHref(locale, "/")}
        className={buttonVariants({ variant: "secondary", className: "mt-3 w-fit" })}
      >
        {t("home")}
      </Link>
    </main>
  );
}
