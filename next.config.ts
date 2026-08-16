import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

// next/image refuses any host that isn't allowlisted, so derive the pattern
// from the same env var Payload builds media URLs with (see .env.example).
// Empty/unset — local disk storage — leaves the list empty and only the
// localPatterns entry applies.
const publicUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL;
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] =
  publicUrl ? [new URL(`${publicUrl.replace(/\/+$/, "")}/**`)] : [];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    localPatterns: [{ pathname: "/api/media/file/**" }],
    remotePatterns,
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
