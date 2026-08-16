import type { GlobalConfig } from "payload";

// Singleton content for the main / homepage. Every text block the page
// renders — hero, trust stats, process steps, workshop, booking CTA — lives
// here instead of the i18n dictionary, so it's editable from /admin without
// a code change. Bilingual via Payload's native `localized: true` (see the
// `localization` block in payload.config.ts) — each field carries a locale
// switcher in the admin UI instead of a hand-rolled "*Ka" sibling field.
export const Home: GlobalConfig = {
  slug: "home",
  admin: {
    description: "Editable copy and images for the site's main page (/).",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "kicker", type: "text", required: true, localized: true },
        { name: "line1", type: "text", required: true, localized: true },
        { name: "line2", type: "text", required: true, localized: true },
        {
          name: "line3a",
          type: "text",
          required: true,
          localized: true,
          admin: { description: "The turbo-red highlighted words, part 1." },
        },
        { name: "line3b", type: "text", required: true, localized: true },
        { name: "blurb", type: "textarea", required: true, localized: true },
        {
          name: "ctaLabel",
          type: "text",
          required: true,
          localized: true,
          label: "Catalog CTA label",
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
          admin: {
            description:
              "Hero photo — upload a new file or pick one already in Media.",
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
      admin: { description: "The four figures on the trust strip." },
      fields: [
        { name: "value", type: "text", required: true, localized: true },
        { name: "label", type: "text", required: true, localized: true },
      ],
    },
    {
      name: "inventory",
      type: "group",
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        { name: "lead", type: "textarea", required: true, localized: true },
        {
          name: "viewAllLabel",
          type: "text",
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: "journey",
      type: "group",
      admin: { description: "The 'From fault scan to sealed delivery' section." },
      fields: [
        { name: "kicker", type: "text", required: true, localized: true },
        { name: "title", type: "text", required: true, localized: true },
        { name: "lead", type: "textarea", required: true, localized: true },
        {
          name: "steps",
          type: "array",
          minRows: 1,
          labels: { singular: "Step", plural: "Steps" },
          fields: [
            {
              name: "n",
              type: "text",
              required: true,
              admin: { description: 'Step number, e.g. "01"' },
            },
            { name: "title", type: "text", required: true, localized: true },
            { name: "desc", type: "text", required: true, localized: true },
          ],
        },
      ],
    },
    {
      name: "workshop",
      type: "group",
      fields: [
        { name: "tag", type: "text", required: true, localized: true },
        { name: "title", type: "text", required: true, localized: true },
        { name: "blurb", type: "textarea", required: true, localized: true },
        {
          name: "scheduleVisitLabel",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
          admin: { description: "Workshop photo." },
        },
      ],
    },
    {
      name: "booking",
      type: "group",
      admin: { description: "The bottom 'Ready to spec your build?' band." },
      fields: [
        { name: "kicker", type: "text", required: true, localized: true },
        { name: "title1", type: "text", required: true, localized: true },
        { name: "title2", type: "text", required: true, localized: true },
        { name: "blurb", type: "textarea", required: true, localized: true },
      ],
    },
  ],
};
