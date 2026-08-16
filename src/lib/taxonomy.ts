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

export type Taxonomies = {
  categories: TaxonomyOption[];
  vehicles: TaxonomyOption[];
  /**
   * The makes ticked as "popular" — shortcut chips on the catalog's
   * no-results screen. Falls back to the first four vehicles so that screen
   * is never empty when nobody has ticked anything.
   */
  popularVehicles: TaxonomyOption[];
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
