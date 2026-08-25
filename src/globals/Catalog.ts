import type { GlobalConfig } from "payload";

// Singleton content for /catalog (the "Catalog" nav item). Same pattern as
// the other page globals: every string the page renders — hero copy, filter
// toolbar labels, empty-state copy, the custom-builds CTA — lives here
// instead of the i18n dictionary, editable from /admin. Bilingual via
// Payload's native `localized: true` (see payload.config.ts's
// `localization` block). Product data itself stays in the `products`
// collection (see src/collections/Products.ts) — this global only covers
// the page chrome around it.
export const Catalog: GlobalConfig = {
  slug: "catalog",
  admin: {
    description: "Editable copy for /catalog (product data lives in Products).",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "titleLine1", type: "text", required: true, localized: true },
        { name: "titleLine2", type: "text", required: true, localized: true },
        { name: "blurb", type: "textarea", required: true, localized: true },
      ],
    },
    {
      name: "search",
      type: "group",
      fields: [
        {
          name: "placeholder",
          type: "text",
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: "toolbar",
      type: "group",
      admin: {
        description: "Filter panel, sticky results bar and mobile filter sheet.",
      },
      fields: [
        { name: "filtersLabel", type: "text", required: true, localized: true },
        { name: "categoryLabel", type: "text", required: true, localized: true },
        { name: "vehicleLabel", type: "text", required: true, localized: true },
        { name: "allOption", type: "text", required: true, localized: true },
        { name: "clearAll", type: "text", required: true, localized: true },
        { name: "sortLabel", type: "text", required: true, localized: true },
        { name: "sortFeatured", type: "text", required: true, localized: true },
        { name: "sortPriceAsc", type: "text", required: true, localized: true },
        { name: "sortPriceDesc", type: "text", required: true, localized: true },
        { name: "showResults", type: "text", required: true, localized: true },
        { name: "unitsSuffix", type: "text", required: true, localized: true },
      ],
    },
    {
      name: "carPicker",
      type: "group",
      admin: {
        description:
          "The make -> model -> year car picker on /catalog. Every field here is optional: left empty it falls back to the wording the site ships with, in both languages.",
      },
      fields: [
        { name: "trigger", type: "text", localized: true },
        { name: "title", type: "text", localized: true },
        { name: "stepMake", type: "text", localized: true },
        { name: "stepModel", type: "text", localized: true },
        { name: "stepYear", type: "text", localized: true },
        { name: "searchPlaceholder", type: "text", localized: true },
        { name: "allModels", type: "text", localized: true },
        { name: "allYears", type: "text", localized: true },
        {
          name: "present",
          type: "text",
          localized: true,
          admin: {
            description:
              'How an open-ended generation reads, e.g. "2019 - now".',
          },
        },
        { name: "noModels", type: "text", localized: true },
        { name: "noMakes", type: "text", localized: true },
        { name: "back", type: "text", localized: true },
        { name: "change", type: "text", localized: true },
      ],
    },
    {
      name: "emptyState",
      type: "group",
      admin: { description: "Shown when a search/filter combo has no matches." },
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        { name: "blurbLead", type: "text", required: true, localized: true },
        { name: "blurbTail", type: "text", required: true, localized: true },
        { name: "resetFilter", type: "text", required: true, localized: true },
        {
          name: "requestCustomSpec",
          type: "text",
          required: true,
          localized: true,
        },
        { name: "browseCore", type: "text", required: true, localized: true },
        {
          name: "popularPlatforms",
          type: "text",
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: "customBuilds",
      type: "group",
      admin: { description: "The 'Can't find your fitment?' band at the bottom." },
      fields: [
        { name: "kicker", type: "text", required: true, localized: true },
        { name: "title1", type: "text", required: true, localized: true },
        { name: "title2", type: "text", required: true, localized: true },
        { name: "blurb", type: "textarea", required: true, localized: true },
        { name: "ctaLabel", type: "text", required: true, localized: true },
      ],
    },
  ],
};
