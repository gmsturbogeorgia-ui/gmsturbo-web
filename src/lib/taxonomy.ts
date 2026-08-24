/**
 * Shapes and helpers for the `categories` / `vehicles` taxonomies that are
 * safe to import from a client component.
 *
 * Kept apart from src/lib/getTaxonomies.ts on purpose: that module imports
 * the Payload config to query the DB, which drags `fs` (and the whole server
 * runtime) into whatever bundle touches it. Types alone would be erased at
 * compile time, but `labelLookup` is a real value — importing it from the
 * getter is what pulled the server module into the client build.
 *
 * Labels arrive already in the page's language: the locale is part of the URL
 * now, so the server queries Payload for that one locale instead of shipping
 * both and picking in the browser.
 */
export type TaxonomyOption = {
  /** The stable key stored on products, e.g. "OEM REPLACEMENT". */
  value: string;
  label: string;
};

/**
 * One generation of a model — the third and last step of the car picker.
 * `yearTo` is null for a generation still in production, which renders as
 * "2019 –" rather than inventing an end year that would go stale.
 */
export type Generation = {
  yearFrom: number;
  yearTo: number | null;
  /** Optional chassis code shown beside the years, e.g. "B8". */
  label: string;
};

/** A model under a make: Audi -> A4, with the generations offered for it. */
export type VehicleModel = {
  /** Stable key stored in ?model=…, e.g. "A4". */
  value: string;
  label: string;
  generations: Generation[];
};

/**
 * A make, with everything the picker's first step needs: the logo to draw on
 * the tile and the models to walk into. `logo` is "" when the make has no
 * upload in /admin and no bundled file matches its value.
 */
export type VehicleOption = TaxonomyOption & {
  logo: string;
  models: VehicleModel[];
};

export type Taxonomies = {
  categories: TaxonomyOption[];
  vehicles: VehicleOption[];
  /**
   * The makes ticked as "popular" — shortcut chips on the catalog's
   * no-results screen. Falls back to the first four vehicles so that screen
   * is never empty when nobody has ticked anything.
   */
  popularVehicles: VehicleOption[];
};

/**
 * Turns a taxonomy list into a `value -> label` lookup for the client
 * components, which render labels but never need the rest of the doc. Falls
 * back to the raw value so a product filed under a category that was deleted
 * from /admin still shows something readable.
 */
export function labelLookup(
  options: TaxonomyOption[],
): (value: string) => string {
  const map = new Map(options.map((o) => [o.value, o.label]));
  return (value: string) => map.get(value) ?? value;
}

/* -------------------------------------------------------------------------
   Generations
   ------------------------------------------------------------------------- */

/**
 * The stable key a generation travels under in ?years=…, e.g. "1998-2002".
 * An open-ended generation ends in a bare dash ("2019-"), which parses back
 * to `yearTo: null` rather than to some sentinel year.
 */
export function generationKey(g: Generation): string {
  return `${g.yearFrom}-${g.yearTo ?? ""}`;
}

/** Reads a ?years=… key back. Returns null for anything malformed. */
export function parseGenerationKey(
  raw: string | null,
): { yearFrom: number; yearTo: number | null } | null {
  if (!raw) return null;
  const m = /^(\d{4})-(\d{4})?$/.exec(raw.trim());
  if (!m) return null;
  return { yearFrom: Number(m[1]), yearTo: m[2] ? Number(m[2]) : null };
}

/**
 * "1998 – 2002" / "2019 – now", with the chassis code appended when the make
 * has one filed. `presentWord` comes from the CMS so the open-ended case
 * reads in the page's language.
 */
export function generationLabel(g: Generation, presentWord: string): string {
  // En dash with hair spaces: the years are a range, not a subtraction.
  const span = `${g.yearFrom}\u2009\u2013\u2009${g.yearTo ?? presentWord}`;
  return g.label ? `${span} · ${g.label}` : span;
}
