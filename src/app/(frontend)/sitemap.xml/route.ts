import { getPayload } from "payload";
import config from "@payload-config";
import { getProductSitemapEntries } from "@/lib/getProducts";
import { DEFAULT_LOCALE, LOCALES, localeHref } from "@/lib/i18n/locales";

const BASE_URL = "https://gmsturbo.ge";

/**
 * Written by hand rather than through Next's `sitemap.ts` convention, for one
 * reason: the `<?xml-stylesheet?>` line below. `MetadataRoute.Sitemap` returns
 * an array and Next serialises it, so there is no hook for a processing
 * instruction — and without one, what a person sees when they open this URL is
 * whatever their browser happens to do with bare XML. Chrome and Firefox draw
 * a collapsible tree; Safari has no XML viewer at all and reflows every text
 * node into one grey paragraph. The stylesheet in sitemap.xsl makes all three
 * render the same readable table. Crawlers ignore it — it is a rendering hint,
 * not part of the sitemap protocol.
 *
 * Generated per request, not at build time.
 *
 * Next would otherwise prerender this, which means opening a Postgres
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
  { path: "/", global: "home", listsProducts: true, changeFrequency: "weekly", priority: "1.0" },
  { path: "/catalog", global: "catalog", listsProducts: true, changeFrequency: "weekly", priority: "0.9" },
  { path: "/showroom", global: "showroom", listsProducts: false, changeFrequency: "monthly", priority: "0.7" },
  { path: "/contact", global: "contact", listsProducts: false, changeFrequency: "monthly", priority: "0.6" },
] as const;

/** Only `&` and `<` can occur in these URLs, but escaping is what keeps one
    ampersand in a slug from making the whole document unparseable. */
function xml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

type Route = {
  path: string;
  changeFrequency: string;
  priority: string;
  lastModified: Date;
};

/**
 * One `<url>` per locale, each carrying the full `xhtml:link` set.
 *
 * Every page exists in both languages, so listing one without pointing at its
 * translation is what makes /ka/catalog and /en/catalog look like duplicates
 * competing for the same ranking — this is the sitemap half of the hreflang
 * tags in the page head.
 */
function urlEntries(route: Route): string {
  const alternates = [
    ...LOCALES.map(
      (l) =>
        `  <xhtml:link rel="alternate" hreflang="${l}" href="${xml(`${BASE_URL}${localeHref(l, route.path)}`)}"/>`,
    ),
    `  <xhtml:link rel="alternate" hreflang="x-default" href="${xml(`${BASE_URL}${localeHref(DEFAULT_LOCALE, route.path)}`)}"/>`,
  ].join("\n");

  return LOCALES.map((locale) =>
    [
      "<url>",
      `  <loc>${xml(`${BASE_URL}${localeHref(locale, route.path)}`)}</loc>`,
      alternates,
      `  <lastmod>${route.lastModified.toISOString()}</lastmod>`,
      `  <changefreq>${route.changeFrequency}</changefreq>`,
      `  <priority>${route.priority}</priority>`,
      "</url>",
    ].join("\n"),
  ).join("\n");
}

export async function GET() {
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

  const routes: Route[] = [
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
      changeFrequency: "monthly",
      priority: "0.8",
      lastModified: p.updatedAt,
    })),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...routes.map(urlEntries),
    "</urlset>",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Crawlers re-fetch this often; a minute of edge caching keeps a crawl
      // burst off Postgres without delaying a newly published product.
      "Cache-Control": "public, max-age=0, s-maxage=60, must-revalidate",
    },
  });
}
