import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.STANDALONE !== 'false' ? 'standalone' : undefined,
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "assets.science.nasa.gov", pathname: "/content/dam/science/**" },
      { protocol: "https", hostname: "www.nasa.gov", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "d2pn8kiwq2w21t.cloudfront.net", pathname: "/original_images/**" },
      { protocol: "https", hostname: "images-assets.nasa.gov", pathname: "/image/PIA00381/**" },
      { protocol: "https", hostname: "images-assets.nasa.gov", pathname: "/image/PIA00563/**" },
      { protocol: "https", hostname: "images-assets.nasa.gov", pathname: "/image/PIA00567/**" },
      { protocol: "https", hostname: "images-assets.nasa.gov", pathname: "/image/PIA00568/**" },
      { protocol: "https", hostname: "images-assets.nasa.gov", pathname: "/image/PIA00569/**" },
      { protocol: "https", hostname: "images-assets.nasa.gov", pathname: "/image/PIA13965/**" },
      { protocol: "https", hostname: "images-assets.nasa.gov", pathname: "/image/PIA13966/**" },
      { protocol: "https", hostname: "images-assets.nasa.gov", pathname: "/image/PIA16492/**" },
      { protocol: "https", hostname: "images-assets.nasa.gov", pathname: "/image/PIA16493/**" },
      { protocol: "https", hostname: "images-assets.nasa.gov", pathname: "/image/PIA16587/**" },
      { protocol: "https", hostname: "images-assets.nasa.gov", pathname: "/image/PIA16588/**" },
      { protocol: "https", hostname: "images-assets.nasa.gov", pathname: "/image/PIA16600/**" },
      { protocol: "https", hostname: "images-assets.nasa.gov", pathname: "/image/PIA16603/**" },
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
