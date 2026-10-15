import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.STANDALONE !== 'false' ? 'standalone' : undefined,
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;

if (process.env.NODE_ENV === 'development') {
  import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
}
