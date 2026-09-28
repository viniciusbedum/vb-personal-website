"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ProjectCategory } from "@/lib/content/categories";
import { cn } from "@/lib/utils";
import { localeHref } from "@/i18n/navigation";

export type WorkGalleryItem = {
  slug: string;
  category?: ProjectCategory;
  node: React.ReactNode;
};

function pillClass(isActive: boolean): string {
  return cn(
    "inline-flex h-8 shrink-0 items-center rounded-lg border px-3 text-[13px] leading-none whitespace-nowrap transition-colors",
    isActive
      ? "border-border bg-secondary text-foreground"
      : "border-border text-muted-foreground hover:text-foreground",
  );
}

export type WorkGalleryProps = {
  locale: string;
  items: WorkGalleryItem[];
  /** Only non-empty categories, in `PROJECT_CATEGORIES` order. */
  categories: { value: ProjectCategory; label: string }[];
  allLabel: string;
  /** aria-label of the pill nav. */
  filterLabel: string;
};

/**
 * Pure view for the Work hub: category pill nav plus a filtered grid.
 * No URL access — used as the Suspense fallback for `WorkGallery` with
 * `active` left undefined ("Todos").
 */
export function WorkGalleryView({
  locale,
  items,
  categories,
  allLabel,
  filterLabel,
  active,
}: WorkGalleryProps & { active?: ProjectCategory }) {
  const visibleItems = items.filter(
    (item) => !active || item.category === active,
  );

  return (
    <div>
      <nav aria-label={filterLabel}>
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href={localeHref(locale, "/work")}
            scroll={false}
            replace
            aria-current={active === undefined ? "page" : undefined}
            className={pillClass(active === undefined)}
          >
            {allLabel}
          </Link>
          {categories.map((category) => (
            <Link
              key={category.value}
              href={localeHref(locale, {
                pathname: "/work",
                query: { category: category.value },
              })}
              scroll={false}
              replace
              aria-current={active === category.value ? "page" : undefined}
              className={pillClass(active === category.value)}
            >
              {category.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="mt-4 grid grid-cols-2 gap-4 desktop:grid-cols-4">
        {visibleItems.map((item) => (
          <div key={item.slug}>{item.node}</div>
        ))}
      </div>
    </div>
  );
}

/**
 * Reads `?category=` from the URL and renders `WorkGalleryView`.
 * Client component — must be rendered inside a `Suspense` boundary.
 */
export function WorkGallery(props: WorkGalleryProps) {
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category");
  const active = props.categories.find(
    (category) => category.value === rawCategory,
  )?.value;

  return <WorkGalleryView {...props} active={active} />;
}
