"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";
import {
  DEFAULT_LOCALE,
  isLocale,
  localeHref,
  type Locale,
} from "@/lib/i18n/locales";

/**
 * `next/link` that keeps the reader in the language they're browsing.
 *
 * Every page lives under a locale segment, so a bare href="/catalog" would
 * bounce a Georgian reader out to the middleware and back through a redirect
 * — landing them on whatever the cookie says rather than the language they
 * were just reading. This prefixes app-absolute hrefs with the current
 * locale, so call sites keep writing plain paths.
 *
 * Anything that isn't an app-absolute path — external URLs, mailto:, tel:,
 * "#anchor" — is passed through untouched.
 */
export function useLocale(): Locale {
  // Read from the route rather than the language context so this works in any
  // client component, including ones rendered outside the providers.
  const params = useParams<{ locale?: string }>();
  const value = params?.locale;
  return typeof value === "string" && isLocale(value) ? value : DEFAULT_LOCALE;
}

type Props = React.ComponentProps<typeof NextLink>;

export function LocaleLink({ href, ...rest }: Props) {
  const locale = useLocale();
  const prefixed =
    typeof href === "string" && href.startsWith("/")
      ? localeHref(locale, href)
      : href;

  return <NextLink href={prefixed} {...rest} />;
}
