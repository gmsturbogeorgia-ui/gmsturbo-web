import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import { getProductSitemapEntries } from "@/lib/getProducts";
import { DEFAULT_LOCALE, LOCALES, localeHref } from "@/lib/i18n/locales";

const BASE_URL = "https://gmsturbo.ge";

/**
 * Generated per request, not at build time.
 *
 * Next prerenders sitemap.xml by default, which would mean opening a Postgres
 * connection during `next build` — and the build runs several workers at once,
 * so on a session-mode pooler (pool_size 15) that is exactly where connections
 * run out. Nothing else in this app touches the DB at build time: every page
 * is `force-dynamic`.
 *
 * Serving it dynamically also means a product added through /admin appears in
 * the sitemap immediately rather than at the next deploy.
 */
export const dynamic = "force-dynamic";

/**
 * Every page exists in both languages, so each one is listed once per locale
 * with an `alternates.languages` block pointing at its translations — the
 * sitemap equivalent of the hreflang tags in the page head. Without it the two
 * versions look like duplicate content competing for the same ranking.
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

/**
 * Whether a product slug can survive being pasted into a URL. A `/` in one
 * splits the route into two segments and a space is not a legal URL character
 * either way, so `/catalog/[productId]` never matches and the page 404s — see
 * the same rule enforced on save in src/collections/Products.ts. A sitemap
 * that advertises a 404 costs crawl budget and trains Google to distrust the
 * rest of the file, so anything left over from before that rule is dropped.
 */
const URL_SAFE_SLUG = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

/** The four editable pages, each backed by one Payload global. */
const PAGES = [
  { path: "/", global: "home", listsProducts: true, changeFrequency: "weekly", priority: 1.0 },
  { path: "/catalog", global: "catalog", listsProducts: true, changeFrequency: "weekly", priority: 0.9 },
  { path: "/showroom", global: "showroom", listsProducts: false, changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", global: "contact", listsProducts: false, changeFrequency: "monthly", priority: 0.6 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config });

  // Product slugs are the same in both languages; one fetch is enough.
  const [products, globals] = await Promise.all([
    getProductSitemapEntries(),
    Promise.all(
      PAGES.map((page) =>
        payload.findGlobal({ slug: page.global, depth: 0, select: { updatedAt: true } }),
      ),
    ),
  ]);

  const published = products.filter((p) => URL_SAFE_SLUG.test(p.id));

  /**
   * `lastmod` is a claim about the page, not about the request, so it has to
   * come out of the data: the global behind the page, and — for the two that
   * render product cards — the newest product, since adding one changes what
   * those pages show without touching their own document. Stamping
   * `new Date()` here instead would tell Google every page changed on every
   * crawl, which is exactly the signal it learns to ignore.
   */
  const newestProduct = published.reduce<Date | null>(
    (latest, p) => (!latest || p.updatedAt > latest ? p.updatedAt : latest),
    null,
  );

  const routes = [
    ...PAGES.map((page, i) => {
      const editedAt = new Date(globals[i].updatedAt);
      return {
        path: page.path,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        lastModified:
          page.listsProducts && newestProduct && newestProduct > editedAt
            ? newestProduct
            : editedAt,
      };
    }),
    ...published.map((p) => ({
      path: `/catalog/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      lastModified: p.updatedAt,
    })),
  ];

  return routes.flatMap(({ path, changeFrequency, priority, lastModified }) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}${localeHref(locale, path)}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: alternatesFor(path),
    })),
  );
}
