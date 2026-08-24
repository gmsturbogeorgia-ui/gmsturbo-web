import type { CollectionConfig } from "payload";

// The vehicle makes a turbo can be filed under — same shape and the same
// value/label contract as src/collections/Categories.ts, which see.
//
// Marques mostly read the same in both languages (BMW, Audi), so `label` is
// still localized: it costs nothing when the two match and it's there for the
// ones that don't.
//
// A make also owns the branches below it — its logo, its models, and each
// model's generations. That tree is what the catalog's car picker walks:
// pick a make by its logo, then a model, then a year range. Keeping it nested
// under the make (rather than as two more collections) means adding a model
// is an inline row on the make you are already editing, and a make can never
// end up pointing at a model filed under a different marque.
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
      name: "models",
      type: "array",
      labels: { singular: "Model", plural: "Models" },
      admin: {
        initCollapsed: true,
        description:
          "The models sold under this make. These are step two of the catalog's car picker (make -> model -> years); a make with no models here is still pickable, it just goes straight to results.",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          admin: { description: 'Display name, e.g. "A4".' },
        },
        {
          name: "value",
          type: "text",
          required: true,
          admin: {
            description:
              "Stable key, e.g. A4. Goes in /catalog?model=… and is what a product's fitment rows are matched against. Set it once and leave it — changing it breaks shared links and drops products out of this model's filter.",
          },
          hooks: {
            beforeValidate: [
              ({ value }) =>
                typeof value === "string" ? value.trim().toUpperCase() : value,
            ],
          },
        },
        {
          name: "generations",
          type: "array",
          labels: { singular: "Generation", plural: "Generations" },
          admin: {
            initCollapsed: true,
            description:
              "Year ranges offered as step three, e.g. 1998-2002 then 2003-2007. Leave the end year empty for a generation still in production.",
          },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "yearFrom",
                  type: "number",
                  required: true,
                  admin: { width: "33%", step: 1, description: "First model year." },
                },
                {
                  name: "yearTo",
                  type: "number",
                  admin: {
                    width: "33%",
                    step: 1,
                    description: "Last model year. Empty = still built.",
                  },
                },
                {
                  name: "label",
                  type: "text",
                  admin: {
                    width: "34%",
                    description: 'Optional chassis code, e.g. "B5".',
                  },
                },
              ],
            },
          ],
        },
      ],
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
