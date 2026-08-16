"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useMemo } from "react";
import { dict, type Lang } from "./dictionary";
import {
  switchLocalePath,
  toLang,
  toLocale,
  type Locale,
} from "./locales";

const LOCALE_COOKIE = "gms-turbo-locale";

function getPath(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc != null && typeof acc === "object"
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      obj,
    );
}

type LanguageContextValue = {
  /** Uppercase spelling used by the static dictionary and the components. */
  lang: Lang;
  /** Lowercase URL/Payload spelling of the same thing. */
  locale: Locale;
  /** Navigates to the same page in the other language. */
  setLang: (l: Lang) => void;
  /** Translate a dotted key path, e.g. t("home.heroTitle"). Falls back to EN, then the key itself. */
  t: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

/**
 * The current language now comes from the URL (/ka/… or /en/…), passed down
 * by the locale layout, rather than from localStorage read after mount.
 *
 * That removes the old first-paint flash — the server already rendered the
 * right language — and makes the choice shareable, since the URL carries it.
 * Switching language is a navigation, not a setState.
 */
export function LanguageProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const lang = toLang(locale);

  const setLang = useCallback(
    (next: Lang) => {
      const nextLocale = toLocale(next);
      if (nextLocale === locale) return;
      // Remembered so that typing the bare domain later lands on the language
      // last chosen — middleware.ts reads this cookie. Not the source of
      // truth for the current page; the URL is.
      document.cookie = `${LOCALE_COOKIE}=${nextLocale};path=/;max-age=31536000;samesite=lax`;
      router.push(switchLocalePath(pathname, nextLocale));
    },
    [locale, pathname, router],
  );

  const t = useMemo(() => {
    return (path: string): string => {
      const value = getPath(dict[lang], path) ?? getPath(dict.EN, path);
      return typeof value === "string" ? value : path;
    };
  }, [lang]);

  const value = useMemo(
    () => ({ lang, locale, setLang, t }),
    [lang, locale, setLang, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
