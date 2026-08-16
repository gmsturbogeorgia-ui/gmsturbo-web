import type { CollectionConfig } from "payload";

// The vehicle makes a turbo can be filed under — same shape and the same
// value/label contract as src/collections/Categories.ts, which see.
//
// Marques mostly read the same in both languages (BMW, Audi), so `label` is
// still localized: it costs nothing when the two match and it's there for the
// ones that don't.
export const Vehicles: CollectionConfig = {
  slug: "vehicles",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "value", "popular", "order"],
    description:
      "Vehicle makes shown in the /catalog filters. Renaming a label is safe at any time; see the value field before changing it.",
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
          "Stable key, e.g. MERCEDES. Stored on every product fitting this make and used in /catalog?vehicle=… links. Set it once and leave it — changing it drops the products already filed here out of that filter and breaks any shared link.",
      },
      hooks: {
        beforeValidate: [
          ({ value }) =>
            typeof value === "string" ? value.trim().toUpperCase() : value,
        ],
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
