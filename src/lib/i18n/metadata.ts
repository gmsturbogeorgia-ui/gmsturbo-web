import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALES, localeHref, type Locale } from "./locales";

/**
 * `alternates` for a page that exists in both languages.
 *
 * `canonical` points at this language's own URL, and `languages` lists every
 * translation — that's the hreflang set, which is what stops /ka/catalog and
 * /en/catalog from being read as duplicates competing for the same ranking.
 * `x-default` is what a searcher with no matching language preference gets.
 *
 * `path` is the unprefixed route, e.g. "/catalog" or "/" for the homepage.
 */
export function localeAlternates(
  locale: Locale,
  path: string,
): Metadata["alternates"] {
  return {
    canonical: localeHref(locale, path),
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, localeHref(l, path)])),
      "x-default": localeHref(DEFAULT_LOCALE, path),
    },
  };
}

/**
 * The social share card used by every page that isn't a product — the home
 * page, the catalog and the showroom. Product pages override it with their own
 * photo (see src/app/(frontend)/[locale]/catalog/[productId]/page.tsx).
 *
 * The dimensions are spelled out rather than left for the scraper to discover:
 * Facebook renders a small, text-only card on its first visit to a URL when it
 * has to fetch the image before it knows the shape, and that first render is
 * the one it caches. 1200x630 is the 1.91:1 ratio Facebook, LinkedIn and
 * X all crop to, so the banner is used whole by all three.
 */
export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "GMS Turbo Georgia - turbocharger sales, rebuilds and diagnostics",
} as const;
