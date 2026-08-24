/**
 * Turns a product's fitment rows into something the car picker can filter on.
 *
 * The rows in /admin are written for a human to read — "BMW", "335i / 135i
 * (N54)", "2007–2013" — and that copy is what the product page prints. The
 * picker needs the opposite: the taxonomy keys those strings correspond to
 * ("BMW", "3 SERIES", 2007, 2013). Rather than make editors type every
 * fitment twice, each row is resolved against the make/model tree in /admin
 * (see src/collections/Vehicles.ts) and only the rows that can't be worked
 * out automatically need the override fields filled in.
 *
 * Client-safe on purpose: /catalog filters in the browser as you tap through
 * the picker, so this must not pull the Payload config in behind it.
 */
import type { Product } from "./products";
import type { VehicleModel, VehicleOption } from "./taxonomy";
import { yearsOverlap } from "./taxonomy";

export type YearSpan = { yearFrom: number; yearTo: number | null };

/** A fitment row reduced to taxonomy keys. `model` is "" when the row names
    a make but nothing that matches one of its models. */
export type ResolvedFitment = YearSpan & {
  make: string;
  model: string;
};

/** What the picker currently has selected. */
export type CarSelection = {
  make: string;
  model: string | null;
  years: YearSpan | null;
};

/* -------------------------------------------------------------------------
   Text → keys
   ------------------------------------------------------------------------- */

/** Upper-cases and reduces punctuation to single spaces, so "335i/135i (N54)"
    and "335I 135I N54" compare equal. */
function normalize(text: string): string {
  return text
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}

/** Does `needle` appear in `haystack` as whole words? Substring matching
    would file an A4 fitment under the A45, and a 3-series one under 330. */
function containsPhrase(haystack: string, needle: string): boolean {
  if (!needle) return false;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^| )${escaped}(?: |$)`).test(haystack);
}

const OPEN_ENDED = /(\+|PRESENT|NOW|CURRENT|ONWARDS?|TODAY|→)/i;

/**
 * Reads the free-text year cell. Handles "2007–2013" (en dash, em dash or
 * hyphen), "2007 to 2013", "2007+", "2007–present" and a bare "2007".
 *
 * A bare year is treated as that single model year; it only becomes
 * open-ended when the text actually says so, because guessing "still built"
 * from "2007" would quietly match a turbo to every car since.
 */
export function parseYearSpan(text: string): YearSpan | null {
  const years = text.match(/\d{4}/g);
  if (!years?.length) return null;

  const yearFrom = Number(years[0]);
  if (years.length > 1) {
    const yearTo = Number(years[years.length - 1]);
    return yearTo >= yearFrom ? { yearFrom, yearTo } : { yearFrom: yearTo, yearTo: yearFrom };
  }
  // One year only: open-ended if the row says so, otherwise that year alone.
  const tail = text.slice(text.indexOf(years[0]) + 4);
  return { yearFrom, yearTo: OPEN_ENDED.test(tail) ? null : yearFrom };
}

/** The make in `text`, as a taxonomy value — matched on either the stable key
    or the display label, so a row typed as "Mercedes" finds MERCEDES-BENZ. */
function matchMake(text: string, vehicles: VehicleOption[]): string {
  return longestMatch(
    text,
    vehicles.map((v) => ({ value: v.value, terms: [v.value, v.label] })),
  );
}

/** The model in `text`, among the ones filed under a given make. */
function matchModel(text: string, models: VehicleModel[]): string {
  return longestMatch(
    text,
    models.map((m) => ({ value: m.value, terms: [m.value, m.label] })),
  );
}

/**
 * The taxonomy value whose key or label appears in `text`, preferring the
 * longest one that does. Longest wins because the short names are prefixes of
 * the long ones: "LAND ROVER" has to beat a make called "ROVER", and an
 * "A4 Allroad" model has to beat plain "A4".
 */
function longestMatch(
  text: string,
  candidates: { value: string; terms: string[] }[],
): string {
  const haystack = normalize(text);
  let best = "";
  let bestLength = 0;
  for (const { value, terms } of candidates) {
    for (const term of terms) {
      const needle = normalize(term);
      if (needle.length > bestLength && containsPhrase(haystack, needle)) {
        best = value;
        bestLength = needle.length;
      }
    }
  }
  return best;
}

/* -------------------------------------------------------------------------
   Rows → resolved fitments
   ------------------------------------------------------------------------- */

/**
 * Every fitment row that could be pinned to a make, with its model and year
 * span. Rows whose make can't be worked out are dropped: they still print on
 * the product page, they just can't take part in a make/model/year filter.
 */
export function resolveFitments(
  product: Product,
  vehicles: VehicleOption[],
): ResolvedFitment[] {
  const resolved: ResolvedFitment[] = [];

  for (const row of product.fitments) {
    // The override fields on the row always win — they exist precisely for
    // the rows this can't read.
    const make = row.makeRef || matchMake(row.make ?? "", vehicles);
    if (!make) continue;

    const models = vehicles.find((v) => v.value === make)?.models ?? [];
    const model = row.modelKey || matchModel(row.model ?? "", models);

    const span =
      typeof row.yearFrom === "number"
        ? { yearFrom: row.yearFrom, yearTo: row.yearTo ?? null }
        : parseYearSpan(row.years ?? "");
    if (!span) continue;

    resolved.push({ make, model, ...span });
  }

  return resolved;
}

/* -------------------------------------------------------------------------
   Matching
   ------------------------------------------------------------------------- */

/**
 * Does this product fit the selected car?
 *
 * Make alone is deliberately loose: it matches the product's `vehicles` list
 * as well as its fitment rows, so a turbo filed under BMW still shows up
 * before anyone has written out its fitment table. Narrowing to a model or a
 * year range is a claim about a specific car, though, so those steps only
 * match against fitment rows — a product with no fitment data drops out
 * rather than being offered for a car nobody has said it fits.
 */
export function matchesCar(
  product: Product,
  vehicles: VehicleOption[],
  selection: CarSelection,
): boolean {
  const { make, model, years } = selection;
  const fitments = resolveFitments(product, vehicles);

  if (!model && !years) {
    return (
      product.vehicles.includes(make) || fitments.some((f) => f.make === make)
    );
  }

  return fitments.some(
    (f) =>
      f.make === make &&
      (!model || f.model === model) &&
      (!years || yearsOverlap(f, years)),
  );
}
