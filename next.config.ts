import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    localPatterns: [{ pathname: "/api/media/file/**" }],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
