/**
 * Every image field in the CMS is an upload relationship to the `media`
 * collection (see src/collections/Media.ts), so Payload returns the media
 * doc rather than a path. The site renders plain `<img src>` with its own
 * alt text and dimensions, so each getter flattens the relationship down to
 * a URL string here and the presentation components stay unchanged.
 *
 * The URL itself comes from wherever media is stored: the R2 bucket's public
 * URL when the bucket is configured, otherwise Payload's local
 * /api/media/file/* route (see the s3Storage block in payload.config.ts).
 */
export type MediaRef =
  | { url?: string | null }
  | number
  | string
  | null
  | undefined;

/**
 * Returns "" when the relationship is empty, or when the query ran at
 * `depth: 0` and so returned a bare id instead of the populated doc — the
 * getters all query at depth 1. Callers rendering a list should drop empty
 * entries rather than emit `<img src="">`, which makes the browser re-request
 * the current page as an image.
 */
export function mediaUrl(ref: MediaRef): string {
  if (ref && typeof ref === "object" && typeof ref.url === "string") {
    return ref.url;
  }
  return "";
}
