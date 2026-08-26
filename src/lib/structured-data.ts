import { dict } from "./i18n/dictionary";
import { localeHref, toLang, type Locale } from "./i18n/locales";
import { OG_IMAGE } from "./i18n/metadata";
import type { Product } from "./products";

/**
 * Every schema.org node the site emits, in one place.
 *
 * Two rules drive the shape of this file, and both were being broken by the
 * hand-written blobs that used to sit inside each page:
 *
 * 1. **URLs must be absolute.** JSON-LD is parsed on its own, with no notion
 *    of the document it arrived in — `metadataBase` and the page's own origin
 *    do not apply to it. A relative `"item": "/catalog"` is not a URL to a
 *    crawler, so a breadcrumb built from them is dropped whole, and a
 *    relative `image` costs the product snippet its picture.
 *
 * 2. **One business, one `@id`.** The layout, the contact page and the
 *    showroom page each declared their own `AutomotiveBusiness` with no
 *    identifier, which read as three unrelated shops — two of them on the
 *    same page as a third, one with an address and one without. The business
 *    is now defined once here, carries a stable `@id`, and everything else
 *    points at that `@id` instead of restating it.
 */
export const SITE_URL = "https://gmsturbo.ge";

/** Stable node identities. Anything referring to the business or the site as
    a whole links to these rather than repeating the fields. */
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Media URLs are already absolute when the R2 bucket is configured and
 * app-absolute when Payload serves the file itself (see src/lib/mediaUrl.ts),
 * so both have to be handled.
 *
 * Spaces are escaped because uploads are named by whoever had the photo —
 * "cruzi T.jpg", "hilux 2.5 1.jpg" — and a raw space is not a legal URL
 * character. A browser papers over it in `<img src>`, but a crawler fetching
 * the `image` out of JSON-LD has only the string, so the picture the product
 * snippet is built around would be the one thing that fails to load.
 */
export function absoluteUrl(path: string): string {
  const url = /^https?:\/\//.test(path)
    ? path
    : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  return url.replace(/ /g, "%20");
}

/** The absolute, language-prefixed URL of an app path: ("en", "/catalog") ->
    "https://gmsturbo.ge/en/catalog". */
export function localeUrl(locale: Locale, path: string): string {
  return `${SITE_URL}${localeHref(locale, path)}`;
}

const PHONE = "+995 551 24 42 22";
const EMAIL = "showroom@gmsturbo.ge";

/** The same three profiles the footer links. `sameAs` is how a search engine
    ties them to this business rather than to a similarly named one. */
const SAME_AS = [
  "https://www.instagram.com/turbogms/",
  "https://www.facebook.com/p/GMS-TURBO-61566147999204/",
  "https://www.tiktok.com/@gmsturbogeorgia",
];

/** Matches the map pin stored in the contact global — hardcoded rather than
    fetched, because this node renders on every page and the coordinates of a
    physical showroom are not per-request data. */
const GEO = { latitude: 41.697529, longitude: 44.886512 };

const OPENING_HOURS = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "10:00",
    closes: "18:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Saturday",
    opens: "11:00",
    closes: "17:00",
  },
];

const BUSINESS_DESCRIPTION: Record<Locale, string> = {
  ka: "ტურბოკომპრესორების გაყიდვა, დიაგნოსტიკა, აღდგენა და წარმადობის გადაწყვეტები თბილისში.",
  en: "Premium turbocharger sales, diagnostics, repair and performance solutions in Tbilisi, Georgia.",
};

/**
 * The shop itself. `AutomotiveBusiness` is a `LocalBusiness` subtype, so this
 * is the node the local rich result and the map panel are built from — which
 * is why the address, the hours and the coordinates all have to be on it, and
 * on every page, not only on /contact.
 */
export function businessNode(locale: Locale) {
  return {
    "@type": "AutomotiveBusiness",
    "@id": BUSINESS_ID,
    name: "GMS Turbo Georgia",
    url: localeUrl(locale, "/"),
    description: BUSINESS_DESCRIPTION[locale],
    image: absoluteUrl(OG_IMAGE.url),
    telephone: PHONE,
    email: EMAIL,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "71, Sakartvelos Ertianobistvis Mebrdzolta Street",
      addressLocality: "Tbilisi",
      postalCode: "0163",
      addressCountry: "GE",
    },
    geo: { "@type": "GeoCoordinates", ...GEO },
    areaServed: { "@type": "Country", name: "Georgia" },
    openingHoursSpecification: OPENING_HOURS,
    sameAs: SAME_AS,
  };
}

/** The site as an entity, published by the business above. */
export function websiteNode(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: localeUrl(locale, "/"),
    name: "GMS Turbo Georgia",
    inLanguage: locale === "ka" ? "ka-GE" : "en-US",
    publisher: { "@id": BUSINESS_ID },
  };
}

/**
 * A breadcrumb trail. `path` is the unprefixed route — the locale and the
 * origin are added here, because a `ListItem` whose `item` is a bare path is
 * what makes Google discard the whole trail.
 */
export function breadcrumbNode(
  locale: Locale,
  trail: { name: string; path: string }[],
) {
  // The last crumb is the page the trail is on, which is what the node is
  // identified by so the page node beside it can point at this one.
  const current = trail[trail.length - 1];
  return {
    "@type": "BreadcrumbList",
    "@id": `${localeUrl(locale, current.path)}#breadcrumb`,
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: localeUrl(locale, crumb.path),
    })),
  };
}

