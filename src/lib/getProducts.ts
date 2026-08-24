import { getPayload } from "payload";
import config from "@payload-config";
import type { Product } from "./products";
import type { Locale } from "./i18n/locales";
import { mediaUrl, type MediaRef } from "./mediaUrl";

// Server-only data access for the `products` Payload collection. Maps each DB
// document onto the `Product` shape the site renders.
//
// `tagline`/`description` are `localized: true` in the collection (see
// src/collections/Products.ts). The locale is a URL segment now, so they're
// queried in one language and arrive as plain strings — the old
// `tagline`/`taglineKa` pair is gone.
//
// `category`/`vehicles` are relationships to the taxonomy collections (see
// src/collections/Categories.ts), so at depth 1 they arrive as whole docs.
// Only the stable `value` key travels to the frontend — filtering, the
// ?category=/?vehicle= URL params and the search index all compare on it,
// exactly as they did when these were hardcoded select options. Labels are
// looked up separately via src/lib/getTaxonomies.ts so renaming a category
// in /admin never has to touch product data.
type TaxonomyRef = { value?: string | null } | number | string | null;

function taxonomyValue(ref: TaxonomyRef): string {
  return ref && typeof ref === "object" && typeof ref.value === "string"
    ? ref.value
    : "";
}

/* A fitment row as stored: one relationship, plus the engine it fits in that
   car. At depth 3 the whole chain comes back populated — generation, then its
   model, then that model's make — which is what lets this flatten each row
   into the display strings and the taxonomy keys in one pass. */
type GenerationDoc = {
  yearFrom?: number | null;
  yearTo?: number | null;
  label?: string | null;
  model?:
    | {
        label?: string | null;
        value?: string | null;
        make?: { label?: string | null; value?: string | null } | number | null;
      }
    | number
    | null;
};

type FitmentDoc = {
  generation?: GenerationDoc | number | null;
  engine?: string | null;
};

/** How an open-ended generation reads in the fitment table. The picker takes
    this wording from the CMS; a product page has no reason to load that
    global just for one word, so the two locales are spelled out here. */
const STILL_BUILT: Record<Locale, string> = { en: "now", ka: "დღემდე" };

/**
 * Flattens one fitment row. Returns null when the row's generation was
 * deleted from /admin, or when the query ran too shallow to populate it —
 * either way there is nothing to print and nothing to match on, so the row is
 * dropped rather than rendered as a blank line in the table.
 */
function mapFitment(row: FitmentDoc, locale: Locale) {
  const generation = row.generation;
  if (!generation || typeof generation !== "object") return null;
  const model = generation.model;
  if (!model || typeof model !== "object") return null;
  const make = model.make;
  if (!make || typeof make !== "object") return null;
  if (typeof generation.yearFrom !== "number") return null;

  const yearTo = typeof generation.yearTo === "number" ? generation.yearTo : null;
  // En dash with hair spaces: the years are a range, not a subtraction.
  const span = `${generation.yearFrom}\u2009\u2013\u2009${yearTo ?? STILL_BUILT[locale]}`;

  return {
    make: make.label ?? make.value ?? "",
    model: model.label ?? model.value ?? "",
    years: generation.label ? `${span} · ${generation.label}` : span,
    engine: row.engine ?? "",
    makeValue: make.value ?? "",
    modelValue: model.value ?? "",
    yearFrom: generation.yearFrom,
    yearTo,
  };
}

type ProductDoc = Omit<
  Product,
  "id" | "category" | "vehicles" | "img" | "gallery" | "fitments"
> & {
  productId: string;
  category: TaxonomyRef;
  vehicles?: TaxonomyRef[];
  fitments?: FitmentDoc[];
  img: MediaRef;
  gallery?: { src: MediaRef }[];
};

function mapDoc(doc: ProductDoc, locale: Locale): Product {
  const img = mediaUrl(doc.img);
  // A gallery row whose upload was cleared in /admin would put an empty src
  // into ProductShowcase's slider, so drop it here.
  const extra = (doc.gallery ?? []).map((g) => mediaUrl(g.src)).filter(Boolean);
  return {
    ...doc,
    id: doc.productId,
    category: taxonomyValue(doc.category),
    // A make deleted from /admin leaves a dangling reference; drop it rather
    // than let "" into the filter comparisons.
    vehicles: (doc.vehicles ?? []).map(taxonomyValue).filter(Boolean),
    img,
    // The lead image is always the first frame of the gallery — nobody
    // should have to upload the same photo twice to have it show up in the
    // slider. `Set` covers the editor who added it to both fields anyway.
    gallery: [...new Set([img, ...extra])].filter(Boolean),
    fitments: (doc.fitments ?? [])
      .map((f) => mapFitment(f, locale))
      .filter((f): f is NonNullable<typeof f> => f !== null),
    specs: doc.specs ?? [],
  };
}

export async function getProducts(locale: Locale): Promise<Product[]> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "products",
    locale,
    limit: 200,
    sort: "createdAt", // preserve insertion order for "FEATURED"
    // depth 3 is the length of the fitment chain: product -> generation ->
    // model -> make. It also covers `media` behind `img`/`gallery` and the
    // taxonomy docs behind `category`/`vehicles`, which need only 1.
    depth: 3,
  });
  return (result.docs as unknown as ProductDoc[]).map((d) => mapDoc(d, locale));
}

export async function getProductById(
  id: string,
  locale: Locale,
): Promise<Product | null> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "products",
    locale,
    where: { productId: { equals: id } },
    limit: 1,
    depth: 3, // walk the fitment chain — see getProducts
  });
  const doc = result.docs[0] as unknown as ProductDoc | undefined;
  return doc ? mapDoc(doc, locale) : null;
}
