import type { Lang } from "./dictionary";

/**
 * The URL locale segment. Every page lives under one — /ka/catalog, /en/catalog
 * — so each language is a real, indexable, shareable URL instead of a
 * localStorage flag flipped after hydration.
 *
 * These strings are also Payload's locale codes (see the `localization` block
 * in payload.config.ts), so a route param can be handed straight to a query.
 * `Lang` ("KA"/"EN") is the older uppercase spelling the static dictionary and
 * the client components use; toLang bridges the two.
 */
export const LOCALES = ["ka", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * Georgian is the default: the shop is in Tbilisi and most visitors arrive
 * expecting it. `/` and any unprefixed path redirect here (see middleware.ts).
 */
export const DEFAULT_LOCALE: Locale = "ka";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function toLang(locale: Locale): Lang {
  return locale === "ka" ? "KA" : "EN";
}

export function toLocale(lang: Lang): Locale {
  return lang === "KA" ? "ka" : "en";
}

/**
 * Prefixes an app-absolute path with the locale: ("en", "/catalog") ->
 * "/en/catalog". Internal links must go through this, otherwise following one
 * silently drops the reader back to the default language.
 */
export function localeHref(locale: Locale, path: string): string {
  if (path === "/") return `/${locale}`;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Swaps the locale on the current path, keeping the rest of it: used by the
 * language toggle so switching language stays on the same page rather than
 * bouncing to the homepage.
 */
export function switchLocalePath(pathname: string, next: Locale): string {
  const segments = pathname.split("/");
  // ["", "ka", "catalog"] — segment 1 is the locale when one is present.
  if (segments.length > 1 && isLocale(segments[1])) {
    segments[1] = next;
    return segments.join("/") || `/${next}`;
  }
  return localeHref(next, pathname);
}
