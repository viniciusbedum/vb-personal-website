"use client";

import Link from "next/link";
import { localeHref, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FolderOpen, House, type Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { SettingsMenu } from "./settings-menu";

export type DockProps = {
  locale: string;
};

type DockItem = {
  key: "home" | "work";
  href: string;
  label: string;
  icon: Icon;
};

/**
 * Site navigation shell:
 * - desktop (>= 1200px): fixed 65px icon dock on the left, icons vertically
 *   centred with a hover tooltip, settings menu (language) at the bottom;
 * - below 1200px: fixed 64px translucent, blurred tab bar at the bottom of
 *   the viewport (page content scrolls behind it); the settings menu sits at
 *   the top right of the page and scrolls away.
 * Page content must be wrapped in a
 * `.shell-main` sibling rendered after the Dock (see app/globals.css).
 */
export function Dock({ locale }: DockProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const section = pathname.split("/").filter(Boolean)[0];

  const active: DockItem["key"] = section === "work" ? "work" : "home";

  const items: DockItem[] = [
    { key: "home", href: localeHref(locale, "/"), label: t("nav.home"), icon: House },
    { key: "work", href: localeHref(locale, "/work"), label: t("nav.work"), icon: FolderOpen },
  ];

  const linkClass = (key: DockItem["key"]) =>
    cn(
      "transition-colors",
      key === active ? "text-white" : "text-muted-foreground hover:text-foreground",
    );

  return (
    <div data-dock="">
      <nav
        aria-label={t("shell.mainNav")}
        className="fixed inset-y-0 left-0 z-40 hidden w-[65px] bg-background shadow-[inset_-1px_0_0_var(--color-border)] desktop:block"
      >
        <ul className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-5">
          {items.map(({ key, href, label, icon: Icon }) => (
            <li key={key} className="relative size-6">
              <Link
                href={href}
                aria-label={label}
                aria-current={key === active ? "page" : undefined}
                className={cn("group flex size-6", linkClass(key))}
              >
                <Icon className="size-6" weight="regular" aria-hidden />
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-0 left-9 z-50 flex h-6 items-center rounded-md bg-border px-1.5 text-xs whitespace-nowrap text-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <SettingsMenu
          locale={locale}
          side="right"
          className="absolute bottom-6 left-1/2 size-6 -translate-x-1/2"
        />
      </nav>

      {/* Glass bar: translucent + 6px blur, so content scrolls faintly behind
          it without fighting the icons (solid background where blur is unsupported). */}
      <nav
        aria-label={t("shell.mainNav")}
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center border-t border-border bg-background px-4 backdrop-blur-[6px] supports-[backdrop-filter]:bg-background/65 tablet:justify-center tablet:gap-[75px] desktop:hidden"
      >
        {items.map(({ key, href, label, icon: Icon }) => (
          <Link
            key={key}
            href={href}
            aria-label={label}
            aria-current={key === active ? "page" : undefined}
            className={cn(
              "flex h-full flex-1 items-center justify-center tablet:flex-none",
              linkClass(key),
            )}
          >
            <Icon className="size-6" weight="regular" aria-hidden />
          </Link>
        ))}
      </nav>

      {/* Below 1200px the settings button sits quietly at the top right of the page. */}
      <SettingsMenu
        locale={locale}
        side="bottom"
        className="absolute top-10 right-4 z-40 size-8 desktop:hidden"
      />
    </div>
  );
}
