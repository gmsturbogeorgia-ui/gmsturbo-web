"use client";

import { createContext, useContext, useMemo } from "react";
import { labelLookup, type Taxonomies } from "@/lib/taxonomy";

/**
 * Categories and vehicle makes are editable rows in /admin (see
 * src/collections/Categories.ts), so their display labels can no longer come
 * from the hardcoded maps that used to live in ./dictionary.ts.
 *
 * Products store only the stable `value` key, and the components that render
 * a label — ProductCard, ProductDetailClient, CatalogClient — sit at four
 * different depths under three different pages. Threading the lists through
 * all of them as props would mean touching every page that shows a product
 * card, so they're provided once from the frontend layout instead, the same
 * way LanguageProvider supplies the current language.
 */
type TaxonomyContextValue = Taxonomies & {
  /** "BILLET" -> "Billet" / "ბილეტი", in the page's language. */
  catLabel: (value: string) => string;
  /** "MERCEDES" -> "Mercedes", in the page's language. */
  vehLabel: (value: string) => string;
};

const TaxonomyContext = createContext<TaxonomyContextValue | undefined>(
  undefined,
);

export function TaxonomyProvider({
  taxonomies,
  children,
}: {
  taxonomies: Taxonomies;
  children: React.ReactNode;
}) {
  const value = useMemo<TaxonomyContextValue>(
    () => ({
      ...taxonomies,
      catLabel: labelLookup(taxonomies.categories),
      vehLabel: labelLookup(taxonomies.vehicles),
    }),
    [taxonomies],
  );

  return (
    <TaxonomyContext.Provider value={value}>
      {children}
    </TaxonomyContext.Provider>
  );
}

export function useTaxonomy(): TaxonomyContextValue {
  const ctx = useContext(TaxonomyContext);
  if (!ctx) {
    throw new Error("useTaxonomy must be used within a TaxonomyProvider");
  }
  return ctx;
}
