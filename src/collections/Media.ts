import path from "path";
import { fileURLToPath } from "url";
import type { CollectionConfig } from "payload";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Upload-enabled collection for admin-managed images (product photos, gallery
// shots). When the R2 credentials are set, the s3Storage plugin in
// payload.config.ts takes this collection over: files go to the bucket, local
// storage is disabled, and staticDir below is unused.
//
// Without those credentials it falls back to disk — files under public/media,
// served at /api/media/file/*. staticDir is resolved to an absolute path here
// (rather than a bare relative string) so it doesn't depend on Payload's
// cwd-vs-config-file resolution rules — this collection file lives at
// src/collections/Media.ts, so public/media is two levels up.
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, "../../public/media"),
  },
};
