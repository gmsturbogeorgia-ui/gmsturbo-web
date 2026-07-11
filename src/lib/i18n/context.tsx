"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dict, type Lang } from "./dictionary";

const STORAGE_KEY = "gms-turbo-lang";

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
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translate a dotted key path, e.g. t("home.heroTitle"). Falls back to EN, then the key itself. */
  t: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("KA");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "EN" || stored === "KA") setLangState(stored);
  }, []);

  // Keep <html lang="..."> in sync with the toggle. Needed for a11y/SEO, and
  // it also gives CSS a :lang(ka) hook to target Georgian (Kartuli) text —
  // e.g. bumping heading weight so it matches the Latin display font's punch.
  useEffect(() => {
    document.documentElement.lang = lang === "KA" ? "ka" : "en";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // localStorage unavailable (private browsing, etc.) — ignore.
    }
  };

  const t = useMemo(() => {
    return (path: string): string => {
      const value = getPath(dict[lang], path) ?? getPath(dict.EN, path);
      return typeof value === "string" ? value : path;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

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
