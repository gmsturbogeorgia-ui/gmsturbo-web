import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Products } from "./collections/Products";
import { Categories } from "./collections/Categories";
import { Vehicles } from "./collections/Vehicles";
import { VehicleModels } from "./collections/VehicleModels";
import { VehicleGenerations } from "./collections/VehicleGenerations";
import { Home } from "./globals/Home";
import { Contact } from "./globals/Contact";
import { Showroom } from "./globals/Showroom";
import { Catalog } from "./globals/Catalog";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Cloudflare R2 speaks the S3 API, so the stock s3Storage plugin drives it —
// see .env.example for where each value comes from. The plugin is only enabled
// when every credential is present; otherwise Media falls back to local disk
// (public/media) so a fresh clone with no .env still runs.
const r2 = {
  endpoint: process.env.S3_ENDPOINT,
  bucket: process.env.S3_BUCKET,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
};
const r2Enabled = Object.values(r2).every(Boolean);

// Bucket's public base URL. Trailing slashes are stripped so URL joins below
// don't produce a double slash.
const publicUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL?.replace(/\/+$/, "");

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "- GMS Turbo Admin",
    },
  },
  collections: [
    Users,
    Media,
    Products,
    Categories,
    // The vehicle tree, one collection per level: make -> model -> generation.
    Vehicles,
    VehicleModels,
    VehicleGenerations,
  ],
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
      // node-postgres defaults to 10 connections PER POOL, and there is one
      // pool per running instance — each serverless function, each build
      // worker. Against a session-mode pooler capped at 15 clients that runs
      // out almost immediately: two warm instances alone would exceed it.
      //
      // Every page here is `force-dynamic`, so a request always hits the DB;
      // what saves us is that a serverless instance serves one request at a
      // time, so a small pool is enough. Raise DATABASE_POOL_MAX only if the
      // database can actually take instances × max connections.
      max: Number(process.env.DATABASE_POOL_MAX ?? 3),
    },
  }),
  plugins: r2Enabled
    ? [
        s3Storage({
          collections: {
            // The plugin owns this collection's files: uploads (and every
            // generated size) go to R2 and local storage is disabled.
            //
            // These two options have to sit HERE rather than at the top
            // level — s3Storage only forwards `alwaysInsertFields`,
            // `collections` and `useCompositePrefixes` to the underlying
            // cloud-storage plugin, so a top-level `generateFileURL` is
            // silently dropped and every image keeps being served through
            // Payload's own /api/media/file/* route, i.e. streamed back out
            // of R2 through the Next server on every request. Pointing at
            // the bucket's public URL (r2.dev, later a custom domain) lets
            // Cloudflare serve them directly instead.
            media: publicUrl
              ? {
                  disablePayloadAccessControl: true,
                  generateFileURL: ({ filename, prefix }) =>
                    [publicUrl, prefix, filename].filter(Boolean).join("/"),
                }
              : true,
          },
          bucket: r2.bucket!,
          config: {
            endpoint: r2.endpoint,
            // R2 has no regions, but the AWS SDK requires one.
            region: "auto",
            credentials: {
              accessKeyId: r2.accessKeyId!,
              secretAccessKey: r2.secretAccessKey!,
            },
            // R2 rejects the SDK's default trailing checksum headers on
            // uploads; only send a checksum when the operation requires one.
            requestChecksumCalculation: "WHEN_REQUIRED",
            responseChecksumValidation: "WHEN_REQUIRED",
          },
        }),
      ]
    : [],
  sharp,
});
