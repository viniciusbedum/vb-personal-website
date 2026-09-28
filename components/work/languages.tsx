import { getTranslations } from "next-intl/server";
import { Translate } from "@phosphor-icons/react/ssr";
import { LANGUAGES } from "@/lib/content/languages";

type LanguagesProps = {
  locale: string;
};

/**
 * "Languages" section for the Work page (the page reads like an
 * interactive CV): one row per language, the Phosphor translate icon as
 * the bullet, name and level in muted grey.
 */
export async function Languages({ locale }: LanguagesProps) {
  if (LANGUAGES.length === 0) return null;

  const t = await getTranslations({ locale, namespace: "work" });
  const lang = locale === "en" ? "en" : "pt";

  return (
    <section>
      <h2 className="font-mono text-[13px] leading-[0.8] tracking-[0.6px] uppercase text-muted-foreground">
        {t("languagesTitle")}
      </h2>
      <ul className="mt-5 flex flex-col gap-3">
        {LANGUAGES.map((language) => (
          <li
            key={language.name.en}
            className="flex items-center gap-3 text-[15px] leading-[1.5]"
          >
            <Translate
              className="size-[18px] shrink-0 text-muted-foreground"
              weight="regular"
              aria-hidden
            />
            <span className="text-foreground">{language.name[lang]}</span>
            <span className="text-muted-foreground">{language.level[lang]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
