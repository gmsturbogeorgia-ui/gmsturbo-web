import type { GlobalConfig } from "payload";

// Singleton content for /showroom. Same pattern as src/globals/Home.ts and
// src/globals/Contact.ts: every text block the page renders lives here
// instead of the i18n dictionary, editable from /admin. Bilingual via
// Payload's native `localized: true` (see payload.config.ts's
// `localization` block).
export const Showroom: GlobalConfig = {
  slug: "showroom",
  admin: {
    description: "Editable copy and images for /showroom.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        {
          name: "tag",
          type: "text",
          required: true,
          localized: true,
          admin: {
            description: 'Eyebrow, e.g. "Flagship · Tsereteli Ave 114, Tbilisi".',
          },
        },
        { name: "title1", type: "text", required: true, localized: true },
        { name: "title2", type: "text", required: true, localized: true },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
          admin: {
            description:
              "Hero photo. Upload a new file or pick one already in Media.",
          },
        },
      ],
    },
    {
      name: "stats",
      type: "array",
      minRows: 4,
      maxRows: 4,
      labels: { singular: "Stat", plural: "Stats" },
      admin: {
        description: "The four figures below the hero (hours, viewings, …).",
      },
      fields: [
        { name: "value", type: "text", required: true, localized: true },
        { name: "label", type: "text", required: true, localized: true },
      ],
    },
    {
      name: "gallery",
      type: "group",
      fields: [
        { name: "kicker", type: "text", required: true, localized: true },
        { name: "title", type: "text", required: true, localized: true },
        { name: "lead", type: "textarea", required: true, localized: true },
        {
          name: "bannerImage",
          type: "upload",
          relationTo: "media",
          required: true,
          admin: { description: "Full-width banner photo." },
        },
        {
          name: "bannerCaption",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "items",
          type: "array",
          minRows: 6,
          maxRows: 6,
          labels: { singular: "Photo", plural: "Photos" },
          admin: { description: "The six mosaic tiles after the banner." },
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              required: true,
            },
            { name: "caption", type: "text", required: true, localized: true },
          ],
        },
      ],
    },
    {
      name: "display",
      type: "group",
      admin: { description: "The 'On display' product grid section." },
      fields: [
        { name: "kicker", type: "text", required: true, localized: true },
        { name: "title", type: "text", required: true, localized: true },
        {
          name: "fullCatalogLabel",
          type: "text",
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: "visit",
      type: "group",
      fields: [
        { name: "kicker", type: "text", required: true, localized: true },
        { name: "title1", type: "text", required: true, localized: true },
        { name: "title2", type: "text", required: true, localized: true },
        { name: "blurb", type: "textarea", required: true, localized: true },
        {
          name: "addressLabel",
          type: "text",
          required: true,
          localized: true,
        },
        { name: "address", type: "text", required: true, localized: true },
        { name: "callLabel", type: "text", required: true, localized: true },
        { name: "phone", type: "text", required: true },
        { name: "emailLabel", type: "text", required: true, localized: true },
        { name: "email", type: "text", required: true },
      ],
    },
  ],
};
