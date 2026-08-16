import type { CollectionConfig } from "payload";

// Backend admin panel for the turbocharger catalog cards shown on /catalog.
// Field shape mirrors the `Product` type in src/lib/products.ts exactly so
// the seed script (src/seed/seed.ts) can populate this collection directly
// from that file's existing PRODUCTS array, and so a future data fetch from
// the frontend maps 1:1 onto the same fields the site already renders.
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
      fields: [
        { name: "make", type: "text", required: true },
        { name: "model", type: "text", required: true },
        { name: "years", type: "text", required: true },
        { name: "engine", type: "text", required: true },
      ],
    },
    {
      name: "boost",
      type: "number",
      required: true,
      admin: { description: "Max boost, PSI" },
    },
    {
      name: "hp",
      type: "number",
      required: true,
      admin: { description: "Crank HP potential" },
    },
    {
      name: "price",
      type: "number",
      required: true,
      admin: { description: "Price in GEL" },
    },
    {
      name: "img",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description:
          "Lead/card image — upload a new file or pick one already in Media.",
      },
    },
    {
      name: "gallery",
      type: "array",
      labels: { singular: "Gallery image", plural: "Gallery images" },
      admin: {
        description:
          "Extra shots for the product page. Leave empty to show the lead image alone.",
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
