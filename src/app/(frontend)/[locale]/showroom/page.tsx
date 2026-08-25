import type { Metadata } from "next";
import { getShowroom } from "@/lib/getShowroom";
import { getProducts } from "@/lib/getProducts";
import { localeAlternates, OG_IMAGE } from "@/lib/i18n/metadata";
import { localeHref, type Locale } from "@/lib/i18n/locales";
import { ShowroomClient } from "./ShowroomClient";

// Read the showroom page content and highlighted products from the
// Payload/Postgres DB on each request — same reasoning as /
// (src/app/(frontend)/page.tsx).
export const dynamic = "force-dynamic";

const META: Record<Locale, { title: string; description: string }> = {
  ka: {
    title: "სავიტრინო დარბაზი - თბილისი",
    description:
      "GMS Turbo-ს სავიტრინო დარბაზი და საწყობი თბილისში — ტურბინები, კარტრიჯები, აქტუატორები და კოლექტორები ადგილზე. მობრძანდით, ნახეთ ნაწილები საკუთარი თვალით და მიიღეთ პროფესიონალური კონსულტაცია.",
  },
  en: {
    title: "Showroom - Tbilisi Flagship",
    description:
      "The GMS Turbo showroom and warehouse in Tbilisi — turbochargers, cartridges, actuators and manifolds in stock. Come see the parts in person and get expert advice.",
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
    alternates: localeAlternates(locale, "/showroom"),
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: localeHref(locale, "/showroom"),
      images: [OG_IMAGE],
    },
    twitter: {
      title: meta.title,
      description: meta.description,
      images: [OG_IMAGE],
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  name: "GMS Turbo Georgia - Flagship Showroom",
  image: "/og-image.jpg",
  telephone: "+995 551 24 42 22",
  address: {
    "@type": "PostalAddress",
    streetAddress: "71, Sakartvelos Ertianobistvis Mebrdzolta Street",
    addressLocality: "Tbilisi",
    postalCode: "0163",
    addressCountry: "GE",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "11:00",
      closes: "17:00",
    },
  ],
};

export default async function ShowroomPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [showroom, products] = await Promise.all([
    getShowroom(locale),
    getProducts(locale),
  ]);
  const highlights = products.slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShowroomClient showroom={showroom} highlights={highlights} />
    </>
  );
}
