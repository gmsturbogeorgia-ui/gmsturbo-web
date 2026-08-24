/**
 * Does a product fit the car the picker has selected?
 *
 * This file used to be four times longer. When a fitment row was four lines
 * of free text ("BMW", "335i / 135i (N54)", "2007–2013"), matching one
 * against the taxonomy meant parsing the years out of prose and guessing
 * which model the wording referred to — with an override field on every row
 * for when the guess was wrong.
 *
 * A fitment row is a relationship to one generation now (see
 * src/collections/Products.ts), and src/lib/getProducts.ts flattens the make
 * and model keys onto it. So there is nothing left to infer: the comparison
 * is the taxonomy key on the product against the taxonomy key in the URL.
 *
 * Client-safe on purpose — /catalog filters in the browser as you tap through
 * the picker, so this must not pull the Payload config in behind it.
 */
import type { Product } from "./products";

export type YearSpan = { yearFrom: number; yearTo: number | null };

/** What the picker currently has selected. Null at either level means "any". */
export type CarSelection = {
  make: string;
  model: string | null;
  years: YearSpan | null;
};

/**
 * Make alone is deliberately loose: it matches the product's `vehicles` list
 * as well as its fitment rows, so a turbo filed under BMW still shows up
 * before anyone has written out its fitment table. Narrowing to a model or a
 * year range is a claim about a specific car, though, so those steps match
 * fitment rows only — a product with no fitment data drops out rather than
 * being offered for a car nobody has said it fits.
 *
 * The year step is an identity check, not a range overlap. Both sides are
 * the same entity now — the product is attached to a generation, and the
 * picker hands back a generation — so "does this unit fit an E90" is answered
 * by whether E90 is one of the rows, not by whether any row's years happen to
 * intersect it. Overlap would be actively wrong here: the E90 ran to 2012 and
 * the F30 started in 2012, so an E90-only turbo would surface for anyone
 * picking an F30.
 *
 * A unit that genuinely fits two generations gets a row for each, which is
 * exactly what the /admin fitment list is for.
 */
export function matchesCar(product: Product, selection: CarSelection): boolean {
  const { make, model, years } = selection;

  if (!model && !years) {
    return (
      product.vehicles.includes(make) ||
      product.fitments.some((f) => f.makeValue === make)
    );
  }

  return product.fitments.some(
    (f) =>
      f.makeValue === make &&
      (!model || f.modelValue === model) &&
      (!years ||
        (f.yearFrom === years.yearFrom && f.yearTo === years.yearTo)),
  );
}
