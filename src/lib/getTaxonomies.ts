import { getPayload } from "payload";
import config from "@payload-config";
import type { Locale } from "./i18n/locales";
import type {
  Generation,
  Taxonomies,
  TaxonomyOption,
  VehicleModel,
  VehicleOption,
} from "./taxonomy";
import { bundledBrandLogo } from "./brand-logos";
import { mediaUrl, type MediaRef } from "./mediaUrl";

// Server-only data access for the taxonomy collections — `categories`, and
// the three that make up the vehicle tree: `vehicles` (makes),
// `vehicle-models` and `vehicle-generations`.
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

type VehicleDoc = TaxonomyDoc & { id: number; logo?: MediaRef };

/** A row from `vehicle-models`; `make` is a bare id at depth 0. */
type ModelDoc = {
  id: number;
  make: number | { id: number };
  label: string;
  value: string;
};

/** A row from `vehicle-generations`; `model` is a bare id at depth 0. */
type GenerationDoc = {
  model: number | { id: number };
  yearFrom: number;
  yearTo?: number | null;
  label?: string | null;
};

function mapDoc(doc: TaxonomyDoc): TaxonomyOption {
  return { value: doc.value, label: doc.label };
}

/** A relationship read at depth 0 is a bare id; at depth 1 it is the doc. */
function relationId(ref: number | { id: number }): number {
  return typeof ref === "object" ? ref.id : ref;
}

export async function getTaxonomies(locale: Locale): Promise<Taxonomies> {
  const payload = await getPayload({ config });

  /* Four flat reads, assembled here into the make -> model -> generation tree
     the picker walks.

     Deliberately not one nested read at depth 2: Payload would issue a query
     per model to populate each make's generations, which is a hundred-odd
     round trips to draw one dropdown. Three list queries and a join in memory
     is the same data in constant time, and the collections stay separate in
     /admin — which is the whole point of them being collections. */
  const [categoryResult, vehicleResult, modelResult, generationResult] =
    await Promise.all([
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
        // depth 1 populates the media doc behind `logo`.
        depth: 1,
      }),
      payload.find({
        collection: "vehicle-models",
        locale,
        limit: 2000,
        sort: "order",
        depth: 0,
      }),
      payload.find({
        collection: "vehicle-generations",
        locale,
        limit: 5000,
        sort: "yearFrom",
        depth: 0,
      }),
    ]);

  // Generations, grouped under the model they belong to. Already sorted
  // oldest-first by the query, which is the order the picker lists them in.
  const generationsByModel = new Map<number, Generation[]>();
  for (const doc of generationResult.docs as unknown as GenerationDoc[]) {
    const key = relationId(doc.model);
    const list = generationsByModel.get(key) ?? [];
    list.push({
      yearFrom: doc.yearFrom,
      yearTo: typeof doc.yearTo === "number" ? doc.yearTo : null,
      label: doc.label ?? "",
    });
    generationsByModel.set(key, list);
  }

  // Models, grouped under their make, in the order the query returned them.
  const modelsByMake = new Map<number, VehicleModel[]>();
  for (const doc of modelResult.docs as unknown as ModelDoc[]) {
    const key = relationId(doc.make);
    const list = modelsByMake.get(key) ?? [];
    list.push({
      value: doc.value,
      label: doc.label || doc.value,
      generations: generationsByModel.get(doc.id) ?? [],
    });
    modelsByMake.set(key, list);
  }

  const mapVehicle = (doc: VehicleDoc): VehicleOption => ({
    ...mapDoc(doc),
    // An upload in /admin wins; otherwise the site's own file for that make,
    // which is "" for a marque no logo ships for — the picker draws those as
    // a wordmark tile.
    logo: mediaUrl(doc.logo) || bundledBrandLogo(doc.value),
    models: modelsByMake.get(doc.id) ?? [],
  });

  const categories = (categoryResult.docs as unknown as TaxonomyDoc[]).map(
    mapDoc,
  );
  const vehicleDocs = vehicleResult.docs as unknown as VehicleDoc[];
  const vehicles = vehicleDocs.map(mapVehicle);
  const ticked = vehicleDocs.filter((v) => v.popular).map(mapVehicle);

  return {
    categories,
    vehicles,
    popularVehicles: ticked.length > 0 ? ticked : vehicles.slice(0, 4),
  };
}
