"use client";

import { useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";

export type SharePageProps = {
  url: string;
  label: string;
  hint: string;
  /** Left column (the footer pill). */
  children: React.ReactNode;
  /** Shown above "Share page" in the right column (the visit counter). */
  counter?: React.ReactNode;
};

/**
 * Footer row: `children` on the left and, on the
 * right, a column with the visit counter (when on) and "Share page" below.
 * A click on "Share page" reveals the page URL full width underneath, in a
 * read-only field selected so it can be copied right away.
 */
export function SharePage({
  url,
  label,
  hint,
  children,
  counter,
}: SharePageProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="grid grid-cols-2 items-center gap-4">
        <div>{children}</div>
        <div className="flex flex-col items-end gap-3">
          {counter}
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex cursor-pointer items-center gap-1 text-foreground uppercase underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {label}
            <ArrowUpRight className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
      {open ? (
        <div className="mt-6 flex flex-col gap-3">
          <span className="text-muted-foreground">{hint}</span>
          {/* iOS Safari zooms into any field under 16px, so on mobile the input
              keeps a 16px font and is scaled down to 14px (16 x 0.875) inside
              a frame; from tablet up it is a plain 13px field. */}
          <div className="flex h-12 w-full items-center overflow-hidden rounded-lg border border-border bg-secondary px-4 focus-within:border-muted-foreground">
            <input
              readOnly
              autoFocus
              value={url}
              aria-label={hint}
              onFocus={(event) => event.currentTarget.select()}
              className="w-[114.2857%] shrink-0 origin-left scale-[0.875] bg-transparent text-base text-foreground uppercase outline-none tablet:w-full tablet:scale-100 tablet:text-[13px]"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
