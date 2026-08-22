import type { Metadata } from "next";
import { getHome } from "@/lib/getHome";
import { getProducts } from "@/lib/getProducts";
import { localeAlternates } from "@/lib/i18n/metadata";
import { localeHref, type Locale } from "@/lib/i18n/locales";
import { HomeClient } from "./HomeClient";

// Read the home page content and featured products from the Payload/Postgres
// DB on each request — same reasoning as /catalog (src/app/catalog/page.tsx).
export const dynamic = "force-dynamic";

const META: Record<Locale, { title: string; description: string }> = {
  ka: {
    title: "GMS Turbo Georgia - ტურბოკომპრესორების ინჟინერია",
    description:
      "ტურბოკომპრესორების გაყიდვა, დიაგნოსტიკა, აღდგენა და წარმადობის გადაწყვეტები. ჰიბრიდული, ბილეტ და OEM ტურბოები, აწყობილი თბილისში.",
  },
  en: {
    title: "GMS Turbo Georgia - Premium Turbocharger Engineering",
    description:
      "Premium turbocharger sales, diagnostics, repair and performance solutions. Hybrid, billet and OEM turbos engineered in Tbilisi, Georgia.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale];

  return {
    title: meta.title,
    description: meta.description,
    alternates: localeAlternates(locale, "/"),
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: localeHref(locale, "/"),
      images: ["/og-image.jpg"],
    },
    twitter: {
      title: "GMS Turbo Georgia",
      description: meta.description,
      images: ["/og-image.jpg"],
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GMS Turbo Georgia",
  url: "/",
  inLanguage: ["ka-GE", "en-US"],
};

export default async function Index({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [home, products] = await Promise.all([
    getHome(locale),
    getProducts(locale),
  ]);
  const featured = products.slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient home={home} featured={featured} />
    </>
  );
}
