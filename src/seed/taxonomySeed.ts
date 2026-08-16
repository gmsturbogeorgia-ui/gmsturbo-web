import type { Payload } from "payload";
import { CATEGORY_SEED, VEHICLE_SEED } from "@/lib/products";

/**
 * Maps a taxonomy `value` ("BILLET", "BMW") onto the id of the row holding
 * it. Products store these as relationships now, so the seed can't write the
 * bare string — it needs the row's id. Mirrors src/seed/mediaSeed.ts.
 */
export type TaxonomyResolver = (value: string) => number;

type SeedRow = {
  value: string;
  label: string;
  labelKa: string;
  popular?: boolean;
};

/**
 * Upserts the default categories and vehicle makes, then returns a lookup by
 * value for each.
 *
 * Matching on `value` (not on label) is what makes re-seeding safe once
 * someone has renamed a label in /admin: the row is found and its order/popular
 * flag refreshed, but an edited label is left alone rather than reverted. Rows
 * added in /admin are never touched.
 */
async function seedCollection(
  payload: Payload,
  collection: "categories" | "vehicles",
  rows: readonly SeedRow[],
): Promise<TaxonomyResolver> {
  const byValue = new Map<string, number>();

  for (const [index, row] of rows.entries()) {
    const existing = await payload.find({
      collection,
      where: { value: { equals: row.value } },
      limit: 1,
      depth: 0,
    });

    // `order` and `popular` are seed-owned presentation defaults; `label` is
    // written on create only, so an admin rename survives the next seed.
    const shared = {
      order: index,
      ...(row.popular === undefined ? {} : { popular: row.popular }),
    };

    if (existing.totalDocs > 0) {
      const id = existing.docs[0].id as number;
      await payload.update({ collection, id, data: shared });
      byValue.set(row.value, id);
      continue;
    }

    const created = await payload.create({
      collection,
      locale: "all",
      data: {
        value: row.value,
        label: { en: row.label, ka: row.labelKa },
        ...shared,
      },
    });
    byValue.set(row.value, created.id as number);
    payload.logger.info(`Created ${collection} "${row.value}"`);
  }

  return (value: string) => {
    const id = byValue.get(value);
    if (id === undefined) {
      throw new Error(`No ${collection} row seeded for "${value}"`);
    }
    return id;
  };
}

export async function seedTaxonomies(payload: Payload): Promise<{
  category: TaxonomyResolver;
  vehicle: TaxonomyResolver;
}> {
  const category = await seedCollection(payload, "categories", CATEGORY_SEED);
  const vehicle = await seedCollection(payload, "vehicles", VEHICLE_SEED);
  return { category, vehicle };
}
