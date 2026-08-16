import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Payload } from "payload";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(dirname, "../../public");

/**
 * Maps one of the seed's `/images/…` paths onto the id of the `media` doc
 * holding that file. Every image field in the CMS is an upload relationship
 * now (see src/collections/Media.ts), so the seed can't write a bare path —
 * it has to hand Payload a media id.
 */
export type MediaResolver = (publicPath: string) => number;

// "/images/products/turbo-cartridge-kit.jpeg" -> "Turbo cartridge kit".
// Only a starting point — alt text is editable per image in /admin, and
// should be rewritten there for anything user-facing.
function altFromPath(publicPath: string): string {
  const base = path.basename(publicPath, path.extname(publicPath));
  const words = base.replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * Uploads every given `/images/…` file into the `media` collection (which
 * means straight into R2 when the bucket is configured — see
 * payload.config.ts) and returns a lookup from path to media id.
 *
 * Idempotent: a media doc whose filename already matches is reused rather
 * than uploaded again, so re-running the seed doesn't pile up duplicates or
 * re-point content at fresh copies of the same photo.
 */
export async function buildMediaResolver(
  payload: Payload,
  publicPaths: string[],
): Promise<MediaResolver> {
  const byPath = new Map<string, number>();

  for (const publicPath of [...new Set(publicPaths)]) {
    const filename = path.basename(publicPath);
    const absolute = path.join(publicDir, publicPath);

    const existing = await payload.find({
      collection: "media",
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
    });

    if (existing.totalDocs > 0) {
      byPath.set(publicPath, existing.docs[0].id as number);
      continue;
    }

    if (!fs.existsSync(absolute)) {
      throw new Error(
        `Seed references ${publicPath} but public${publicPath} does not exist.`,
      );
    }

    const created = await payload.create({
      collection: "media",
      data: { alt: altFromPath(publicPath) },
      filePath: absolute,
    });
    byPath.set(publicPath, created.id as number);
    payload.logger.info(`Uploaded ${filename} to media`);
  }

  return (publicPath: string) => {
    const id = byPath.get(publicPath);
    if (id === undefined) {
      throw new Error(`No media uploaded for ${publicPath}`);
    }
    return id;
  };
}
