"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DURATION_MS = 1200;
const FRAME_MS = 50;

function scramble(text: string, revealed: number) {
  let out = text.slice(0, revealed);
  for (let i = revealed; i < text.length; i++) {
    out +=
      text[i] === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return out;
}

export type ScrambleTextProps = {
  text: string;
  className?: string;
};

/**
 * Reveals `text` left to right from random uppercase letters (used on the
 * location line). Plays once, the first time a
 * non-empty `text` arrives; later changes render directly.
 * The server render is the final text (no hydration mismatch, readable
 * without JS). Skipped under `prefers-reduced-motion: reduce`.
 * Screen readers get the real text; the animated copy is aria-hidden.
 */
export function ScrambleText({ text, className }: ScrambleTextProps) {
  const [display, setDisplay] = useState<string | null>(null);
  const played = useRef(false);

  useEffect(() => {
    if (
      !text ||
      played.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const start = performance.now();
    let last = -Infinity;
    let frame = requestAnimationFrame(function tick(now) {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      if (progress === 1) {
        played.current = true;
        setDisplay(null);
        return;
      }
      if (now - last >= FRAME_MS) {
        last = now;
        setDisplay(scramble(text, Math.floor(progress * text.length)));
      }
      frame = requestAnimationFrame(tick);
    });

    return () => cancelAnimationFrame(frame);
  }, [text]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{display ?? text}</span>
    </span>
  );
}
