// Default content for the `catalog` Payload global, seeded once so /admin
// and /catalog both start populated. Copied verbatim from the strings that
// previously lived in src/lib/i18n/dictionary.ts under the `catalog` key
// (excluding `viewAll`, which stays in the dictionary — it's reused by the
// product detail page's "related products" section, a different global).
export const CATALOG_SEED = {
  hero: {
    titleLine1: "Forged for",
    titleLine1Ka: "შექმნილია",
    titleLine2: "boost",
    titleLine2Ka: "დატენვისთვის",
    blurb:
      "Filter by vehicle platform and category. Every unit is bench-tested and shipped sealed.",
    blurbKa:
      "გაფილტრეთ ავტომობილის პლატფორმისა და კატეგორიის მიხედვით. ყოველი ერთეული სტენდზეა ტესტირებული და დალუქული იგზავნება.",
  },
  search: {
    placeholder: "Search by name, code, vehicle, fitment or spec…",
    placeholderKa: "მოძებნეთ სახელით, კოდით, ავტომობილით ან სპეციფიკაციით…",
  },
  toolbar: {
    filtersLabel: "Filters",
    filtersLabelKa: "ფილტრები",
    categoryLabel: "Category",
    categoryLabelKa: "კატეგორია",
    vehicleLabel: "Vehicle",
    vehicleLabelKa: "ავტომობილი",
    allOption: "All",
    allOptionKa: "ყველა",
    clearAll: "Clear all",
    clearAllKa: "ყველას გასუფთავება",
    sortLabel: "Sort",
    sortLabelKa: "დალაგება",
    sortFeatured: "Featured",
    sortFeaturedKa: "გამორჩეული",
    sortPriceAsc: "Price: low to high",
    sortPriceAscKa: "ფასი: დაბლიდან მაღლისკენ",
    sortPriceDesc: "Price: high to low",
    sortPriceDescKa: "ფასი: მაღლიდან დაბლისკენ",
    sortBoost: "Boost: high to low",
    sortBoostKa: "დატენვა: მაღლიდან დაბლისკენ",
    showResults: "Show results",
    showResultsKa: "შედეგების ნახვა",
    unitsSuffix: "units",
    unitsSuffixKa: "ერთეული",
  },
  emptyState: {
    title: "No matching units",
    titleKa: "შესაბამისი ერთეული ვერ მოიძებნა",
    blurbLead: "Your search for",
    blurbLeadKa: "თქვენი ძიება",
    blurbTail: "didn't return anything in our active database.",
    blurbTailKa: "ვერაფერს პოულობს ჩვენს აქტიურ ბაზაში.",
    resetFilter: "Reset filters",
    resetFilterKa: "ფილტრების გასუფთავება",
    requestCustomSpec: "Request a custom spec",
    requestCustomSpecKa: "ინდივიდუალური სპეციფიკაციის მოთხოვნა",
    browseCore: "Browse core calibrations",
    browseCoreKa: "მთავარი კატეგორიების დათვალიერება",
    popularPlatforms: "Popular platforms",
    popularPlatformsKa: "პოპულარული პლატფორმები",
  },
  customBuilds: {
    kicker: "Custom builds",
    kickerKa: "ინდივიდუალური პროექტები",
    title1: "Can't find your",
    title1Ka: "ვერ პოულობთ თქვენს",
    title2: "fitment?",
    title2Ka: "მორგებას?",
    blurb:
      "Send us your platform, target power and fuel — we'll spec the exact housing, wheel set and CHRA for your build.",
    blurbKa:
      "გამოგვიგზავნეთ თქვენი პლატფორმა, სამიზნე სიმძლავრე და საწვავის ტიპი — ჩვენ შევარჩევთ ზუსტ კორპუსს, ბორბლების ნაკრებსა და CHRA-ს თქვენი პროექტისთვის.",
    ctaLabel: "Request a quote",
    ctaLabelKa: "ფასის მოთხოვნა",
  },
};

type L = { en: string; ka: string };
const locale = (en: string, ka: string): L => ({ en, ka });

/**
 * Projects the bilingual CATALOG_SEED pairs into the shape Payload's Local
 * API expects for a single `locale: "all"` write — every `localized: true`
 * leaf becomes `{ en, ka }`. See homeSeedAllLocales() in homeSeed.ts for why
 * this must be one write per doc rather than two locale-scoped calls.
 */
