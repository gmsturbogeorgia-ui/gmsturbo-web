import { getPayload } from "payload";
import config from "@payload-config";
import type { Product } from "./products";
import type { Locale } from "./i18n/locales";
import { mediaUrl, type MediaRef } from "./mediaUrl";

// Server-only data access for the `products` Payload collection. Maps each DB
// document onto the `Product` shape the site renders. Inverse of
// src/seed/runSeed.ts.
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

type ProductDoc = Omit<
  Product,
  "id" | "category" | "vehicles" | "img" | "gallery"
> & {
  productId: string;
  category: TaxonomyRef;
  vehicles?: TaxonomyRef[];
  img: MediaRef;
  gallery?: { src: MediaRef }[];
};

function mapDoc(doc: ProductDoc): Product {
  return {
    ...doc,
    id: doc.productId,
    category: taxonomyValue(doc.category),
    // A make deleted from /admin leaves a dangling reference; drop it rather
    // than let "" into the filter comparisons.
    vehicles: (doc.vehicles ?? []).map(taxonomyValue).filter(Boolean),
    img: mediaUrl(doc.img),
    // A gallery row whose upload was cleared in /admin would put an empty
    // src into ProductShowcase's slider, so drop it here.
    gallery: (doc.gallery ?? []).map((g) => mediaUrl(g.src)).filter(Boolean),
    fitments: doc.fitments ?? [],
    specs: doc.specs ?? [],
  };
}

export async function getProducts(locale: Locale): Promise<Product[]> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "products",
    locale,
    limit: 200,
    sort: "createdAt", // preserve seed/insertion order for "FEATURED"
    // depth 1 populates the `media` docs behind `img`/`gallery` and the
    // taxonomy docs behind `category`/`vehicles`.
    depth: 1,
  });
  return (result.docs as unknown as ProductDoc[]).map(mapDoc);
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
    depth: 1, // populate media + taxonomy relationships — see getProducts
  });
  const doc = result.docs[0] as unknown as ProductDoc | undefined;
  return doc ? mapDoc(doc) : null;
}
