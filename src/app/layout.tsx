import type { Metadata, Viewport } from "next";
import {
  Anton,
  Noto_Sans_Georgian,
  Oswald,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import { BookingProvider } from "@/components/Booking";

// Anton — a bold, ultra-condensed Google Font built for big poster-style
// headlines. Replaces the generic Bebas Neue as the site's headline face;
// same tall, high-impact role, but a distinct, more deliberate shape for an
// "industrial precision" turbo-engineering brand. Anton only ships one
// static weight (400), which is by design for this kind of display face.
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

// Noto Sans Georgian — Anton, Oswald, Inter and JetBrains Mono only cover
// Latin glyphs, so Georgian (Mkhedruli) text was silently falling back to
// whatever generic sans the OS ships. Listed as the fallback in every font
// stack below, so any Georgian character renders in this font automatically
// (per Unicode-range coverage) while Latin/digits/codes keep using the
// primary faces.
const notoGeorgian = Noto_Sans_Georgian({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["georgian"],
  variable: "--font-georgian",
  display: "swap",
});

const oswald = Oswald({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
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
  themeColor: "#050505",
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
      className={`${anton.variable} ${notoGeorgian.variable} ${oswald.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-background text-foreground">
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
