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

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    localPatterns: [{ pathname: "/api/media/file/**" }],
    remotePatterns,
  },
  async headers() {
    return [
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
