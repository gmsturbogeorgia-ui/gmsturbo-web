import type { CollectionConfig } from "payload";

// Backend admin panel for the turbocharger catalog cards shown on /catalog.
// Field shape mirrors the `Product` type in src/lib/products.ts exactly, so a
// document read back through src/lib/getProducts.ts maps 1:1 onto the fields
// the site already renders.
export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "code", "category", "price", "stock"],
    description:
      "Every card shown on /catalog is one product here. productId must match the site route /catalog/[productId], e.g. \"t450\".",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "productId",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: 'Slug used in the URL, e.g. "t450" -> /catalog/t450',
      },
    },
    { name: "name", type: "text", required: true },
    { name: "code", type: "text", required: true },
    // Category and vehicle makes were hardcoded `select` options here, so the
    // list could only grow through a deploy. They're their own collections
    // now (src/collections/Categories.ts, src/collections/Vehicles.ts) —
    // editable from /admin, with localized labels.
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      admin: { description: "Manage the list under Taxonomy → Categories." },
    },
    {
      name: "vehicles",
      type: "relationship",
      relationTo: "vehicles",
      hasMany: true,
      required: true,
      admin: { description: "Manage the list under Taxonomy → Vehicles." },
    },
    {
      name: "fitments",
      type: "array",
      labels: { singular: "Fitment", plural: "Fitments" },
      admin: {
        description:
          'The fitment table printed on the product page. Write it for a customer to read — "BMW", "335i / 135i (N54)", "2007-2013".',
      },
      fields: [
        { name: "make", type: "text", required: true },
        { name: "model", type: "text", required: true },
        { name: "years", type: "text", required: true },
        { name: "engine", type: "text", required: true },
        // The catalog's car picker filters on the make/model tree under
        // Taxonomy -> Vehicles, and works the four fields above out against
        // it on its own: it reads the years cell, and matches the make and
        // model text against the makes and models on file. These overrides
        // are for the rows where that can't work — usually because the
        // customer-facing wording and the model on file are different names
        // for the same car ("335i" vs "3 Series"). Leave them empty unless a
        // product is missing from a filter it belongs in.
        {
          type: "collapsible",
          label: "Filter overrides (optional)",
          admin: { initCollapsed: true },
          fields: [
            {
              name: "makeRef",
              type: "relationship",
              relationTo: "vehicles",
              admin: {
                description:
                  "Fill in only if the make text above doesn't match a make under Taxonomy -> Vehicles.",
              },
            },
            {
              name: "modelKey",
              type: "text",
              admin: {
                description:
                  "The model's stable key from that make's Models list, e.g. 3 SERIES. Fill in only if the model text above doesn't name it.",
              },
              hooks: {
                beforeValidate: [
                  ({ value }) =>
                    typeof value === "string"
                      ? value.trim().toUpperCase()
                      : value,
                ],
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "yearFrom",
                  type: "number",
                  admin: {
                    width: "50%",
                    step: 1,
                    description: "Overrides the years cell. Set both or neither.",
                  },
                },
                {
                  name: "yearTo",
                  type: "number",
                  admin: {
                    width: "50%",
                    step: 1,
                    description: "Empty with a start year set = still built.",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    // boost/hp/price are optional: not every unit has a published figure,
    // and some are quoted per build. Left empty, the card and product page
    // simply omit that line (price falls back to "Price on request") rather
    // than printing a placeholder number.
    {
      name: "boost",
      type: "number",
      admin: { description: "Max boost, PSI. Optional, leave empty to hide." },
    },
    {
      name: "hp",
      type: "number",
      admin: {
        description: "Crank HP potential. Optional, leave empty to hide.",
      },
    },
    {
      name: "price",
      type: "number",
      admin: {
        description:
          'Price in GEL. Optional, leave empty to show "Price on request".',
      },
    },
    {
      name: "img",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description:
          "Lead/card image. Upload a new file or pick one already in Media.",
      },
    },
    {
      name: "gallery",
      type: "array",
      labels: { singular: "Gallery image", plural: "Gallery images" },
      admin: {
        description:
          "Extra shots for the product page. The lead image above is added as the first frame automatically, no need to upload it again.",
      },
      fields: [
        { name: "src", type: "upload", relationTo: "media", required: true },
      ],
    },
    {
      name: "stock",
      type: "select",
      required: true,
      defaultValue: "IN STOCK",
      options: ["IN STOCK", "MADE TO ORDER", "LOW STOCK"],
    },
    { name: "tagline", type: "text", required: true, localized: true },
    { name: "description", type: "textarea", required: true, localized: true },
    {
      name: "specs",
      type: "array",
      labels: { singular: "Spec", plural: "Specs" },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "value", type: "text", required: true },
      ],
    },
  ],
};
