import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.STANDALONE !== 'false' ? 'standalone' : undefined,
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "d2pn8kiwq2w21t.cloudfront.net", pathname: "/original_images/**" },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: "assets.thelastsignal.org",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "www.lpi.usra.edu",
      },
      {
        protocol: "https",
        hostname: "lroc.im-ldi.com",
      },
      {
        protocol: "https",
        hostname: "www.lroc.asu.edu",
      },
      {
        protocol: "https",
        hostname: "lroc.asu.edu",
      },
      {
        protocol: "https",
        hostname: "photojournal.jpl.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "www.uahirise.org",
      },
      {
        protocol: "https",
        hostname: "uahirise.org",
      },
      {
        protocol: "https",
        hostname: "pds-geosciences.wustl.edu",
      },
      {
        protocol: "https",
        hostname: "pds-imaging.jpl.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "mars.nasa.gov",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/heroes/opportunity-rover", destination: "/heroes/opportunity", permanent: true },
      { source: "/heroes/opportunity-rover/:path*", destination: "/heroes/opportunity/:path*", permanent: true },
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: "https://thelastsignal.firebaseapp.com/__/auth/:path*",
      },
    ];
  },
};

export default nextConfig;

if (process.env.NODE_ENV === 'development') {
  import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
}
