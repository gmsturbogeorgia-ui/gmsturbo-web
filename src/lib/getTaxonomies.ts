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

type ModelDoc = {
  value?: string | null;
  label?: string | null;
  generations?:
    | {
        yearFrom?: number | null;
        yearTo?: number | null;
        label?: string | null;
      }[]
    | null;
};

type VehicleDoc = TaxonomyDoc & {
  logo?: MediaRef;
  models?: ModelDoc[] | null;
};

function mapDoc(doc: TaxonomyDoc): TaxonomyOption {
  return { value: doc.value, label: doc.label };
}

/**
 * Generations are sorted oldest-first here rather than in the browser: the
 * picker lists them in this order, and /admin rows can be dragged into any
 * order at all. A row saved with no `yearFrom` can't be filtered on, so it
 * is dropped instead of being listed as an unclickable year.
 */
function mapGenerations(rows: ModelDoc["generations"]): Generation[] {
  return (rows ?? [])
    .filter((g): g is { yearFrom: number } & typeof g =>
      typeof g.yearFrom === "number",
    )
    .map((g) => ({
      yearFrom: g.yearFrom,
      yearTo: typeof g.yearTo === "number" ? g.yearTo : null,
      label: g.label ?? "",
    }))
    .sort((a, b) => a.yearFrom - b.yearFrom);
}

/** A model row is only usable once it has a stable key; half-filled rows are
    dropped rather than rendered as a blank tile in the picker. */
function mapModels(rows: VehicleDoc["models"]): VehicleModel[] {
  return (rows ?? [])
    .filter((m): m is { value: string } & ModelDoc => Boolean(m.value))
    .map((m) => ({
      value: m.value,
      label: m.label || m.value,
      generations: mapGenerations(m.generations),
    }));
}

function mapVehicle(doc: VehicleDoc): VehicleOption {
  return {
    ...mapDoc(doc),
    // An upload in /admin wins; otherwise the site's own file for that make,
    // which is "" for a marque no logo ships for — the picker draws those as
    // a wordmark tile.
    logo: mediaUrl(doc.logo) || bundledBrandLogo(doc.value),
    models: mapModels(doc.models),
  };
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
      // depth 1 populates the media doc behind `logo`; the categories query
      // above has no relationships and stays at 0.
      depth: 1,
    }),
  ]);

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