/**
 * A page that lists products — the homepage's featured four, the full
 * catalog, the showroom's highlights.
 *
 * The `ItemList` is the point: it is what makes a listing page eligible for
 * the product carousel, and it only works if each entry links to the page
 * that carries the matching `Product` node. The catalog used to bury this
 * under `hasPart` with bare relative paths, which is neither the shape Google
 * documents nor a set of resolvable links.
 */
export function collectionNode(
  locale: Locale,
  opts: {
    path: string;
    name: string;
    description?: string;
    products: Product[];
    /** Omitted on the homepage, which is the root of every trail. */
    trail?: { name: string; path: string }[];
  },
) {
  const url = localeUrl(locale, opts.path);
  return {
    "@type": opts.path === "/" ? "WebPage" : "CollectionPage",
    "@id": `${url}#page`,
    url,
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    inLanguage: locale === "ka" ? "ka-GE" : "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": BUSINESS_ID },
    ...(opts.trail
      ? {
          breadcrumb: {
            "@id": `${localeUrl(locale, opts.trail[opts.trail.length - 1].path)}#breadcrumb`,
          },
        }
      : {}),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.products.length,
      itemListElement: opts.products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        url: localeUrl(locale, `/catalog/${p.id}`),
      })),
    },
  };
}

/**
 * A page that isn't a listing — /contact today. Carries no business fields of
 * its own: it points at the one node the layout emits, so the address and the
 * hours are stated once for the whole site rather than restated here in a
 * second, anonymous copy of the same shop.
 */
export function pageNode(
  locale: Locale,
  opts: {
    /** A WebPage subtype: "ContactPage", "AboutPage", … */
    type: string;
    path: string;
    name: string;
    description?: string;
    trail?: { name: string; path: string }[];
  },
) {
  const url = localeUrl(locale, opts.path);
  return {
    "@type": opts.type,
    "@id": `${url}#page`,
    url,
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    inLanguage: locale === "ka" ? "ka-GE" : "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": BUSINESS_ID },
    mainEntity: { "@id": BUSINESS_ID },
    ...(opts.trail
      ? {
          breadcrumb: {
            "@id": `${localeUrl(locale, opts.trail[opts.trail.length - 1].path)}#breadcrumb`,
          },
        }
      : {}),
  };
}

/** "Home" / "Catalog" in the reader's language — the same two strings the
    product page's own back-link uses, so the trail matches what is on screen
    instead of being English on a Georgian page. */
export function crumbLabels(locale: Locale) {
  const t = dict[toLang(locale)].product;
  return { home: t.home, catalog: t.catalog };
}

const AVAILABILITY: Record<Product["stock"], string> = {
  "IN STOCK": "https://schema.org/InStock",
  "LOW STOCK": "https://schema.org/LimitedAvailability",
  "MADE TO ORDER": "https://schema.org/MadeToOrder",
};

/**
 * One product, as the Product rich result reads it.
 *
 * `offers` is only emitted for a unit that has a price. Google requires
 * `price` and `priceCurrency` on an `Offer`, so the price-free `Offer` this
 * used to ship for quote-only units was not a partial listing — it was an
 * invalid one, reported as "Missing field price" and disqualifying the whole
 * Product. Without the offer the Product node still validates; it just is not
 * eligible for the price-and-availability snippet, which is the honest state
 * of a unit whose price is "on request".
 */
export function productNode(locale: Locale, p: Product) {
  const url = localeUrl(locale, `/catalog/${p.id}`);
  const images = (p.gallery.length > 0 ? p.gallery : [p.img])
    .filter(Boolean)
    .map(absoluteUrl);

  /** Each car this unit fits. An empty engine field would emit an
      `EngineSpecification` with a blank name, so it is left off instead. */
  const fitsVehicles = p.fitments.map((f) => ({
    "@type": "Vehicle",
    name: `${f.make} ${f.model}`.trim(),
    brand: { "@type": "Brand", name: f.make },
    model: f.model,
    // The display string is a range ("2005 – 2012 · E90"), which is not a
    // date; `vehicleModelDate` takes the year the generation started.
    vehicleModelDate: String(f.yearFrom),
    ...(f.engine
      ? { vehicleEngine: { "@type": "EngineSpecification", name: f.engine } }
      : {}),
  }));

  return {
    "@type": "Product",
    "@id": `${url}#product`,
    name: p.name,
    url,
    sku: p.code,
    mpn: p.code,
    category: p.category,
    description: p.description || p.tagline,
    // gallery is optional in the CMS; an empty array here would emit
    // "image": [] which is invalid for schema.org/Product.
    ...(images.length > 0 ? { image: images } : {}),
    brand: { "@type": "Brand", name: "GMS Turbo Georgia" },
    manufacturer: { "@id": BUSINESS_ID },
    // Specs and fitments are both optional in the CMS, and an empty array is
    // invalid for either key — so an empty one is dropped, not emitted.
    ...(p.specs.length > 0
      ? {
          additionalProperty: p.specs.map((s) => ({
            "@type": "PropertyValue",
            name: s.label,
            value: s.value,
          })),
        }
      : {}),
    ...(fitsVehicles.length > 0 ? { isAccessoryOrSparePartFor: fitsVehicles } : {}),
    ...(typeof p.price === "number"
      ? {
          offers: {
            "@type": "Offer",
            url,
            price: p.price,
            priceCurrency: "GEL",
            availability: AVAILABILITY[p.stock],
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@id": BUSINESS_ID },
          },
        }
      : {}),
  };
}

/**
 * Wraps nodes into one `@graph` document.
 *
 * A single script per page, rather than the two or three loose blobs pages
 * used to emit, is what lets `{"@id": …}` references resolve: inside one graph
 * a product's `seller` and the page's breadcrumb point at the very business
 * node declared beside them.
 */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
