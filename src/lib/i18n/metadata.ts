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
