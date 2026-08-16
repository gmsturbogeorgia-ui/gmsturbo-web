import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/getProducts";
import { DEFAULT_LOCALE, LOCALES, localeHref } from "@/lib/i18n/locales";

const BASE_URL = "https://gmsturbo.ge";

/**
 * Every page exists in both languages, so each one is listed once per locale
 * with an `alternates.languages` block pointing at its translations — the
 * sitemap equivalent of the hreflang tags in the page head. Without it the two
 * versions look like duplicate content competing for the same ranking.
 *
 * Products come from the DB rather than the seed array, so anything added
 * through /admin is in the sitemap without a redeploy.
 */
function alternatesFor(path: string) {
  return {
    languages: {
      ...Object.fromEntries(
        LOCALES.map((l) => [l, `${BASE_URL}${localeHref(l, path)}`]),
      ),
      "x-default": `${BASE_URL}${localeHref(DEFAULT_LOCALE, path)}`,
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Product slugs are the same in both languages; one fetch is enough.
  const products = await getProducts(DEFAULT_LOCALE);

  const routes: { path: string; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/catalog", changeFrequency: "weekly", priority: 0.9 },
    { path: "/showroom", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
    ...products.map((p) => ({
      path: `/catalog/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  return routes.flatMap(({ path, changeFrequency, priority }) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}${localeHref(locale, path)}`,
      changeFrequency,
      priority,
      alternates: alternatesFor(path),
    })),
  );
}
