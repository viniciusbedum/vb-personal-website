"use client";

import { useSyncExternalStore } from "react";
import { ScrambleText } from "./scramble-text";

const TIME_ZONE = "America/Sao_Paulo";

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}

export type LiveClockProps = {
  locale: string;
  className?: string;
};

/**
 * Current time in São Paulo: 12h ("7:50 PM") in en,
 * 24h ("19:50") in pt. The server snapshot is null, so SSR and hydration
 * render a blank placeholder and the time only appears on the client
 * (no hydration mismatch); it then scrambles in once.
 */
export function LiveClock({ locale, className }: LiveClockProps) {
  const time = useSyncExternalStore(
    subscribe,
    () =>
      new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", {
        hour: locale === "en" ? "numeric" : "2-digit",
        minute: "2-digit",
        hour12: locale === "en",
        timeZone: TIME_ZONE,
      }).format(new Date()),
    () => null,
  );

  return (
    <p className={className}>
      {time ? <ScrambleText text={time} /> : " "}
    </p>
  );
}
