import { getPayload } from "payload";
import config from "@payload-config";
import type { Locale } from "./i18n/locales";

// Server-only data access for the `catalog` Payload global — same shape as
// src/lib/getHome.ts, which see for why this is no longer a field-by-field
// mapping of `{ en, ka }` pairs. Every leaf here is localized text and none
// are relationships, so the doc needs no reshaping at all.
//
// Product data itself comes from getProducts.ts, not this file.
export type CarPickerCopy = {
  trigger: string;
  title: string;
  stepMake: string;
  stepModel: string;
  stepYear: string;
  searchPlaceholder: string;
  allModels: string;
  allYears: string;
  present: string;
  noModels: string;
  noMakes: string;
  back: string;
  change: string;
};

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
  carPicker: CarPickerCopy;
};

/* Unlike every other group in this global, the car picker's strings are
   optional in /admin — the feature shipped after the global already existed,
   and making thirteen new fields required would have left the whole document
   failing validation until someone opened it and typed them all out. These
   are what the picker says until they do. */
const CAR_PICKER_DEFAULTS: Record<Locale, CarPickerCopy> = {
  en: {
    trigger: "Choose your car",
    title: "Find your fitment",
    stepMake: "Mark",
    stepModel: "Model",
    stepYear: "Year",
    searchPlaceholder: "Search marks",
    allModels: "All models",
    allYears: "All years",
    present: "now",
    noModels: "No models on file for this make yet.",
    noMakes: "No make matches that.",
    back: "Back",
    change: "Change",
  },
  ka: {
    trigger: "აირჩიეთ თქვენი ავტომობილი",
    title: "იპოვეთ თავსებადობა",
    stepMake: "მარკა",
    stepModel: "მოდელი",
    stepYear: "წელი",
    searchPlaceholder: "მოძებნეთ მარკა",
    allModels: "ყველა მოდელი",
    allYears: "ყველა წელი",
    present: "დღემდე",
    noModels: "ამ მარკისთვის მოდელები ჯერ არ არის დამატებული.",
    noMakes: "ასეთი მარკა ვერ მოიძებნა.",
    back: "უკან",
    change: "შეცვლა",
  },
};

/** Keeps a filled-in field, falls back for a missing or blank one. Payload
    hands back "" for a text field that was opened and cleared, and an empty
    string on screen is worse than the default wording. */
function withDefaults(
  doc: Partial<CarPickerCopy> | null | undefined,
  defaults: CarPickerCopy,
): CarPickerCopy {
  const out = { ...defaults };
  for (const key of Object.keys(defaults) as (keyof CarPickerCopy)[]) {
    const value = doc?.[key];
    if (typeof value === "string" && value.trim() !== "") out[key] = value;
  }
  return out;
}

export async function getCatalog(locale: Locale): Promise<CatalogContent> {
  const payload = await getPayload({ config });
  const doc = await payload.findGlobal({
    slug: "catalog",
    locale,
    depth: 0,
  });
  const content = doc as unknown as CatalogContent;
  return {
    ...content,
    carPicker: withDefaults(content.carPicker, CAR_PICKER_DEFAULTS[locale]),
  };
}
