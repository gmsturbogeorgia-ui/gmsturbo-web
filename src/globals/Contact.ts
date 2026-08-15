import type { GlobalConfig } from "payload";
import {
  formatLatLng,
  isShortMapLink,
  parseLatLng,
  resolveShortMapLink,
} from "@/lib/mapQuery";

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
      admin: { description: "The map + caption at the bottom." },
      fields: [
        { name: "kicker", type: "text", required: true, localized: true },
        { name: "title", type: "text", required: true, localized: true },
        {
          name: "mapQuery",
          type: "text",
          admin: {
            description:
              "Paste any Google Maps link to the shop — the short share link (maps.app.goo.gl/…) works too — or type coordinates as \"lat,lng\". Whatever you paste is converted to coordinates when you hit save, because the map itself is OpenStreetMap and can't look up an address. Empty falls back to the workshop's default pin.",
            placeholder: "https://maps.app.goo.gl/… or 41.697529,44.886512",
          },
          hooks: {
            // Runs before validate, so the field is already coordinates by
            // the time validate() checks it — and the editor sees the
            // resolved "lat,lng" in the form after saving.
            beforeValidate: [
              async ({ value }) => {
                if (typeof value !== "string" || !value.trim()) return value;
                const raw = value.trim();
                const link = isShortMapLink(raw)
                  ? ((await resolveShortMapLink(raw)) ?? raw)
                  : raw;
                const coords = parseLatLng(link);
                return coords ? formatLatLng(coords) : raw;
              },
            ],
          },
          validate: (value: string | null | undefined) => {
            if (!value || parseLatLng(value)) return true;
            if (isShortMapLink(value)) {
              return "Couldn't reach Google to expand that short link. Open it in a browser and paste the full google.com/maps URL instead.";
            }
            return "No coordinates in that value. Paste a Google Maps link to the shop, or type them directly as \"41.697529,44.886512\" — a street address alone can't be placed on the map.";
          },
        },
        {
          name: "mapZoom",
          type: "number",
          min: 3,
          max: 19,
          admin: {
            description:
              "Zoom level: 14 shows the district, 16 the street (default), 18 the building.",
            step: 1,
          },
        },
        { name: "caption", type: "text", required: true, localized: true },
      ],
    },
  ],
};
