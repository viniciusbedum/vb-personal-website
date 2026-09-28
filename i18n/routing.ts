import { defineRouting } from "next-intl/routing";

/**
 * English is the default and lives at the bare URL (/work); Portuguese
 * gets the /br prefix (/br/work). The locale code stays "pt" internally
 * (messages, content data, date formats).
 */
export const routing = defineRouting({
  locales: ["en", "pt"],
  defaultLocale: "en",
  localePrefix: {
    mode: "as-needed",
    prefixes: { pt: "/br" },
  },
});
