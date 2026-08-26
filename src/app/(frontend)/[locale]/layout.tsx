import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  Noto_Sans_Georgian,
} from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import { TaxonomyProvider } from "@/lib/i18n/taxonomy-context";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n/locales";
import { getTaxonomies } from "@/lib/getTaxonomies";
import { OG_IMAGE } from "@/lib/i18n/metadata";
import { BookingProvider } from "@/components/Booking";
import { JsonLd } from "@/components/JsonLd";
import { businessNode, graph, websiteNode } from "@/lib/structured-data";

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
// Georgian text would silently fall back to whatever sans the OS ships. It
// holds all Georgian body copy, and sits last under Archy for the characters
// Archy has no glyph for (Mtavruli, ₾, the archaic letters).
const notoGeorgian = Noto_Sans_Georgian({
  weight: ["400", "500", "600", "700"],
  subsets: ["georgian"],
  variable: "--font-georgian",
  display: "swap",
});

// Archy (typeface.ge) — the Georgian display face. Two static files at the two
// ends of the weight axis: AR Archy Thin is a 100-weight hairline monoline,
// Archy EDT Bold a 700-weight heavy grotesque. Declaring them as one family
// lets CSS weight matching route headings to Bold with no extra classes, since
// every heading here is font-semibold or font-bold.
//
// Archy is in --font-display only. Both files are display drawings; the
// hairline was tried on body copy and is unreadable at 16px on a dark ground,
// so Georgian body text stays on Noto above. The hairline is still loaded —
// `font-display font-thin` reaches it — but nothing uses it today, and a face
// no text matches is never downloaded.
//
// adjustFontFallback is off on purpose. It would append an Arial-metric
// fallback face to this family, and that face would swallow the Georgian
// characters Archy does not draw (Mtavruli and ₾) before the chain in
// globals.css could hand them to Noto.
const archy = localFont({
  src: [
    { path: "../../../fonts/archy-thin.ttf", weight: "100", style: "normal" },
    { path: "../../../fonts/archy-bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-archy",
  display: "swap",
  adjustFontFallback: false,
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
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      site: "@gmsturbo",
      images: [OG_IMAGE],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#fbf9f5",
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
      className={`${bricolage.variable} ${instrument.variable} ${notoGeorgian.variable} ${archy.variable}`}
    >
      <body className="bg-paper text-ink-soft antialiased">
        <LanguageProvider locale={locale}>
          <TaxonomyProvider taxonomies={taxonomies}>
            <BookingProvider>{children}</BookingProvider>
          </TaxonomyProvider>
        </LanguageProvider>
        {/* The business and the site itself, emitted on every page: the local
            rich result is built from the address, hours and coordinates on
            this node, and a crawler that only ever reaches a product page has
            to find them there too. Every other page adds its own nodes and
            refers back to this one by `@id` rather than restating it. */}
        <JsonLd data={graph(businessNode(locale), websiteNode(locale))} />
      </body>
    </html>
  );
}
