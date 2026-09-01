import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

// next/image refuses any host that isn't allowlisted, so derive the pattern
// from the same env var Payload builds media URLs with (see .env.example).
// Empty/unset — local disk storage — leaves the list empty and only the
// localPatterns entry applies.
const publicUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL?.replace(/\/+$/, "");
// A bare hostname ("cdn.example.com") is not a parseable URL, so assume https
// rather than crashing config load.
const publicOrigin = publicUrl
  ? /^https?:\/\//.test(publicUrl)
    ? publicUrl
    : `https://${publicUrl}`
  : undefined;

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] =
  publicOrigin ? [new URL(`${publicOrigin}/**`)] : [];

// The canonical origin (see src/lib/structured-data.ts) is the bare apex, so
// www.gmsturbo.ge has to hand visitors and crawlers over to it rather than
// serving a duplicate copy of every page.
const CANONICAL_HOST = "gmsturbo.ge";

/** What every public page is allowed to do in a search index. */
const INDEXABLE =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    localPatterns: [{ pathname: "/api/media/file/**" }],
    remotePatterns,
  },
  async redirects() {
    return [
      {
        // Config redirects run ahead of the locale middleware and cover every
        // path — pages, /api, /admin — so the www host never serves anything.
        source: "/:path*",
        has: [{ type: "host", value: `www.${CANONICAL_HOST}` }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // An audit reads a missing X-Robots-Tag as "unstated", so the header
        // says out loud what the <meta name="robots"> in the layout already
        // says — and adds the preview limits, which only exist as directives:
        // without max-image-preview:large Google shows a thumbnail instead of
        // the large image a turbo listing is worth, and the -1 values lift the
        // default caps on snippet length and video preview.
        source: "/:locale(ka|en)/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: INDEXABLE,
          },
        ],
      },
      {
        // ":path*" above matches one or more segments, so the two bare locale
        // roots need their own entry.
        source: "/:locale(ka|en)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: INDEXABLE,
          },
        ],
      },
      {
        // The same two paths public/robots.txt disallows. robots.txt only asks
        // a crawler not to fetch them; a URL it reaches some other way (a
        // stray link) can still be indexed unfetched. This header is the part
        // that actually says "do not index", and it is read on the response.
        source: "/:path(admin|api)/:rest*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/:locale(ka|en)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/:locale(ka|en)/catalog",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/:locale(ka|en)/catalog/:slug",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/:locale(ka|en)/showroom",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/:locale(ka|en)/contact",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
