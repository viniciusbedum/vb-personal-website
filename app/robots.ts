import { siteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";

// Every page: English at the root, Portuguese under /br.
const allow = ["/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ["Googlebot", "Bingbot", "*"],
        allow,
      },
      {
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "anthropic-ai",
          "PerplexityBot",
          "Google-Extended",
          "CCBot",
        ],
        allow,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
