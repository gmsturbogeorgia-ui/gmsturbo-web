// Categories and makes are user-editable rows now, not a closed set, so these
// are plain strings holding a taxonomy `value`. They stay named types because
// every filter/search signature in the app reads better for it.
export type Category = string;
export type Vehicle = string;

// A product as the site renders it: text already in the page's language,
// because the locale is a URL segment and getProducts queries Payload for
// that one locale (see src/lib/getProducts.ts).
export type Product = {
  id: string;
  name: string;
  code: string;
  category: Category;
  vehicles: Vehicle[];
  /**
   * The cars this unit fits. Each row is one generation of one model, picked
   * in /admin from the `vehicle-generations` collection and flattened here by
   * src/lib/getProducts.ts into both halves at once: the strings the product
   * page and the search index read, and the taxonomy keys the catalog's
   * make -> model -> year filter compares (see src/lib/fitment.ts).
   */
  fitments: {
    /** Display: "BMW", "3 Series", "2005 – 2012 · E90". */
    make: string;
    model: string;
    years: string;
    engine: string;
    /** Keys: the stable values the filter matches on. */
    makeValue: string;
    modelValue: string;
    yearFrom: number;
    yearTo: number | null;
  }[];
  // Optional in the CMS — a unit with no published figure renders without
  // that line, and a priceless unit reads "Price on request".
  boost?: number | null;
  hp?: number | null;
  price?: number | null;
  img: string;
  gallery: string[];
  stock: "IN STOCK" | "MADE TO ORDER" | "LOW STOCK";
  tagline: string;
  description: string;
  specs: { label: string; value: string }[];
};
