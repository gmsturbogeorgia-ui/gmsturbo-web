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
    {
      name: "category",
      type: "select",
      required: true,
      options: ["HYBRID", "BILLET", "OEM REPLACEMENT", "COMPETITION"],
    },
    {
      name: "vehicles",
      type: "select",
      hasMany: true,
      required: true,
      options: [
        "BMW",
        "AUDI",
        "VW",
        "MERCEDES",
        "PORSCHE",
        "SUBARU",
        "TOYOTA",
        "NISSAN",
      ],
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
      type: "text",
      required: true,
      admin: {
        description:
          "Lead/card image path, e.g. /images/products/gms-turbo-silver.jpeg",
      },
    },
    {
      name: "gallery",
      type: "array",
      labels: { singular: "Gallery image", plural: "Gallery images" },
      fields: [{ name: "src", type: "text", required: true }],
    },
    {
      name: "stock",
      type: "select",
      required: true,
      defaultValue: "IN STOCK",
      options: ["IN STOCK", "MADE TO ORDER", "LOW STOCK"],
    },
    { name: "tagline", type: "text", required: true },
    {
      name: "taglineKa",
      type: "text",
      required: true,
      label: "Tagline (Georgian)",
    },
    { name: "description", type: "textarea", required: true },
    {
      name: "descriptionKa",
      type: "textarea",
      required: true,
      label: "Description (Georgian)",
    },
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
