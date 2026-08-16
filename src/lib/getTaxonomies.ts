import { getPayload } from "payload";
import config from "@payload-config";
import type { Locale } from "./i18n/locales";
import type { Taxonomies, TaxonomyOption } from "./taxonomy";

// Server-only data access for the `categories` and `vehicles` collections —
// the lists that used to be hardcoded `select` options on the products
// collection and hardcoded label maps in src/lib/i18n/dictionary.ts.
//
// Server-only in the literal sense: importing this module pulls in the
// Payload config and so `fs`. The shapes and the label lookup live in
// ./taxonomy.ts instead, which is what client components import.
//
// The locale comes from the URL segment and is handed straight to Payload,
// which is what its `localization` config is for — so `label` arrives as a
// plain string in the right language rather than an `{ en, ka }` pair the
// browser has to choose between.

type TaxonomyDoc = { value: string; label: string; popular?: boolean };

function mapDoc(doc: TaxonomyDoc): TaxonomyOption {
  return { value: doc.value, label: doc.label };
}

export async function getTaxonomies(locale: Locale): Promise<Taxonomies> {
  const payload = await getPayload({ config });

  const [categoryResult, vehicleResult] = await Promise.all([
    payload.find({
      collection: "categories",
      locale,
      limit: 200,
      sort: "order",
      depth: 0,
    }),
    payload.find({
      collection: "vehicles",
      locale,
      limit: 200,
      sort: "order",
      depth: 0,
    }),
  ]);

  const categories = (categoryResult.docs as unknown as TaxonomyDoc[]).map(
    mapDoc,
  );
  const vehicleDocs = vehicleResult.docs as unknown as TaxonomyDoc[];
  const vehicles = vehicleDocs.map(mapDoc);
  const ticked = vehicleDocs.filter((v) => v.popular).map(mapDoc);

  return {
    categories,
    vehicles,
    popularVehicles: ticked.length > 0 ? ticked : vehicles.slice(0, 4),
  };
}
