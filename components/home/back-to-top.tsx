"use client";

import { ArrowUp } from "@phosphor-icons/react";

export type BackToTopProps = {
  label: string;
  className?: string;
};

/** Scrolls the page back to the top (instantly with reduced motion). */
export function BackToTop({ label, className }: BackToTopProps) {
  function handleClick() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {label}
      <ArrowUp className="size-3.5" aria-hidden />
    </button>
  );
}
