import type { CollectionConfig } from "payload";

// The vehicle makes a turbo can be filed under — same shape and the same
// value/label contract as src/collections/Categories.ts, which see.
//
// Marques mostly read the same in both languages (BMW, Audi), so `label` is
// still localized: it costs nothing when the two match and it's there for the
// ones that don't.
//
// A make is the root of the tree the catalog's car picker walks — pick a make
// by its logo, then a model, then a year range. The two levels below it are
// their own collections (src/collections/VehicleModels.ts and
// VehicleGenerations.ts) rather than arrays nested here, because a product's
// fitment row has to point AT one specific generation, and a row buried in
// another document's array has no id to point at.
export const Vehicles: CollectionConfig = {
  slug: "vehicles",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "value", "popular", "order"],
    description:
      "Vehicle makes — the first step of the /catalog car picker. Models hang off these under Taxonomy → Vehicle models. Renaming a label is safe at any time; see the value field before changing it.",
    group: "Taxonomy",
  },
  access: {
    read: () => true,
  },
  defaultSort: "order",
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: 'Display name, e.g. "Mercedes". Has an en/ka switcher.',
      },
    },
    {
      name: "value",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          "Stable key, e.g. MERCEDES. Stored on every product fitting this make and used in /catalog?vehicle=… links. Set it once and leave it. Changing it drops the products already filed here out of that filter and breaks any shared link.",
      },
      hooks: {
        beforeValidate: [
          ({ value }) =>
            typeof value === "string" ? value.trim().toUpperCase() : value,
        ],
      },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Optional. Left empty, the bundled logo whose filename matches the value above is used (AUDI -> /images/brands/audi.png). Upload one only to override that, or for a make the site ships no logo for.",
      },
    },
    {
      name: "popular",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "Show as a shortcut chip under \"popular platforms\" on the catalog's no-results screen. Tick the handful worth surfacing; if none are ticked the first four are used.",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Position in the filter list, lowest first.",
        step: 1,
      },
    },
  ],
};
