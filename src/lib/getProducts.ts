import { getPayload } from "payload";
import config from "@payload-config";
import type { Category, Product, Vehicle } from "./products";

// Server-only data access for the `products` Payload collection. Maps each DB
// document back onto the exact `Product` shape the site already renders, so the
// catalog/detail pages can swap the static PRODUCTS array for live DB data
// without touching any presentation code. Inverse of src/seed/runSeed.ts.
//
// `tagline`/`description` are `localized: true` in the collection (see
// src/collections/Products.ts) — querying with `locale: "all"` returns each
// as `{ en, ka }` instead of a plain string. Flattening that back onto
// `tagline`/`taglineKa` here means every consumer of `Product` (ProductCard,
// ProductShowcase, product-search, …) is untouched by the localization move.
type LocalizedString = { en: string; ka: string };

type ProductDoc = {
  productId: string;
  name: string;
  code: string;
  category: string;
  vehicles: string[];
  fitments?: { make: string; model: string; years: string; engine: string }[];
  boost: number;
  hp: number;
  price: number;
  img: string;
  gallery?: { src: string }[];
  stock: string;
  tagline: LocalizedString;
  description: LocalizedString;
  specs?: { label: string; value: string }[];
};

function mapDoc(doc: ProductDoc): Product {
  return {
    id: doc.productId,
    name: doc.name,
    code: doc.code,
    category: doc.category as Exclude<Category, "ALL">,
    vehicles: (doc.vehicles ?? []) as Exclude<Vehicle, "ALL">[],
    fitments: (doc.fitments ?? []).map((f) => ({
      make: f.make,
      model: f.model,
      years: f.years,
      engine: f.engine,
    })),
    boost: doc.boost,
    hp: doc.hp,
    price: doc.price,
    img: doc.img,
    gallery: (doc.gallery ?? []).map((g) => g.src),
    stock: doc.stock as Product["stock"],
    tagline: doc.tagline.en,
    taglineKa: doc.tagline.ka,
    description: doc.description.en,
    descriptionKa: doc.description.ka,
    specs: (doc.specs ?? []).map((s) => ({ label: s.label, value: s.value })),
  };
}

export async function getProducts(): Promise<Product[]> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "products",
    locale: "all",
    limit: 200,
    sort: "createdAt", // preserve seed/insertion order for "FEATURED"
    depth: 0,
  });
  return (result.docs as unknown as ProductDoc[]).map(mapDoc);
}

export async function getProductById(id: string): Promise<Product | null> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "products",
    locale: "all",
    where: { productId: { equals: id } },
    limit: 1,
    depth: 0,
  });
  const doc = result.docs[0] as unknown as ProductDoc | undefined;
  return doc ? mapDoc(doc) : null;
}
