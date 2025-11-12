import type { NextConfig } from "next";

const resolveAssetPrefix = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return undefined;
};

const nextConfig: NextConfig = {
  assetPrefix: resolveAssetPrefix(),
  trailingSlash: true,
};

export default nextConfig;
