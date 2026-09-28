import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/**
 * Security headers on every response. None of them changes how the site
 * looks: they only tell the browser what the page may not do.
 */
const securityHeaders = [
  // Nobody else can put this site inside an iframe (clickjacking). Relax
  // `frame-ancestors` if you ever embed it yourself, e.g. in a demo page.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Frame-Options", value: "DENY" }, // same rule for older browsers
  // The browser must trust the declared file type, never guess it.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Outbound links get only your domain, not the full page URL.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site uses none of these browser features, so switch them off.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    // Placeholder thumbnails (public/placeholder-thumbnail.svg) are SVGs;
    // allow next/image to serve them safely until real images replace them.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withNextIntl(nextConfig);
