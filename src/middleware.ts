import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/locales";

/**
 * Every page lives under a locale segment, so a request for /catalog has to
 * become /ka/catalog. Redirecting (not rewriting) is deliberate: the reader
 * ends up on the canonical URL in the address bar, which is what gets shared
 * and what search engines index.
 *
 * A returning visitor keeps the language they last chose — the toggle stores
 * it in a cookie (see src/lib/i18n/context.tsx), and it's read here so the
 * choice survives typing the bare domain. Falls back to Georgian.
 */
const LOCALE_COOKIE = "gms-turbo-locale";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const preferred = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = LOCALES.find((l) => l === preferred) ?? DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  /**
   * Skip everything that isn't a page: the Payload admin and its API, Next's
   * own assets, and any path with a file extension (favicon, og images, the
   * files under public/). Without the extension guard, /robots.txt would be
   * redirected to /ka/robots.txt and 404.
   */
  matcher: [
    "/((?!api|admin|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
