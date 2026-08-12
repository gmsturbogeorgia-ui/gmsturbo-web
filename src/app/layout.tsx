import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  Noto_Sans_Georgian,
} from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import { BookingProvider } from "@/components/Booking";

// Two faces, not five. The previous build loaded Anton + Oswald + Inter +
// JetBrains Mono and used all four on a single screen, which is what made
// the type feel assembled rather than designed.
//
// Bricolage Grotesque — headline face. A humanist grotesque with genuine
// quirks in the a, g and R; it holds up at poster sizes without the rigid
// condensed-industrial cliché Anton brought. Variable, so one file covers
// the full 400–800 range the layouts need.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

// Instrument Sans — interface and body face. Slightly warm, tall x-height,
// reads cleanly at 14–18px where most of this site actually lives.
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

// Noto Sans Georgian — the Latin faces above carry no Mkhedruli glyphs, so
// Georgian text would silently fall back to whatever sans the OS ships.
// Listed as the fallback in every stack in globals.css, so Georgian
// characters resolve here automatically (by Unicode range) while
// Latin/digits keep the primary faces.
const notoGeorgian = Noto_Sans_Georgian({
  weight: ["400", "500", "600", "700"],
  subsets: ["georgian"],
  variable: "--font-georgian",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gmsturbo.ge"),
  title: {
    default: "GMS Turbo Georgia — Premium Turbocharger Engineering",
    template: "%s — GMS Turbo Georgia",
  },
  description:
    "Premium turbocharger sales, diagnostics, repair and performance solutions in Tbilisi, Georgia.",
  keywords: [
    "turbocharger",
    "turbo repair",
    "hybrid turbo",
    "billet turbo",
    "Tbilisi",
    "Georgia",
    "BMW turbo",
    "Audi turbo",
    "VSR balancing",
  ],
  authors: [{ name: "GMS Turbo Georgia" }],
  robots: { index: true, follow: true },
  openGraph: {
    siteName: "GMS Turbo Georgia",
    type: "website",
    locale: "ka_GE",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@gmsturbo",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf9f5",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  name: "GMS Turbo Georgia",
  description:
    "Premium turbocharger sales, diagnostics, repair and performance solutions.",
  image: "/og-image.jpg",
  telephone: "+995 32 2 99 00 00",
  priceRange: "$$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tbilisi",
    addressCountry: "GE",
  },
  areaServed: "GE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${instrument.variable} ${notoGeorgian.variable}`}
    >
      <body className="bg-paper text-ink-soft antialiased">
        <LanguageProvider>
          <BookingProvider>{children}</BookingProvider>
        </LanguageProvider>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
