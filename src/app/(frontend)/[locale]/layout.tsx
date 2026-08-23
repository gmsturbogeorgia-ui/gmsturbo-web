import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  Noto_Sans_Georgian,
} from "next/font/google";
import "../globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import { TaxonomyProvider } from "@/lib/i18n/taxonomy-context";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n/locales";
import { getTaxonomies } from "@/lib/getTaxonomies";
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

// Site-level copy that differs per language. Page-level titles come from each
// page's own generateMetadata and slot into the `template` below.
const SITE_META: Record<
  Locale,
  { title: string; description: string; ogLocale: string }
> = {
  ka: {
    title: "GMS Turbo Georgia - ტურბოკომპრესორების ინჟინერია",
    description:
      "ტურბოკომპრესორების გაყიდვა, დიაგნოსტიკა, აღდგენა და წარმადობის გადაწყვეტები თბილისში.",
    ogLocale: "ka_GE",
  },
  en: {
    title: "GMS Turbo Georgia - Premium Turbocharger Engineering",
    description:
      "Premium turbocharger sales, diagnostics, repair and performance solutions in Tbilisi, Georgia.",
    ogLocale: "en_US",
  },
};

// Pre-render both language shells rather than resolving the segment per
// request.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const meta = SITE_META[locale];

  return {
    metadataBase: new URL("https://gmsturbo.ge"),
    title: {
      default: meta.title,
      template: "%s - GMS Turbo Georgia",
    },
    description: meta.description,
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
    // Tells search engines the two language versions are the same page, not
    // duplicates competing with each other. `x-default` is what a searcher
    // with no matching language preference gets.
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ka: "/ka",
        en: "/en",
        "x-default": "/ka",
      },
    },
    openGraph: {
      siteName: "GMS Turbo Georgia",
      type: "website",
      locale: meta.ogLocale,
      images: ["/og-image.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      site: "@gmsturbo",
    },
  };
}

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
  telephone: "+995 551 24 42 22",
  priceRange: "$$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tbilisi",
    addressCountry: "GE",
  },
  areaServed: "GE",
  // `sameAs` is how search engines tie these profiles to the business, so
  // the same three links the footer shows belong here too.
  sameAs: [
    "https://www.instagram.com/turbogms/",
    "https://www.facebook.com/p/GMS-TURBO-61566147999204/",
    "https://www.tiktok.com/@gmsturbogeorgia",
  ],
};

// This is the root layout for the whole public site — it owns <html>/<body>,
// which is why the locale segment sits above every page rather than inside
// one. `lang` is then correct in the very first byte of HTML, where crawlers
// and screen readers read it, instead of being patched in by an effect after
// hydration the way the localStorage-based toggle used to do it.
//
// Taxonomies are fetched here rather than per page because product cards —
// and so category and make labels — appear on the home, catalog, showroom and
// product-detail pages alike.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Anything that isn't a real locale is a 404, not a silent fallback —
  // otherwise /kah/catalog would quietly render the Georgian site under a URL
  // that should not exist, and search engines would index it.
  if (!isLocale(locale)) notFound();

  const taxonomies = await getTaxonomies(locale);

  return (
    <html
      lang={locale}
      className={`${bricolage.variable} ${instrument.variable} ${notoGeorgian.variable}`}
    >
      <body className="bg-paper text-ink-soft antialiased">
        <LanguageProvider locale={locale}>
          <TaxonomyProvider taxonomies={taxonomies}>
            <BookingProvider>{children}</BookingProvider>
          </TaxonomyProvider>
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
