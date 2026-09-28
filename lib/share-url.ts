/**
 * Address of the page the visitor is on, without query or hash, for the
 * "Share page" field. It comes from the browser, so it is right on any
 * domain with no configuration (the site's official address, used for
 * canonical links and previews, is fixed at build time instead).
 */
export function currentPageUrl(location: {
  origin: string;
  pathname: string;
}): string {
  const path = location.pathname === "/" ? "" : location.pathname;
  return `${location.origin}${path}`;
}
