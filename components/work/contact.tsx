import { getTranslations } from "next-intl/server";
import { CalendarBlank } from "@phosphor-icons/react/ssr";
import { buttonVariants } from "@/components/ui/button";
import { CopyEmailButton } from "@/components/home/copy-email-button";
import { BOOKING_URL } from "@/lib/content/contact";

type ContactProps = {
  locale: string;
  email?: string;
  /** "Available for new projects" line under the title (`PROFILE.availability`). */
  availability?: string;
};

/**
 * "Let's keep in touch" section closing the Work page: the availability
 * line (green dot) under the title, a short invite and
 * two buttons, "Book call" (`BOOKING_URL`) and "Copy email" (profile email).
 * No form, so it needs no email service. Each button hides without its
 * data; with neither, the section is not rendered.
 */
export async function Contact({ locale, email, availability }: ContactProps) {
  if (!BOOKING_URL && !email) return null;

  const [t, tHome] = await Promise.all([
    getTranslations({ locale, namespace: "work" }),
    getTranslations({ locale, namespace: "home" }),
  ]);

  return (
    <section>
      <h2 className="font-mono text-[13px] leading-[0.8] tracking-[0.6px] uppercase text-muted-foreground">
        {t("contactTitle")}
      </h2>
      {availability ? (
        <p className="mt-5 flex items-center gap-2 text-[15px] leading-[1.5] text-subtle">
          <span className="relative flex size-4 items-center justify-center" aria-hidden>
            <span className="absolute size-2 animate-ping rounded-full bg-brand/30 motion-reduce:animate-none" />
            <span className="relative size-2 rounded-full bg-brand" />
          </span>
          {availability}
        </p>
      ) : null}
      <p className="mt-4 max-w-[600px] text-[24px] leading-[1.3] text-muted-foreground">
        {t("contactText")}
      </p>
      <div className="mt-8 grid max-w-[540px] grid-cols-1 gap-3 tablet:grid-cols-2">
        {BOOKING_URL ? (
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "secondary", className: "w-full" })}
          >
            {t("bookCall")}
            <CalendarBlank className="size-[18px] text-muted-foreground" weight="regular" aria-hidden />
          </a>
        ) : null}
        {email ? (
          <CopyEmailButton
            email={email}
            label={tHome("copyEmail")}
            copiedLabel={tHome("copied")}
            className={buttonVariants({ variant: "secondary", className: "w-full cursor-pointer" })}
          />
        ) : null}
      </div>
    </section>
  );
}
