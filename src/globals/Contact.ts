import type { GlobalConfig } from "payload";

// Singleton content for /contact. Same pattern as src/globals/Home.ts:
// every text block the page renders lives here instead of the i18n
// dictionary, editable from /admin. Bilingual via Payload's native
// `localized: true` (see the `localization` block in payload.config.ts).
export const Contact: GlobalConfig = {
  slug: "contact",
  admin: {
    description: "Editable copy and images for /contact.",
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
          admin: { description: "Eyebrow, e.g. \"Tsereteli Ave 114, Tbilisi\"." },
        },
        { name: "title1", type: "text", required: true, localized: true },
        { name: "title2", type: "text", required: true, localized: true },
        { name: "blurb", type: "textarea", required: true, localized: true },
      ],
    },
    {
      name: "info",
      type: "group",
      admin: { description: "The four 'reach us' blocks." },
      fields: [
        { name: "phoneLabel", type: "text", required: true, localized: true },
        {
          name: "phone",
          type: "text",
          required: true,
          admin: { description: "E.g. +995 32 2 99 00 00" },
        },
        { name: "emailLabel", type: "text", required: true, localized: true },
        { name: "email", type: "text", required: true },
        {
          name: "addressLabel",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "addressLine1",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "addressLine2",
          type: "text",
          required: true,
          localized: true,
        },
        { name: "hoursLabel", type: "text", required: true, localized: true },
        { name: "hoursVal", type: "text", required: true, localized: true },
        {
          name: "saturdayLabel",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "saturdayVal",
          type: "text",
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: "booking",
      type: "group",
      admin: { description: "The 'Prefer we call you?' band." },
      fields: [
        { name: "kicker", type: "text", required: true, localized: true },
        { name: "title1", type: "text", required: true, localized: true },
        { name: "title2", type: "text", required: true, localized: true },
        { name: "blurb", type: "textarea", required: true, localized: true },
      ],
    },
    {
      name: "findUs",
      type: "group",
      admin: { description: "The showroom photo + caption at the bottom." },
      fields: [
        { name: "kicker", type: "text", required: true, localized: true },
        { name: "title", type: "text", required: true, localized: true },
        {
          name: "image",
          type: "text",
          required: true,
          admin: {
            description:
              "Showroom photo path, e.g. /images/showroom-display-minimal.jpeg",
          },
        },
        { name: "caption", type: "text", required: true, localized: true },
      ],
    },
  ],
};