export function catalogSeedAllLocales() {
  return {
    hero: {
      titleLine1: locale(
        CATALOG_SEED.hero.titleLine1,
        CATALOG_SEED.hero.titleLine1Ka,
      ),
      titleLine2: locale(
        CATALOG_SEED.hero.titleLine2,
        CATALOG_SEED.hero.titleLine2Ka,
      ),
      blurb: locale(CATALOG_SEED.hero.blurb, CATALOG_SEED.hero.blurbKa),
    },
    search: {
      placeholder: locale(
        CATALOG_SEED.search.placeholder,
        CATALOG_SEED.search.placeholderKa,
      ),
    },
    toolbar: {
      filtersLabel: locale(
        CATALOG_SEED.toolbar.filtersLabel,
        CATALOG_SEED.toolbar.filtersLabelKa,
      ),
      categoryLabel: locale(
        CATALOG_SEED.toolbar.categoryLabel,
        CATALOG_SEED.toolbar.categoryLabelKa,
      ),
      vehicleLabel: locale(
        CATALOG_SEED.toolbar.vehicleLabel,
        CATALOG_SEED.toolbar.vehicleLabelKa,
      ),
      allOption: locale(
        CATALOG_SEED.toolbar.allOption,
        CATALOG_SEED.toolbar.allOptionKa,
      ),
      clearAll: locale(
        CATALOG_SEED.toolbar.clearAll,
        CATALOG_SEED.toolbar.clearAllKa,
      ),
      sortLabel: locale(
        CATALOG_SEED.toolbar.sortLabel,
        CATALOG_SEED.toolbar.sortLabelKa,
      ),
      sortFeatured: locale(
        CATALOG_SEED.toolbar.sortFeatured,
        CATALOG_SEED.toolbar.sortFeaturedKa,
      ),
      sortPriceAsc: locale(
        CATALOG_SEED.toolbar.sortPriceAsc,
        CATALOG_SEED.toolbar.sortPriceAscKa,
      ),
      sortPriceDesc: locale(
        CATALOG_SEED.toolbar.sortPriceDesc,
        CATALOG_SEED.toolbar.sortPriceDescKa,
      ),
      sortBoost: locale(
        CATALOG_SEED.toolbar.sortBoost,
        CATALOG_SEED.toolbar.sortBoostKa,
      ),
      showResults: locale(
        CATALOG_SEED.toolbar.showResults,
        CATALOG_SEED.toolbar.showResultsKa,
      ),
      unitsSuffix: locale(
        CATALOG_SEED.toolbar.unitsSuffix,
        CATALOG_SEED.toolbar.unitsSuffixKa,
      ),
    },
    emptyState: {
      title: locale(
        CATALOG_SEED.emptyState.title,
        CATALOG_SEED.emptyState.titleKa,
      ),
      blurbLead: locale(
        CATALOG_SEED.emptyState.blurbLead,
        CATALOG_SEED.emptyState.blurbLeadKa,
      ),
      blurbTail: locale(
        CATALOG_SEED.emptyState.blurbTail,
        CATALOG_SEED.emptyState.blurbTailKa,
      ),
      resetFilter: locale(
        CATALOG_SEED.emptyState.resetFilter,
        CATALOG_SEED.emptyState.resetFilterKa,
      ),
      requestCustomSpec: locale(
        CATALOG_SEED.emptyState.requestCustomSpec,
        CATALOG_SEED.emptyState.requestCustomSpecKa,
      ),
      browseCore: locale(
        CATALOG_SEED.emptyState.browseCore,
        CATALOG_SEED.emptyState.browseCoreKa,
      ),
      popularPlatforms: locale(
        CATALOG_SEED.emptyState.popularPlatforms,
        CATALOG_SEED.emptyState.popularPlatformsKa,
      ),
    },
    customBuilds: {
      kicker: locale(
        CATALOG_SEED.customBuilds.kicker,
        CATALOG_SEED.customBuilds.kickerKa,
      ),
      title1: locale(
        CATALOG_SEED.customBuilds.title1,
        CATALOG_SEED.customBuilds.title1Ka,
      ),
      title2: locale(
        CATALOG_SEED.customBuilds.title2,
        CATALOG_SEED.customBuilds.title2Ka,
      ),
      blurb: locale(
        CATALOG_SEED.customBuilds.blurb,
        CATALOG_SEED.customBuilds.blurbKa,
      ),
      ctaLabel: locale(
        CATALOG_SEED.customBuilds.ctaLabel,
        CATALOG_SEED.customBuilds.ctaLabelKa,
      ),
    },
  };
}
