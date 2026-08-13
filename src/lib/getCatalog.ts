import { getPayload } from "payload";
import config from "@payload-config";

// Server-only data access for the `catalog` Payload global. Maps the DB doc
// onto the shape CatalogClient renders — mirrors src/lib/getHome.ts. Product
// data itself comes from getProducts.ts, not this file.
export type CatalogContent = {
  hero: {
    titleLine1: string;
    titleLine1Ka: string;
    titleLine2: string;
    titleLine2Ka: string;
    blurb: string;
    blurbKa: string;
  };
  search: { placeholder: string; placeholderKa: string };
  toolbar: {
    filtersLabel: string;
    filtersLabelKa: string;
    categoryLabel: string;
    categoryLabelKa: string;
    vehicleLabel: string;
    vehicleLabelKa: string;
    allOption: string;
    allOptionKa: string;
    clearAll: string;
    clearAllKa: string;
    sortLabel: string;
    sortLabelKa: string;
    sortFeatured: string;
    sortFeaturedKa: string;
    sortPriceAsc: string;
    sortPriceAscKa: string;
    sortPriceDesc: string;
    sortPriceDescKa: string;
    sortBoost: string;
    sortBoostKa: string;
    showResults: string;
    showResultsKa: string;
    unitsSuffix: string;
    unitsSuffixKa: string;
  };
  emptyState: {
    title: string;
    titleKa: string;
    blurbLead: string;
    blurbLeadKa: string;
    blurbTail: string;
    blurbTailKa: string;
    resetFilter: string;
    resetFilterKa: string;
    requestCustomSpec: string;
    requestCustomSpecKa: string;
    browseCore: string;
    browseCoreKa: string;
    popularPlatforms: string;
    popularPlatformsKa: string;
  };
  customBuilds: {
    kicker: string;
    kickerKa: string;
    title1: string;
    title1Ka: string;
    title2: string;
    title2Ka: string;
    blurb: string;
    blurbKa: string;
    ctaLabel: string;
    ctaLabelKa: string;
  };
};

// Shape returned by Payload when querying `locale: "all"` — every
// `localized: true` leaf comes back as `{ en, ka }` (see the `localization`
// block in payload.config.ts). This global has no non-localized leaves.
type L = { en: string; ka: string };

type CatalogDoc = {
  hero: { titleLine1: L; titleLine2: L; blurb: L };
  search: { placeholder: L };
  toolbar: {
    filtersLabel: L;
    categoryLabel: L;
    vehicleLabel: L;
    allOption: L;
    clearAll: L;
    sortLabel: L;
    sortFeatured: L;
    sortPriceAsc: L;
    sortPriceDesc: L;
    sortBoost: L;
    showResults: L;
    unitsSuffix: L;
  };
  emptyState: {
    title: L;
    blurbLead: L;
    blurbTail: L;
    resetFilter: L;
    requestCustomSpec: L;
    browseCore: L;
    popularPlatforms: L;
  };
  customBuilds: { kicker: L; title1: L; title2: L; blurb: L; ctaLabel: L };
};

function mapDoc(doc: CatalogDoc): CatalogContent {
  return {
    hero: {
      titleLine1: doc.hero.titleLine1.en,
      titleLine1Ka: doc.hero.titleLine1.ka,
      titleLine2: doc.hero.titleLine2.en,
      titleLine2Ka: doc.hero.titleLine2.ka,
      blurb: doc.hero.blurb.en,
      blurbKa: doc.hero.blurb.ka,
    },
    search: {
      placeholder: doc.search.placeholder.en,
      placeholderKa: doc.search.placeholder.ka,
    },
    toolbar: {
      filtersLabel: doc.toolbar.filtersLabel.en,
      filtersLabelKa: doc.toolbar.filtersLabel.ka,
      categoryLabel: doc.toolbar.categoryLabel.en,
      categoryLabelKa: doc.toolbar.categoryLabel.ka,
      vehicleLabel: doc.toolbar.vehicleLabel.en,
      vehicleLabelKa: doc.toolbar.vehicleLabel.ka,
      allOption: doc.toolbar.allOption.en,
      allOptionKa: doc.toolbar.allOption.ka,
      clearAll: doc.toolbar.clearAll.en,
      clearAllKa: doc.toolbar.clearAll.ka,
      sortLabel: doc.toolbar.sortLabel.en,
      sortLabelKa: doc.toolbar.sortLabel.ka,
      sortFeatured: doc.toolbar.sortFeatured.en,
      sortFeaturedKa: doc.toolbar.sortFeatured.ka,
      sortPriceAsc: doc.toolbar.sortPriceAsc.en,
      sortPriceAscKa: doc.toolbar.sortPriceAsc.ka,
      sortPriceDesc: doc.toolbar.sortPriceDesc.en,
      sortPriceDescKa: doc.toolbar.sortPriceDesc.ka,
      sortBoost: doc.toolbar.sortBoost.en,
      sortBoostKa: doc.toolbar.sortBoost.ka,
      showResults: doc.toolbar.showResults.en,
      showResultsKa: doc.toolbar.showResults.ka,
      unitsSuffix: doc.toolbar.unitsSuffix.en,
      unitsSuffixKa: doc.toolbar.unitsSuffix.ka,
    },
    emptyState: {
      title: doc.emptyState.title.en,
      titleKa: doc.emptyState.title.ka,
      blurbLead: doc.emptyState.blurbLead.en,
      blurbLeadKa: doc.emptyState.blurbLead.ka,
      blurbTail: doc.emptyState.blurbTail.en,
      blurbTailKa: doc.emptyState.blurbTail.ka,
      resetFilter: doc.emptyState.resetFilter.en,
      resetFilterKa: doc.emptyState.resetFilter.ka,
      requestCustomSpec: doc.emptyState.requestCustomSpec.en,
      requestCustomSpecKa: doc.emptyState.requestCustomSpec.ka,
      browseCore: doc.emptyState.browseCore.en,
      browseCoreKa: doc.emptyState.browseCore.ka,
      popularPlatforms: doc.emptyState.popularPlatforms.en,
      popularPlatformsKa: doc.emptyState.popularPlatforms.ka,
    },
    customBuilds: {
      kicker: doc.customBuilds.kicker.en,
      kickerKa: doc.customBuilds.kicker.ka,
      title1: doc.customBuilds.title1.en,
      title1Ka: doc.customBuilds.title1.ka,
      title2: doc.customBuilds.title2.en,
      title2Ka: doc.customBuilds.title2.ka,
      blurb: doc.customBuilds.blurb.en,
      blurbKa: doc.customBuilds.blurb.ka,
      ctaLabel: doc.customBuilds.ctaLabel.en,
      ctaLabelKa: doc.customBuilds.ctaLabel.ka,
    },
  };
}

export async function getCatalog(): Promise<CatalogContent> {
  const payload = await getPayload({ config });
  const doc = await payload.findGlobal({
    slug: "catalog",
    locale: "all",
    depth: 0,
  });
  return mapDoc(doc as unknown as CatalogDoc);
}
