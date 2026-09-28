"use client";

import { useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { Cookie, DotsThreeVertical, Translate } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";

export type SettingsMenuProps = {
  locale: string;
  /** Where the panel opens: beside the desktop dock or below the mobile button. */
  side: "right" | "bottom";
  className?: string;
};

/**
 * Small preferences panel behind a "more" button in the Dock. Each row is a
 * label plus its options: the language (EN / BR), then a link to the
 * cookies and privacy page. New rows, like a light/dark theme switch, go
 * under the language one.
 */
export function SettingsMenu({ locale, side, className }: SettingsMenuProps) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label={t("settings")}
        className={cn(
          "flex cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground data-[popup-open]:text-white",
          className,
        )}
      >
        <DotsThreeVertical className="size-6" weight="regular" aria-hidden />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          side={side}
          align="end"
          // Desktop: clear the 65px dock's border (icon centred at 32.5px).
          sideOffset={side === "right" ? 32 : 8}
          className="z-50"
        >
          <Popover.Popup className="flex min-w-[200px] flex-col gap-3 rounded-xl border border-border bg-secondary p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)] outline-none transition-[scale,opacity] duration-100 ease-out data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0">
            <Popover.Title className="sr-only">{t("settings")}</Popover.Title>
            <div className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2 font-mono text-[13px] tracking-[0.6px] uppercase text-muted-foreground">
                <Translate className="size-4" weight="regular" aria-hidden />
                {t("languageSwitch")}
              </span>
              <LanguageSwitcher locale={locale} onSelect={() => setOpen(false)} />
            </div>
            <Link
              href="/privacy"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 border-t border-border pt-3 font-mono text-[13px] tracking-[0.6px] uppercase text-muted-foreground transition-colors hover:text-foreground"
            >
              <Cookie className="size-4" weight="regular" aria-hidden />
              {t("privacy")}
            </Link>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
