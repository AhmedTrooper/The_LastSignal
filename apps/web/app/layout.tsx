import type { Metadata, Viewport } from "next";
import { Inter, Jost, IBM_Plex_Mono, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./clubhouse.css";
import { defaultSEO } from "@/lib/seo";
import { WebSiteSchema } from "@/app/components/structured-data";
import TabBar from "@/app/components/tab-bar";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

/** Handwriting for photo captions on the home page. */
const caveat = Caveat({
  weight: ["500"],
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = defaultSEO;

export const viewport: Viewport = {
  themeColor: "#5b2eff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jost.variable} ${plexMono.variable} ${caveat.variable}`} data-scroll-behavior="smooth">
      <head>
        <WebSiteSchema />
      </head>
      <body className="pb-tabbar">
        <AuthProvider>
          {children}
          <TabBar />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
