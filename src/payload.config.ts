import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Products } from "./collections/Products";

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
  editor: lexicalEditor(),
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
