"use client";

import { useEffect, useState } from "react";

export type ViewCounterProps = {
  locale: string;
  /** Label with a {count} placeholder, e.g. "{count} profile views". */
  label: string;
};

const SESSION_KEY = "site-view-counted";

/**
 * Visit total for the footer. Counts once per browser session (later pages
 * only read), and renders nothing while the counter is off (see lib/views).
 */
export function ViewCounter({ locale, label }: ViewCounterProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let counted = false;
    try {
      counted = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Storage blocked: count this visit.
    }

    fetch("/api/views", { method: counted ? "GET" : "POST" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { count: number } | null) => {
        if (!data) return;
        setCount(data.count);
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // Storage blocked: nothing to remember.
        }
      })
      .catch(() => {});
  }, []);

  if (count === null) return null;

  const formatted = count.toLocaleString(locale === "pt" ? "pt-BR" : "en-US");
  return <span className="text-muted-foreground">{label.replace("{count}", formatted)}</span>;
}
