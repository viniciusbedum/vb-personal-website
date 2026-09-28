import { notFound } from "next/navigation";

/**
 * Catches unknown paths under a locale (e.g. /foo or /br/foo) so they render the
 * branded app/[locale]/not-found.tsx instead of Next's bare 404.
 */
export default function CatchAllPage() {
  notFound();
}
