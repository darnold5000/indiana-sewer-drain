import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import { site } from "@/lib/site-config";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.shortName} | Sewer, Drain & Plumbing | Camby, IN`,
    template: `%s | ${site.shortName}`,
  },
  description:
    "Sewer, drain, and plumbing service in Camby and Central Indiana. Request service online, send photos, and get a direct response from Indiana Sewer & Drain LLC.",
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: site.businessName,
    title: `${site.shortName} | Sewer, Drain & Plumbing`,
    description:
      "Fast help when things stop flowing. Sewer, drain, and plumbing service throughout Central Indiana.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
