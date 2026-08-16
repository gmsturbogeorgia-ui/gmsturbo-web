import { getPayload } from "payload";
import config from "@payload-config";
import type { Locale } from "./i18n/locales";

// Server-only data access for the `catalog` Payload global — same shape as
// src/lib/getHome.ts, which see for why this is no longer a field-by-field
// mapping of `{ en, ka }` pairs. Every leaf here is localized text and none
// are relationships, so the doc needs no reshaping at all.
//
// Product data itself comes from getProducts.ts, not this file.
export type CatalogContent = {
  hero: { titleLine1: string; titleLine2: string; blurb: string };
  search: { placeholder: string };
  toolbar: {
    filtersLabel: string;
    categoryLabel: string;
    vehicleLabel: string;
    allOption: string;
    clearAll: string;
    sortLabel: string;
    sortFeatured: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortBoost: string;
    showResults: string;
    unitsSuffix: string;
  };
  emptyState: {
    title: string;
    blurbLead: string;
    blurbTail: string;
    resetFilter: string;
    requestCustomSpec: string;
    browseCore: string;
    popularPlatforms: string;
  };
  customBuilds: {
    kicker: string;
    title1: string;
    title2: string;
    blurb: string;
    ctaLabel: string;
  };
};

export async function getCatalog(locale: Locale): Promise<CatalogContent> {
  const payload = await getPayload({ config });
  const doc = await payload.findGlobal({
    slug: "catalog",
    locale,
    depth: 0,
  });
  return doc as unknown as CatalogContent;
}
