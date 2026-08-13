import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Products } from "./collections/Products";
import { Home } from "./globals/Home";
import { Contact } from "./globals/Contact";
import { Showroom } from "./globals/Showroom";
import { Catalog } from "./globals/Catalog";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "— GMS Turbo Admin",
    },
  },
  collections: [Users, Media, Products],
  globals: [Home, Contact, Showroom, Catalog],
  editor: lexicalEditor(),
  // Content locales. Every `localized: true` field (product tagline/
  // description, all homepage copy) gets a locale switcher in /admin instead
  // of a hand-rolled "*Ka" sibling field. `fallback: true` means an
  // untranslated ka value falls back to en rather than rendering blank.
  localization: {
    locales: [
      { label: "English", code: "en" },
      { label: "ქართული", code: "ka" },
    ],
    defaultLocale: "en",
    fallback: true,
  },
  // Set in .env — see .env.example. Falls back to a dev-only value so local
  // `npm run dev` doesn't hard-crash if the env var is missing, but this
  // MUST be a real secret in any deployed environment.
  secret: process.env.PAYLOAD_SECRET || "dev-only-insecure-secret-change-me",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  sharp,
});
